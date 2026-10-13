/**
 * Indian numbering system currency to words converter.
 * Example: 4999 => "Rupees Four Thousand Nine Hundred Ninety Only"
 * Example: 15420.50 => "Rupees Fifteen Thousand Four Hundred Twenty and Fifty Paise Only"
 */

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function convertBelowThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += ONES[n] + ' ';
  }
  return str.trim();
}

export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rupees Zero Only';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100);

  let result = '';

  const crore = Math.floor(integerPart / 10000000);
  let remainder = integerPart % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder %= 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder %= 1000;

  const hundreds = remainder;

  if (crore > 0) {
    result += `${convertBelowThousand(crore)} Crore `;
  }
  if (lakh > 0) {
    result += `${convertBelowThousand(lakh)} Lakh `;
  }
  if (thousand > 0) {
    result += `${convertBelowThousand(thousand)} Thousand `;
  }
  if (hundreds > 0) {
    result += `${convertBelowThousand(hundreds)} `;
  }

  result = result.trim();
  if (!result) {
    result = 'Zero';
  }

  let finalWords = `Rupees ${result}`;

  if (decimalPart > 0) {
    const paiseWords = convertBelowThousand(decimalPart);
    finalWords += ` and ${paiseWords} Paise`;
  }

  finalWords += ' Only';

  return isNegative ? `Minus ${finalWords}` : finalWords;
}
