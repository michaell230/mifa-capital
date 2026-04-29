export function maskData(data: string | null | undefined, visibleChars: number = 4): string {
  if (!data) return "-";
  if (data.length <= visibleChars) return data; // Data terlalu pendek untuk dimasking
  
  const maskedLength = data.length - visibleChars;
  const maskedSection = "•".repeat(maskedLength);
  const visibleSection = data.slice(-visibleChars);
  
  return `${maskedSection}${visibleSection}`;
}
