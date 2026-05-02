import alloyWheel from "@/assets/repairParts/Alloy Wheel 17.png";
import battery from "@/assets/repairParts/Battery 12V 70Ah.png";
import brakePads from "@/assets/repairParts/Brake Pads (Front Set).png";
import cabinFilter from "@/assets/repairParts/Cabin Air Filter.png";
import clutchKit from "@/assets/repairParts/Clutch Kit.png";
import engineOil from "@/assets/repairParts/Engine Oil 5W-30 (5L).png";
import headlight from "@/assets/repairParts/Headlight Assembly.png";
import shockAbsorbers from "@/assets/repairParts/Shock Absorbers (Pair).png";
import sparkPlug from "@/assets/repairParts/Spark Plug Set (4).png";
import timingBelt from "@/assets/repairParts/Timing Belt Kit.png";
import wiperBlades from "@/assets/repairParts/Wiper Blades (Pair).png";
import airFilter from "@/assets/repairParts/airfilter.png";
import repairFallback from "@/assets/service/carrepair.png";

// New specialized repair images
import transmissionImg from "@/assets/repairParts/Transmission and Drivetrain.png";
import radiatorImg from "@/assets/repairParts/Radiator and Cooling System Repair.png";
import suspensionImg from "@/assets/repairParts/Suspension and Steering Repair.png";
import acHeatingImg from "@/assets/repairParts/AC and Heating System Repair.png";

const REPAIR_MAP: Record<string, string> = {
  "Alloy Wheel 17": alloyWheel,
  "Battery 12V 70Ah": battery,
  "Brake Pads": brakePads,
  "Cabin Air Filter": cabinFilter,
  "Clutch Kit": clutchKit,
  "Engine Oil 5W-30 (5L)": engineOil,
  "Headlight Assembly": headlight,
  "Shock Absorbers": shockAbsorbers,
  "Spark Plug Set": sparkPlug,
  "Timing Belt Kit": timingBelt,
  "Wiper Blades": wiperBlades,
  "Air Filter": airFilter,
  "airfilter": airFilter,
  
  // New mappings
  "Transmission and Drivetrain": transmissionImg,
  "Radiator and Cooling System Repair": radiatorImg,
  "Suspension and Steering Repair": suspensionImg,
  "AC and Heating System Repair": acHeatingImg,
};

export const getRepairImage = (serviceName: string) => {
  const normalized = serviceName.toLowerCase();
  
  // High-priority exact matches
  if (normalized.includes("transmission") || normalized.includes("drivetrain")) return transmissionImg;
  if (normalized.includes("radiator") || normalized.includes("cooling")) return radiatorImg;
  if (normalized.includes("suspension") || normalized.includes("steering")) return suspensionImg;
  if (normalized.includes("ac ") || normalized.includes("heating")) return acHeatingImg;

  // Standard part matches
  if (normalized.includes("oil")) return engineOil;
  if (normalized.includes("brake")) return brakePads;
  if (normalized.includes("filter")) return cabinFilter;
  if (normalized.includes("clutch")) return clutchKit;
  if (normalized.includes("wheel") || normalized.includes("tire")) return alloyWheel;
  if (normalized.includes("battery")) return battery;
  if (normalized.includes("headlight")) return headlight;
  if (normalized.includes("shock")) return shockAbsorbers;
  if (normalized.includes("spark")) return sparkPlug;
  if (normalized.includes("belt")) return timingBelt;
  if (normalized.includes("wiper")) return wiperBlades;
  
  return REPAIR_MAP[serviceName] || repairFallback;
};
