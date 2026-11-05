import { supabase } from './supabase';
import { cars as defaultCars, Car } from './carsData';

const LOCAL_CACHE_KEY = 'kunlaj_inventory_cache_v1';

// Helper to map Supabase DB row (snake_case or camelCase) to Car interface
export function mapDbRowToCar(row: any): Car {
  const priceNum = Number(row.price) || 0;
  return {
    id: row.id,
    make: row.make || '',
    model: row.model || '',
    year: Number(row.year) || new Date().getFullYear(),
    condition: row.condition || 'Tokunbo Standard',
    status: row.status || 'Working perfectly',
    price: priceNum,
    priceLabel: row.price_label || row.priceLabel || `₦${priceNum.toLocaleString()}`,
    engine: row.engine || {
      type: row.engine_type || 'Standard Engine',
      displacement: row.engine_displacement || 'N/A',
      horsepower: row.engine_horsepower || 'N/A',
      torque: row.engine_torque || 'N/A',
      transmission: row.engine_transmission || 'Automatic',
      fuelType: row.engine_fuel_type || 'Petrol',
    },
    images: Array.isArray(row.images) ? row.images : [],
    imageDescriptions: Array.isArray(row.image_descriptions)
      ? row.image_descriptions
      : Array.isArray(row.imageDescriptions)
      ? row.imageDescriptions
      : [],
    description: row.description || '',
    isSoldOut: Boolean(row.is_sold_out ?? row.isSoldOut ?? false),
    saleMessage: row.sale_message || row.saleMessage || '',
    location: row.location || 'Ipaja, Lagos',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

// Helper to map Car interface to Supabase DB payload
export function mapCarToDbPayload(car: Car) {
  return {
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    condition: car.condition,
    status: car.status,
    price: car.price,
    price_label: car.priceLabel,
    engine: car.engine,
    images: car.images,
    image_descriptions: car.imageDescriptions || [],
    description: car.description || '',
    is_sold_out: Boolean(car.isSoldOut),
    sale_message: car.saleMessage || '',
    location: car.location || 'Ipaja, Lagos',
  };
}

export function getLocalCachedCars(): Car[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Error reading local inventory cache:', e);
  }
  return null;
}

export function setLocalCachedCars(carsList: Car[]) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(carsList));
    window.dispatchEvent(new CustomEvent('kunlaj-inventory-updated', { detail: carsList }));
  } catch (e) {
    console.warn('Error saving local inventory cache:', e);
  }
}

const AUTO_SEED_KEY = 'kunlaj_supabase_autoseed_v2';
const DELETED_IDS_KEY = 'kunlaj_deleted_car_ids_v1';

function getDeletedIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addDeletedId(id: string) {
  try {
    const current = getDeletedIds();
    if (!current.includes(id)) {
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...current, id]));
    }
  } catch {
    // ignore
  }
}

export async function fetchInventory(): Promise<{ cars: Car[]; source: 'supabase' | 'cache' | 'static'; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const cached = getLocalCachedCars();
      if (cached) {
        return { cars: cached, source: 'cache', error: error.message };
      }
      return { cars: defaultCars, source: 'static', error: error.message };
    }

    const existingRows = data || [];
    const deletedIds = getDeletedIds();
    const existingIds = new Set(existingRows.map((r: any) => r.id));

    // Automatically push any of our 11 baseline cars that are not yet in Supabase
    // (unless the admin explicitly deleted them) so Supabase table is always up-to-date
    const missingDefaultCars = defaultCars.filter(
      (c) => !existingIds.has(c.id) && !deletedIds.includes(c.id)
    );

    const hasAutoSeeded = localStorage.getItem(AUTO_SEED_KEY) === 'true';

    if (existingRows.length === 0 || (missingDefaultCars.length > 0 && !hasAutoSeeded)) {
      const payloadsToInsert = (existingRows.length === 0 ? defaultCars : missingDefaultCars).map(mapCarToDbPayload);
      const { error: seedError } = await supabase
        .from('cars')
        .upsert(payloadsToInsert, { onConflict: 'id' });

      if (!seedError) {
        try {
          localStorage.setItem(AUTO_SEED_KEY, 'true');
        } catch {
          // ignore
        }
        const { data: refreshedData } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });

        if (refreshedData && refreshedData.length > 0) {
          const mapped = refreshedData.map(mapDbRowToCar);
          setLocalCachedCars(mapped);
          return { cars: mapped, source: 'supabase' };
        }
      }
    }

    if (existingRows.length > 0) {
      const mapped = existingRows.map(mapDbRowToCar);
      setLocalCachedCars(mapped);
      return { cars: mapped, source: 'supabase' };
    }

    const cached = getLocalCachedCars();
    if (cached) {
      return { cars: cached, source: 'cache' };
    }
    return { cars: defaultCars, source: 'static' };
  } catch (err: any) {
    const cached = getLocalCachedCars();
    if (cached) {
      return { cars: cached, source: 'cache', error: err?.message || 'Connection error' };
    }
    return { cars: defaultCars, source: 'static', error: err?.message || 'Connection error' };
  }
}

