export const formatPhoneNumber = (phoneNumber: number): string => {
  const numStr = phoneNumber.toString().padStart(10, "0");

  // Split into groups
  const areaCode = numStr.slice(0, 3);
  const prefix = numStr.slice(3, 6);
  const lineNum = numStr.slice(6);

  return `(${areaCode}) ${prefix}-${lineNum}`;
};
