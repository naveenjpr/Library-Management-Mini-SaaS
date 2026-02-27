/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation
 * Minimum 8 characters, at least one uppercase, one lowercase, and one number
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Name validation
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Phone number validation (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Seat number validation
 */
export function isValidSeatNumber(seatNumber: string): boolean {
  const seatRegex = /^[A-Z]\d+$/;
  return seatRegex.test(seatNumber.trim());
}

/**
 * Business hours validation
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  const start = new Date(`2024-01-01T${startTime}`);
  const end = new Date(`2024-01-01T${endTime}`);
  return start < end;
}

/**
 * Date validation (future date)
 */
export function isValidFutureDate(date: string): boolean {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}
