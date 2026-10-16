export const generateParentAccessCode = (studentId: string): string => {
  let hash = 0;
  for (let i = 0; i < studentId.length; i++) {
    hash = (hash << 5) - hash + studentId.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash % 900000) + 100000;
  return `P-${code}`;
};