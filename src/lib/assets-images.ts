import audiQ7 from "@/assets/rentCars/Audi Q7.png";
import bmw5 from "@/assets/rentCars/BMW 5 Series.jpg";
import hondaCRV from "@/assets/rentCars/Honda CR-V.jpg";
import hyundaiI20 from "@/assets/rentCars/Hyundai i20.jpg";
import mercedesGLE from "@/assets/rentCars/Mercedes-Benz GLE.jpg";
import toyotaCorolla from "@/assets/rentCars/Toyota Corolla.jpg";

import consult1 from "@/assets/consultation/consultingpagecar1.avif";
import consult2 from "@/assets/consultation/consultingpagecar2.png";

import rentCarImg from "@/assets/rentCars/Mercedes-Benz GLE.jpg";
import repairHeroImg from "@/assets/service/carrepair.png";
import partHeroImg from "@/assets/repairParts/Battery 12V 70Ah.png";
import showroom from "@/assets/herosection/hero-showroom.jpg";

const IMAGE_MAP: Record<string, string> = {
  // Cars
  "Audi Q7": audiQ7,
  "BMW 5 Series": bmw5,
  "Honda CR-V": hondaCRV,
  "Hyundai i20": hyundaiI20,
  "Mercedes-Benz GLE": mercedesGLE,
  "Toyota Corolla": toyotaCorolla,
  "rentCar": rentCarImg,

  // Transact fallbacks
  "transact1": audiQ7,
  "transact2": mercedesGLE,

  // Pages & Services
  "consulting-hero": consult1,
  "consulting-main": consult2,
  "workshop": repairHeroImg,
  "showroom": showroom,
  "carParts": partHeroImg,
};

export const getAssetImage = (name: string, type: "car" | "part" | "page" = "car") => {
  const img = IMAGE_MAP[name];
  if (img) return img;

  // Fallback logic
  if (type === "car") return mercedesGLE;
  if (type === "part") return partHeroImg;
  if (type === "page") return showroom;

  return null;
};
