const stringOfChars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-_~";
const radix = stringOfChars.length;

export function encode(number) {
  let output = "";
  do {
    const remainder = number % radix;
    const char = stringOfChars.charAt(remainder);
    output = char + output;
    number = (number - remainder) / radix;
  } while (number > 0);

  return output;
}

export function decode(string) {
  let number = 0;

  for (const i in string) {
    const char = string.charAt(i);
    number *= radix;
    number += stringOfChars.indexOf(char);
  }

  return number;
}
