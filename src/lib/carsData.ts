export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  status: string;
  price: number;
  priceLabel: string;
  engine: {
    type: string;
    displacement: string;
    horsepower: string;
    torque: string;
    transmission: string;
    fuelType: string;
  };
  images: string[];
}

export const cars: Car[] = [
  {
    id: "toyota-highlander-2016",
    make: "Toyota",
    model: "Highlander",
    year: 2016,
    condition: "Direct Tokunbo, Accident Free",
    status: "Working perfectly",
    price: 24500000,
    priceLabel: "₦24,500,000",
    engine: {
      type: "3.5L V6, DOHC 24-valve",
      displacement: "3.5L",
      horsepower: "270 hp @ 6,200 rpm",
      torque: "248 lb-ft @ 4,700 rpm",
      transmission: "6-speed automatic",
      fuelType: "Petrol",
    },
    images: [
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Thighlander01.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Thighlander02.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Thighlander03.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Thighlander04.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Thighlander05.jpg",
    ],
  },
  {
    id: "hyundai-santafe-2015",
    make: "Hyundai",
    model: "Santa Fe Sport",
    year: 2015,
    condition: "Spot (Nigeria Used)",
    status: "Working perfectly, good engine and gear, A/C working ok",
    price: 11500000,
    priceLabel: "₦11,500,000",
    engine: {
      type: "2.4L Inline-4, DOHC",
      displacement: "2.4L",
      horsepower: "190 hp @ 6,300 rpm",
      torque: "181 lb-ft @ 4,250 rpm",
      transmission: "6-speed automatic",
      fuelType: "Petrol",
    },
    images: [
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hyundai01.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hyundai02.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hyundai03.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hyundai04.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hyundai05.jpg",
    ],
  },
  {
    id: "mercedes-c300-2016",
    make: "Mercedes-Benz",
    model: "C300",
    year: 2016,
    condition: "Tokunbo, Standard",
    status: "Working perfectly, good engine and gear, A/C working ok",
    price: 12800000,
    priceLabel: "₦12,800,000",
    engine: {
      type: "2.0L Turbo Inline-4",
      displacement: "2.0L",
      horsepower: "241 hp @ 5,500 rpm",
      torque: "273 lb-ft @ 1,300-4,000 rpm",
      transmission: "7-speed automatic (7G-Tronic)",
      fuelType: "Petrol",
    },
    images: [
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Benz01.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Benz02.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Benz03.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Benz04.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Benz05.jpg",
    ],
  },
  {
    id: "nissan-cabstar-2010",
    make: "Nissan",
    model: "Cabstar",
    year: 2010,
    condition: "Direct Tokunbo, Petrol Engine",
    status: "Working perfectly",
    price: 13800000,
    priceLabel: "₦13,800,000",
    engine: {
      type: "2.5L Inline-4 Petrol",
      displacement: "2.5L",
      horsepower: "130 hp",
      torque: "270 Nm (199 lb-ft)",
      transmission: "5-speed manual",
      fuelType: "Petrol",
    },
    images: [
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Truck01.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Truck02.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Truck03.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Truck04.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Truck05.jpg",
    ],
  },
  {
    id: "toyota-tacoma-2007",
    make: "Toyota",
    model: "Tacoma",
    year: 2007,
    condition: "Nigeria Used",
    status: "Working perfectly, good engine and gear",
    price: 10800000,
    priceLabel: "₦10,800,000",
    engine: {
      type: "4.0L V6, DOHC 24-valve",
      displacement: "4.0L",
      horsepower: "236 hp @ 5,200 rpm",
      torque: "266 lb-ft @ 4,000 rpm",
      transmission: "5-speed automatic",
      fuelType: "Petrol",
    },
    images: [
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Toyotatruck01.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Toyotatruck02.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Toyotatruck03.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Toyotatruck04.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Toyotatruck05.jpg",
    ],
  },
  {
    id: "toyota-t100",
    make: "Toyota",
    model: "T100",
    year: 1996,
    condition: "Nigeria Used",
    status: "Working perfectly, good engine and gear",
    price: 6500000,
    priceLabel: "₦6,500,000",
    engine: {
      type: "3.4L V6, DOHC 24-valve",
      displacement: "3.4L",
      horsepower: "190 hp @ 4,800 rpm",
      torque: "220 lb-ft @ 3,400 rpm",
      transmission: "4-speed automatic",
      fuelType: "Petrol",
    },
    images: [
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Ttruck01.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Ttruck02.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Ttruck03.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Ttruck04.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Ttruck05.jpg",
    ],
  },
  {
    id: "toyota-hiace-2001",
    make: "Toyota",
    model: "Hiace",
    year: 2001,
    condition: "Foreign Used",
    status: "Working perfectly, good engine",
    price: 8500000,
    priceLabel: "₦8,500,000",
    engine: {
      type: "2.4L Inline-4 Diesel",
      displacement: "2.4L",
      horsepower: "94 hp",
      torque: "221 Nm (163 lb-ft)",
      transmission: "5-speed manual",
      fuelType: "Diesel",
    },
    images: [
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hiace01.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hiace02.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hiace03.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hiace04.jpg",
      "https://rir1tw7zermluiyr.public.blob.vercel-storage.com/Hiace05.jpg",
    ],
  },
];
