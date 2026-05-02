export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
];

export const formatSlot = (slot: string) => {
  const [h] = slot.split(":");
  const hr = parseInt(h, 10);
  const ampm = hr >= 12 ? "PM" : "AM";
  const display = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
  
  // Custom display for range e.g. "9:00 AM - 10:00 AM"
  const endHr = hr + 1;
  const endAmpm = endHr >= 12 ? "PM" : "AM";
  const endDisplay = endHr > 12 ? endHr - 12 : endHr === 0 ? 12 : endHr;
  
  return `${display}:00 ${ampm} — ${endDisplay}:00 ${endAmpm}`;
};