export async function upsertCarInInventory(car: Car): Promise<{ success: boolean; syncedToSupabase: boolean; error?: string }> {
  // Always update local cache immediately for instant optimistic UI across tabs/views
  const current = getLocalCachedCars() || [...defaultCars];
  const existingIdx = current.findIndex((c) => c.id === car.id);
  let updatedList: Car[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = car;
  } else {
    updatedList = [car, ...current];
  }
  setLocalCachedCars(updatedList);

  try {
    const payload = mapCarToDbPayload(car);
    const { error } = await supabase.from('cars').upsert(payload, { onConflict: 'id' });
    if (error) {
      return { success: true, syncedToSupabase: false, error: error.message };
    }
    return { success: true, syncedToSupabase: true };
  } catch (err: any) {
    return { success: true, syncedToSupabase: false, error: err?.message || 'Network error' };
  }
}

export async function deleteCarFromInventory(carId: string): Promise<{ success: boolean; syncedToSupabase: boolean; error?: string }> {
  addDeletedId(carId);
  const current = getLocalCachedCars() || [...defaultCars];
  const updatedList = current.filter((c) => c.id !== carId);
  setLocalCachedCars(updatedList);

  try {
    const { error } = await supabase.from('cars').delete().eq('id', carId);
    if (error) {
      return { success: true, syncedToSupabase: false, error: error.message };
    }
    return { success: true, syncedToSupabase: true };
  } catch (err: any) {
    return { success: true, syncedToSupabase: false, error: err?.message || 'Network error' };
  }
}

export async function seedDefaultCarsToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const payloads = defaultCars.map(mapCarToDbPayload);
    const { error } = await supabase.from('cars').upsert(payloads, { onConflict: 'id' });
    if (error) {
      return { success: false, count: 0, error: error.message };
    }
    setLocalCachedCars(defaultCars);
    return { success: true, count: payloads.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Failed to seed' };
  }
}

export async function uploadCarImageFile(file: File, carId: string, slotIndex: number): Promise<{ url: string; viaSupabase: boolean; error?: string }> {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${carId}/slot-${slotIndex + 1}-${Date.now()}-${cleanFileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('car-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from('car-images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        return { url: data.publicUrl, viaSupabase: true };
      }
    }

    // Fallback to optimized client data URL if bucket is not yet created
    const dataUrl = await fileToDataUrl(file);
    return {
      url: dataUrl,
      viaSupabase: false,
      error: uploadError?.message || 'Bucket car-images not configured yet; using embedded image preview.',
    };
  } catch (err: any) {
    const dataUrl = await fileToDataUrl(file);
    return {
      url: dataUrl,
      viaSupabase: false,
      error: err?.message || 'Storage upload fallback used.',
    };
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const SUPABASE_SETUP_SQL = `-- Run this once in your Supabase SQL Editor to enable live Inventory & 5-Image Storage:

-- 1. Create the cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id TEXT PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  condition TEXT NOT NULL,
  status TEXT NOT NULL,
  price NUMERIC NOT NULL,
  price_label TEXT NOT NULL,
  engine JSONB NOT NULL DEFAULT '{}'::jsonb,
  images TEXT[] NOT NULL DEFAULT '{}',
  image_descriptions TEXT[] NOT NULL DEFAULT '{}',
  description TEXT DEFAULT '',
  is_sold_out BOOLEAN DEFAULT FALSE,
  sale_message TEXT DEFAULT '',
  location TEXT DEFAULT 'Ipaja, Lagos',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Realtime for instant live website updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.cars;

-- 3. Enable Row Level Security (RLS) & Policies
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to cars"
  ON public.cars FOR SELECT
  USING (true);

CREATE POLICY "Allow admin insert/update/delete on cars"
  ON public.cars FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Create Public Storage Bucket for the 5 Car Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to car-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'car-images');

CREATE POLICY "Allow uploads to car-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Allow updates/deletes to car-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'car-images');
`;
