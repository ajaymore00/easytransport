export function isValidMobileNumber(mobileNumber: string): boolean {
  return /^\d{10}$/.test(mobileNumber);
}
