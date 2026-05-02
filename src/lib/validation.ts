
export const PHONE_REGEX = /^[0-9+\s-()]{7,20}$/;

export const validatePhone = (phone: string) => {
  return PHONE_REGEX.test(phone);
};

export const cleanPhone = (phone: string) => {
  // Allow only digits, plus, and common separators
  return phone.replace(/[^0-9+\s-()]/g, '');
};

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const sanitizeString = (str: string) => {
  // Basic tag stripping
  return str.replace(/<[^>]*>?/gm, '').trim();
};

export const MAX_TEXT_LENGTH = 2000;
export const MAX_NAME_LENGTH = 120;
