import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  Eye,
  Database,
  RefreshCw,
  Copy,
  Check,
  CarFront,
  Image as ImageIcon,
  DollarSign,
  Settings2,
  MapPin,
  FileText,
  Sparkles,
  ArrowUpRight,
  X,
  Lock,
} from 'lucide-react';
import { Car, cars as staticCars } from '../lib/carsData';
import {
  fetchInventory,
  upsertCarInInventory,
  deleteCarFromInventory,
  seedDefaultCarsToSupabase,
  uploadCarImageFile,
  SUPABASE_SETUP_SQL,
} from '../lib/inventoryService';
import { supabase } from '../lib/supabase';

const ADMIN_AUTH_SESSION_KEY = 'kunlaj_admin_auth_v1';
const ADMIN_PASSCODE = 'Kunlajautos2026';

const IMAGE_SLOT_LABELS = [
  '1. Primary Hero View (Front 3/4 Angle)',
  '2. Exterior Profile / Rear Angle',
  '3. Interior Cabin & Dashboard',
  '4. Rear Seating / Cargo Space',
  '5. Engine Bay & Mechanical View',
];

const DEFAULT_SLOT_PLACEHOLDERS = [
  'e.g., Clean accident-free front bumper, factory LED headlights, and original grille.',
  'e.g., Spotless exterior body paint with factory alloy rims and good tires.',
  'e.g., Neat leather interior, freezing A/C vents, and responsive infotainment.',
  'e.g., Spacious rear cabin / cargo bed with zero tear or wear.',
  'e.g., Untampered 2.4L engine bay — dry, smooth idle, and smooth gear selection.',
];

interface EmptyCarForm {
  id: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  status: string;
  price: string;
  priceLabel: string;
  location: string;
  description: string;
  isSoldOut: boolean;
  saleMessage: string;
  engineType: string;
  displacement: string;
  horsepower: string;
  torque: string;
  transmission: string;
  fuelType: string;
  images: string[];
  imageDescriptions: string[];
}

