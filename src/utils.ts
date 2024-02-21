export function toFirstVersion(decimal: number) {
    // Convert the number to a string.
    const decimalStr = decimal.toString();
    
    // Find the index of the decimal point.
    const pointIndex = decimalStr.indexOf('.');
    
    // If there's no decimal point, return the original number.
    if (pointIndex === -1) return decimal;
    
    // Find the position of the first non-zero digit after the decimal point.
    const firstNonZeroIndex = decimalStr.slice(pointIndex + 1).search(/[1-9]/) + pointIndex + 1;
    
    // If there's no non-zero digit after the decimal, return the original number.
    if (firstNonZeroIndex <= pointIndex) return decimal;
    
    // Calculate how many zeros are needed after the decimal point.
    const zerosNeeded = firstNonZeroIndex - pointIndex - 1;
    
    // Construct the new number.
    const newDecimal = '0.' + '0'.repeat(zerosNeeded) + '1';
    
    return parseFloat(newDecimal);
}