export function isValidEmail(email: string): boolean {
  return email.includes('@');
}

export function calculateAge(birthYear) {
  const currentYear = 2026;
  return currentYear - birthYear;
}