const getInitialFormState = (): EmptyCarForm => ({
  id: '',
  make: 'Toyota',
  model: '',
  year: 2016,
  condition: 'Tokunbo Standard, Accident Free',
  status: 'Working perfectly, good engine and gear, A/C working ok',
  price: '',
  priceLabel: '',
  location: 'Ipaja, Lagos',
  description: '',
  isSoldOut: false,
  saleMessage: 'SOLD OUT',
  engineType: '2.4L Inline-4',
  displacement: '2.4L',
  horsepower: '166 hp @ 6,000 rpm',
  torque: '165 lb-ft @ 4,000 rpm',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  images: ['', '', '', '', ''],
  imageDescriptions: ['', '', '', '', ''],
});

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [inventory, setInventory] = useState<Car[]>([]);
  const [dataSource, setDataSource] = useState<'supabase' | 'cache' | 'static'>('static');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'setup'>('upload');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EmptyCarForm>(getInitialFormState());
  const [toast, setToast] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (type: 'success' | 'warning' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 5500);
  };

  const loadInventory = async () => {
    setLoading(true);
    const result = await fetchInventory();
    setInventory(result.cars);
    setDataSource(result.source);
    setConnectionError(result.error || null);
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();

    // Realtime subscription so changes from any admin device reflect live
    const channel = supabase
      .channel('admin-cars-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, () => {
        loadInventory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-format Price Label when numeric price changes
  const handlePriceChange = (rawVal: string) => {
    const cleanNum = rawVal.replace(/[^0-9]/g, '');
    const numeric = Number(cleanNum);
    const formatted = cleanNum ? `₦${numeric.toLocaleString()}` : '';
    setForm((prev) => ({
      ...prev,
      price: cleanNum,
      priceLabel: formatted,
    }));
  };

  const handleImageSlotUrlChange = (index: number, url: string) => {
    setForm((prev) => {
      const next = [...prev.images];
      next[index] = url;
      return { ...prev, images: next };
    });
  };

  const handleImageSlotDescChange = (index: number, text: string) => {
    setForm((prev) => {
      const next = [...prev.imageDescriptions];
      next[index] = text;
      return { ...prev, imageDescriptions: next };
    });
  };

  const handleFileUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setUploadingSlot(index);
    const tempId =
      form.id ||
      `${form.make.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${form.model
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}-${form.year}`;

    const result = await uploadCarImageFile(file, tempId, index);
    handleImageSlotUrlChange(index, result.url);
    setUploadingSlot(null);

    if (result.viaSupabase) {
      showToast('success', `Image #${index + 1} uploaded directly to Supabase Storage!`);
    } else {
      showToast(
        'warning',
        `Image #${index + 1} ready! (Tip: Run the Supabase Storage SQL in Setup tab for cloud CDN hosting)`
      );
    }
  };

  const handleEditCar = (car: Car) => {
    const paddedImages = [...(car.images || [])];
    while (paddedImages.length < 5) paddedImages.push('');

    const paddedDescs = [...(car.imageDescriptions || [])];
    while (paddedDescs.length < 5) paddedDescs.push('');

    setEditingId(car.id);
    setForm({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      condition: car.condition,
      status: car.status,
      price: String(car.price),
      priceLabel: car.priceLabel,
      location: car.location || 'Ipaja, Lagos',
      description: car.description || '',
      isSoldOut: Boolean(car.isSoldOut),
      saleMessage: car.saleMessage || 'SOLD OUT',
      engineType: car.engine?.type || '',
      displacement: car.engine?.displacement || '',
      horsepower: car.engine?.horsepower || '',
      torque: car.engine?.torque || '',
      transmission: car.engine?.transmission || '',
      fuelType: car.engine?.fuelType || 'Petrol',
      images: paddedImages.slice(0, 5),
      imageDescriptions: paddedDescs.slice(0, 5),
    });
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(getInitialFormState());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.make.trim() || !form.model.trim() || !form.price) {
      showToast('error', 'Please fill in the Make, Model, and Price in Naira.');
      return;
    }

    setSaving(true);
    const slugId =
      editingId ||
      `${form.make.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${form.model
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-${form.year}-${Date.now().toString().slice(-4)}`;

    const validImages: string[] = [];
    const validDescriptions: string[] = [];
    form.images.forEach((imgUrl, idx) => {
      if (imgUrl && imgUrl.trim() !== '') {
        validImages.push(imgUrl.trim());
        validDescriptions.push(form.imageDescriptions[idx]?.trim() || '');
      }
    });

    const numericPrice = Number(form.price) || 0;
    const newCar: Car = {
      id: slugId,
      make: form.make.trim(),
      model: form.model.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      condition: form.condition.trim(),
      status: form.status.trim(),
      price: numericPrice,
      priceLabel: form.priceLabel.trim() || `₦${numericPrice.toLocaleString()}`,
      location: form.location.trim() || 'Ipaja, Lagos',
      description: form.description.trim(),
      isSoldOut: form.isSoldOut,
      saleMessage: form.isSoldOut ? form.saleMessage || 'SOLD OUT' : '',
      engine: {
        type: form.engineType.trim() || 'Standard Engine',
        displacement: form.displacement.trim() || 'N/A',
        horsepower: form.horsepower.trim() || 'N/A',
        torque: form.torque.trim() || 'N/A',
        transmission: form.transmission.trim() || 'Automatic',
        fuelType: form.fuelType.trim() || 'Petrol',
      },
      images: validImages,
      imageDescriptions: validDescriptions,
      createdAt: new Date().toISOString(),
    };

    const res = await upsertCarInInventory(newCar);
    await loadInventory();
    setSaving(false);

    if (res.syncedToSupabase) {
      showToast(
        'success',
        `${newCar.year} ${newCar.make} ${newCar.model} is now LIVE on Supabase and updated across the website!`
      );
    } else {
      showToast(
        'warning',
        `${newCar.year} ${newCar.make} ${newCar.model} saved & live locally! Complete the 1-click Supabase table setup to persist in cloud.`
      );
    }

    resetForm();
    setActiveTab('manage');
  };

  const handleToggleSoldStatus = async (car: Car) => {
    const updated: Car = {
      ...car,
      isSoldOut: !car.isSoldOut,
      status: !car.isSoldOut ? 'Sold' : 'Working perfectly, good engine and gear, A/C working ok',
      saleMessage: !car.isSoldOut ? 'SOLD OUT' : '',
    };
    const res = await upsertCarInInventory(updated);
    await loadInventory();
    if (res.syncedToSupabase) {
      showToast('success', `Updated ${car.make} ${car.model} status to ${updated.isSoldOut ? 'SOLD OUT' : 'AVAILABLE'}!`);
    } else {
      showToast('warning', `Updated ${car.make} ${car.model} status locally.`);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCarFromInventory(id);
    setConfirmDeleteId(null);
    await loadInventory();
    showToast('success', 'Vehicle removed from inventory.');
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    const res = await seedDefaultCarsToSupabase();
    setSeeding(false);
    if (res.success) {
      await loadInventory();
      showToast('success', `Successfully synced all ${res.count} existing vehicles into your Supabase database!`);
    } else {
      showToast(
        'error',
        `Could not seed Supabase table: ${res.error}. Please run the SQL script in the "Supabase Setup" tab first.`
      );
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError(false);
      setPasscodeInput('');
      try {
        sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
      } catch {
        // ignore storage restrictions
      }
    } else {
      setPasscodeError(true);
      setPasscodeInput('');
    }
  };

  const handleLockAdmin = () => {
    setIsAuthenticated(false);
    setPasscodeInput('');
    try {
      sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[82vh] bg-[#FAFAFA] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white border border-[#E5E8E6] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#C8102E]" />
          <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center mb-6">
            <Lock size={20} className="text-[#C8102E]" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-px bg-[#C8102E]"></span>
            <span className="text-[10px] font-mono tracking-widest text-[#C8102E] uppercase font-bold">
              RESTRICTED ACCESS
            </span>
          </div>

          <h1 className="text-2xl font-light tracking-tight text-[#1A1A1A] mb-2">
            Admin Inventory Studio
          </h1>
          <p className="text-xs text-[#4A5F54] mb-8 leading-relaxed">
            Enter the authorized dealership passcode to manage vehicle listings, 5-angle galleries, and live inventory status.
          </p>

          <form onSubmit={handlePasscodeSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                Security Passcode
              </label>
              <input
                type="password"
                required
                autoFocus
                autoComplete="new-password"
                placeholder="••••••••••••••••"
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  if (passcodeError) setPasscodeError(false);
                }}
                className={`w-full bg-[#FAFAFA] border ${
                  passcodeError ? 'border-[#C8102E]' : 'border-[#E5E8E6]'
                } px-4 py-3.5 text-sm font-mono tracking-widest focus:bg-white focus:border-[#1A1A1A] outline-none`}
              />
              {passcodeError && (
                <p className="text-[11px] font-mono text-[#C8102E] mt-2">
                  Invalid passcode. Access denied.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#C8102E] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer shadow-lg"
            >
              Unlock Admin Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F6F5] min-h-screen pb-24 text-[#1A1A1A]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#1A1A1A] text-white p-4 shadow-2xl border-l-4 border-[#C8102E] flex items-start gap-3 animate-fade-in">
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} className="text-green-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed font-medium flex-1">{toast.message}</div>
          <button onClick={() => setToast(null)} className="text-white/50 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="bg-white border-b border-[#E5E8E6] py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-px bg-[#C8102E]"></span>
              <span className="text-[10px] font-mono tracking-widest text-[#C8102E] uppercase font-bold">
                KUNLAJ AUTOS • LIVE INVENTORY COMMAND
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold ${
                  dataSource === 'supabase'
                    ? 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    dataSource === 'supabase' ? 'bg-green-600 animate-pulse' : 'bg-amber-600'
                  }`}
                />
                {dataSource === 'supabase' ? 'Supabase Live Connected' : 'Instant Hybrid Mode'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1A1A1A]">
              Admin Inventory Studio
            </h1>
            <p className="text-xs md:text-sm text-[#4A5F54] mt-1 max-w-2xl">
              Upload new vehicles, attach all 5 gallery angles with custom per-photo explanations, and toggle Sold statuses with zero code deployments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/showroom"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[#E5E8E6] hover:border-[#1A1A1A] text-xs font-bold tracking-wider uppercase transition-colors"
            >
              <Eye size={15} />
              <span>View Live Showroom</span>
              <ArrowUpRight size={14} />
            </Link>
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#1A1A1A] text-white hover:bg-[#C8102E] text-xs font-bold tracking-wider uppercase transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Database size={15} />
              <span>{seeding ? 'Syncing...' : 'Sync All 11 Cars to Supabase'}</span>
            </button>
            <button
              onClick={handleLockAdmin}
              className="inline-flex items-center gap-2 px-4 py-3 bg-[#FAFAFA] border border-[#E5E8E6] hover:border-[#C8102E] hover:text-[#C8102E] text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              title="Lock Admin Studio"
            >
              <Lock size={14} />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-8 flex flex-wrap gap-2 border-t border-[#E5E8E6] pt-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#C8102E] text-white shadow-md'
                : 'bg-[#FAFAFA] text-[#4A5F54] hover:text-[#1A1A1A] border border-[#E5E8E6]'
            }`}
          >
            <Plus size={16} />
            <span>{editingId ? 'Edit Vehicle Listing' : '1. Upload New Vehicle (5-Photo Studio)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-[#C8102E] text-white shadow-md'
                : 'bg-[#FAFAFA] text-[#4A5F54] hover:text-[#1A1A1A] border border-[#E5E8E6]'
            }`}
          >
            <CarFront size={16} />
            <span>2. Manage Active Fleet ({inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'setup'
                ? 'bg-[#C8102E] text-white shadow-md'
                : 'bg-[#FAFAFA] text-[#4A5F54] hover:text-[#1A1A1A] border border-[#E5E8E6]'
            }`}
          >
            <Sparkles size={16} />
            <span>3. Supabase Architecture & 1-Click SQL</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        {activeTab === 'upload' && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Vehicle Details & Engine Specs */}
            <div className="lg:col-span-7 space-y-8">
              {/* Card 1: Core Identity & Pricing */}
              <div className="bg-white border border-[#E5E8E6] p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E5E8E6] pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <CarFront size={18} className="text-[#C8102E]" />
                    <h2 className="text-sm font-bold tracking-widest uppercase">
                      {editingId ? `Editing: ${form.year} ${form.make} ${form.model}` : 'Step 1 • Vehicle Identity & Pricing'}
                    </h2>
                  </div>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-[11px] font-mono text-[#C8102E] underline uppercase cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Manufacturer (Make) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toyota, Lexus, Mercedes-Benz"
                      value={form.make}
                      onChange={(e) => setForm({ ...form, make: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Model Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RAV4, Highlander, C300"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Model Year *
                    </label>
                    <input
                      type="number"
                      required
                      min={1990}
                      max={2027}
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Price in Naira (Numbers Only) *
                    </label>
                    <div className="relative">
                      <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A5F54]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 7800000"
                        value={form.price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#E5E8E6] pl-9 pr-4 py-3 text-sm font-mono focus:bg-white focus:border-[#C8102E] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Formatted Display Price
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-generated e.g. ₦7,800,000"
                      value={form.priceLabel}
                      onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm font-mono text-[#C8102E] font-bold focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Condition Tier *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tokunbo Standard, Accident Free"
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Showroom Location
                    </label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A5F54]" />
                      <input
                        type="text"
                        placeholder="Ipaja, Lagos"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full bg-[#FAFAFA] border border-[#E5E8E6] pl-9 pr-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                    Mechanical Status Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Working perfectly, good engine and gear, A/C working ok"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                    Detailed Overview & Inspection Notes (Product Page Explanation)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide full buyer notes: customs duty status, suspension feel, interior condition, mileage notes, or special features..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-[#E5E8E6] p-4 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                  />
                </div>

                <div className="mt-5 pt-5 border-t border-[#E5E8E6] flex flex-wrap items-center justify-between gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isSoldOut}
                      onChange={(e) => setForm({ ...form, isSoldOut: e.target.checked })}
                      className="w-4 h-4 accent-[#C8102E]"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                      Mark Vehicle as SOLD OUT
                    </span>
                  </label>

                  {form.isSoldOut && (
                    <input
                      type="text"
                      placeholder="Custom Sold Banner (e.g. SOLD OUT)"
                      value={form.saleMessage}
                      onChange={(e) => setForm({ ...form, saleMessage: e.target.value })}
                      className="bg-[#FAFAFA] border border-[#E5E8E6] px-3 py-2 text-xs font-mono"
                    />
                  )}
                </div>
              </div>

              {/* Card 2: Engine & Technical Specifications */}
              <div className="bg-white border border-[#E5E8E6] p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-[#E5E8E6] pb-4 mb-6">
                  <Settings2 size={18} className="text-[#C8102E]" />
                  <h2 className="text-sm font-bold tracking-widest uppercase">
                    Step 2 • Engine & Powertrain Specifications
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Engine Configuration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2.4L Inline-4 or 3.5L V6 DOHC"
                      value={form.engineType}
                      onChange={(e) => setForm({ ...form, engineType: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Displacement
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2.4L"
                      value={form.displacement}
                      onChange={(e) => setForm({ ...form, displacement: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Horsepower
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 166 hp @ 6,000 rpm"
                      value={form.horsepower}
                      onChange={(e) => setForm({ ...form, horsepower: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Torque
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 165 lb-ft @ 4,000 rpm"
                      value={form.torque}
                      onChange={(e) => setForm({ ...form, torque: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Transmission
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6-speed automatic / 5-speed manual"
                      value={form.transmission}
                      onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#4A5F54] mb-2">
                      Fuel Type
                    </label>
                    <select
                      value={form.fuelType}
                      onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-[#E5E8E6] px-4 py-3 text-sm focus:bg-white focus:border-[#C8102E] outline-none"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: 5-Image Gallery Upload + Per-Image Explanations */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#E5E8E6] p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-[#E5E8E6] pb-4 mb-2">
                  <ImageIcon size={18} className="text-[#C8102E]" />
                  <h2 className="text-sm font-bold tracking-widest uppercase">
                    Step 3 • 5-Photo Portfolio & Explanations
                  </h2>
                </div>
                <p className="text-xs text-[#4A5F54] mb-6 leading-relaxed">
                  Upload 1 primary cover photo plus 4 detailed angles. You can either upload directly from your phone/computer or paste a hosted image link, and attach an inspection note to each photo.
                </p>

                <div className="space-y-6">
                  {[0, 1, 2, 3, 4].map((slotIdx) => {
                    const currentUrl = form.images[slotIdx] || '';
                    return (
                      <div
                        key={slotIdx}
                        className="p-4 bg-[#FAFAFA] border border-[#E5E8E6] hover:border-[#1A1A1A]/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]">
                            {IMAGE_SLOT_LABELS[slotIdx]}
                          </span>
                          {slotIdx === 0 && (
                            <span className="text-[9px] font-mono uppercase bg-[#C8102E] text-white px-2 py-0.5 font-bold">
                              Main Cover
                            </span>
                          )}
                        </div>

                        {/* Image Preview or Upload Box */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-3">
                          <div className="w-full sm:w-28 h-20 bg-white border border-[#E5E8E6] shrink-0 flex items-center justify-center overflow-hidden relative">
                            {currentUrl ? (
                              <>
                                <img
                                  src={currentUrl}
                                  alt={`Slot ${slotIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleImageSlotUrlChange(slotIdx, '')}
                                  className="absolute top-1 right-1 bg-black/70 text-white p-1 hover:bg-[#C8102E]"
                                  title="Remove image"
                                >
                                  <X size={12} />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-mono text-[#4A5F54] uppercase">Slot #{slotIdx + 1}</span>
                            )}
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                              <label className="flex-1 flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-[#C8102E] text-white text-[10px] font-bold uppercase tracking-wider py-2 px-3 cursor-pointer transition-colors">
                                <Upload size={13} />
                                <span>
                                  {uploadingSlot === slotIdx ? 'Uploading...' : 'Upload Photo File'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(slotIdx, e.target.files?.[0] || null)}
                                />
                              </label>
                            </div>

                            <input
                              type="text"
                              placeholder="Or paste image URL (https://...)"
                              value={currentUrl}
                              onChange={(e) => handleImageSlotUrlChange(slotIdx, e.target.value)}
                              className="w-full bg-white border border-[#E5E8E6] px-3 py-2 text-xs focus:border-[#C8102E] outline-none"
                            />
                          </div>
                        </div>

                        {/* Detailed Explanation for this specific photo */}
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] font-mono text-[#4A5F54] uppercase font-bold mb-1">
                            <FileText size={11} className="text-[#C8102E]" />
                            <span>Photo #{slotIdx + 1} Inspection Explanation</span>
                          </label>
                          <input
                            type="text"
                            placeholder={DEFAULT_SLOT_PLACEHOLDERS[slotIdx]}
                            value={form.imageDescriptions[slotIdx] || ''}
                            onChange={(e) => handleImageSlotDescChange(slotIdx, e.target.value)}
                            className="w-full bg-white border border-[#E5E8E6] px-3 py-2 text-xs text-[#1A1A1A] focus:border-[#C8102E] outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-8 w-full py-5 bg-[#C8102E] hover:bg-[#1A1A1A] text-white text-xs font-bold tracking-widest uppercase shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 size={18} />
                  <span>
                    {saving
                      ? 'Publishing Live to Website...'
                      : editingId
                      ? 'Save Changes & Update Live Website'
                      : 'Publish Vehicle Live to Showroom'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white border border-[#E5E8E6] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E8E6] mb-6">
              <div>
                <h2 className="text-lg font-medium text-[#1A1A1A]">Active & Sold Dealership Fleet</h2>
                <p className="text-xs text-[#4A5F54]">
                  Click "Edit" to update photos or explanations, or toggle "Mark Sold" in one click.
                </p>
              </div>
              <button
                onClick={loadInventory}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase px-4 py-2 border border-[#E5E8E6] hover:border-[#1A1A1A] self-start cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Refresh List</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map((car) => (
                <div
                  key={car.id}
                  className="border border-[#E5E8E6] bg-[#FAFAFA] flex flex-col overflow-hidden group hover:border-[#1A1A1A] transition-colors"
                >
                  <div className="relative h-48 bg-[#1A1A1A] overflow-hidden">
                    {car.images && car.images[0] ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40 text-xs font-mono uppercase">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase ${
                          car.isSoldOut ? 'bg-[#C8102E] text-white' : 'bg-green-600 text-white'
                        }`}
                      >
                        {car.isSoldOut ? 'SOLD OUT' : 'AVAILABLE'}
                      </span>
                      <span className="px-2.5 py-1 text-[10px] font-mono bg-black/70 text-white">
                        {car.images?.length || 0} Photos
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-[10px] font-mono text-[#C8102E] font-bold uppercase">
                      {car.make} • {car.year}
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">{car.model}</h3>
                    <div className="text-sm font-mono font-bold text-[#1A1A1A] mb-2">{car.priceLabel}</div>
                    <p className="text-xs text-[#4A5F54] line-clamp-2 mb-4">{car.status}</p>

                    <div className="mt-auto pt-4 border-t border-[#E5E8E6] flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditCar(car)}
                        className="flex-1 py-2 px-3 bg-white border border-[#E5E8E6] hover:border-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleToggleSoldStatus(car)}
                        className={`flex-1 py-2 px-3 text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                          car.isSoldOut
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-[#1A1A1A] text-white hover:bg-[#C8102E]'
                        }`}
                      >
                        {car.isSoldOut ? 'Set Available' : 'Mark Sold'}
                      </button>

                      {confirmDeleteId === car.id ? (
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="py-2 px-3 bg-[#C8102E] text-white text-[10px] font-bold uppercase cursor-pointer"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(car.id)}
                          className="py-2 px-2.5 bg-white border border-[#E5E8E6] text-[#4A5F54] hover:text-[#C8102E] hover:border-[#C8102E] cursor-pointer"
                          title="Delete vehicle"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#E5E8E6] p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-medium text-[#1A1A1A] mb-3">
                  How the Live Supabase Architecture Works
                </h2>
                <p className="text-xs text-[#4A5F54] leading-relaxed mb-6">
                  To ensure you never have to re-deploy code when adding a car or marking one sold, your website now uses a 3-layer real-time architecture:
                </p>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#FAFAFA] border-l-2 border-[#C8102E]">
                    <div className="font-bold text-[#1A1A1A] uppercase mb-1">
                      1. Public Storage Bucket (car-images)
                    </div>
                    <p className="text-[#4A5F54]">
                      Stores the 5 high-resolution angles per car directly in Supabase Storage instead of requiring external Vercel Blob links.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAFAFA] border-l-2 border-[#1A1A1A]">
                    <div className="font-bold text-[#1A1A1A] uppercase mb-1">
                      2. PostgreSQL Table (public.cars) + Per-Photo Captions
                    </div>
                    <p className="text-[#4A5F54]">
                      Holds the car name, price, engine specs, 5 image URLs (`images text[]`), and the 5 matching photo explanations (`image_descriptions text[]`).
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAFAFA] border-l-2 border-green-600">
                    <div className="font-bold text-[#1A1A1A] uppercase mb-1">
                      3. Instant Live Realtime Sync
                    </div>
                    <p className="text-[#4A5F54]">
                      As soon as you click "Publish Vehicle Live" in `/admin`, Supabase broadcasts the change and your Showroom, Home Page, and Sold Archive update immediately.
                    </p>
                  </div>
                </div>

                {connectionError && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <div className="font-bold uppercase mb-1">Current Connection Notice:</div>
                    <p className="font-mono text-[11px]">{connectionError}</p>
                    <p className="mt-2">
                       Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your Vercel/hosting environment match your active Supabase project, then run the SQL script on the right.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-[#1A1A1A] text-white p-6 md:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8102E] font-bold">
                      ONE-TIME SUPABASE SQL SETUP
                    </span>
                    <h3 className="text-base font-medium text-white mt-1">
                      Paste in Supabase Dashboard → SQL Editor → Run
                    </h3>
                  </div>
                  <button
                    onClick={copySqlToClipboard}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C8102E] hover:bg-white hover:text-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check size={15} /> : <Copy size={15} />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                  </button>
                </div>

                <pre className="text-[11px] font-mono text-green-300 bg-black/50 p-4 overflow-x-auto leading-relaxed border border-white/10 max-h-[460px]">
                  {SUPABASE_SETUP_SQL}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
