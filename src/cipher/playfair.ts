// Playfair Cipher

import {asciiToHex, hexToAscii} from './utils';

// Generate the key matrix from the key string for Playfair Cipher
export const generateKey: KeyGenerator = ({message}) => {
  // remove non-alphabets
  let keyArray: string[] = message
    .toUpperCase()
    .split('')
    .filter(c => c.match(/[A-Z]/));

  // replace J with I
  keyArray = keyArray.map(c => (c === 'J' ? 'I' : c));

  // add alphabet to the key (minus J)
  keyArray = [...keyArray, ...'ABCDEFGHIKLMNOPQRSTUVWXYZ'.split('')];

  // remove duplicates
  keyArray = keyArray.filter((c, i) => keyArray.indexOf(c) === i);
  return asciiToHex(keyArray.join(''));
};

export const parseKey = (key: string) =>
  // split into 5x5 matrix and return the matrix
  hexToAscii(key)
    .match(/.{5}/g)!
    .map(c => c.split(''));

// Encryption
export const encrypt: Encrypter = ({plaintext, key}) => {
  const keyMatrix: string[][] = parseKey(key);

  let plaintextArray: string[] = hexToAscii(plaintext)
    .toUpperCase()
    .split('')
    .filter(c => c.match(/[A-Z]/));
  plaintextArray = plaintextArray.map(c => (c === 'J' ? 'I' : c));
  plaintextArray = plaintextArray.reverse();

  const pairArray: string[][] = [];
  while (plaintextArray.length > 0) {
    const pair: string[] = [plaintextArray.pop()!];

    if (
      plaintextArray.length === 0 ||
      plaintextArray[plaintextArray.length - 1] === pair[0]
    ) {
      pair.push('X');
    } else {
      pair.push(plaintextArray.pop()!);
    }

    pairArray.push(pair);
  }

  const ciphertextArray = [];
  for (const pair of pairArray) {
    const r1 = keyMatrix.findIndex(row => row.includes(pair[0]));
    const c1 = keyMatrix[r1].findIndex(c => c === pair[0]);

    const r2 = keyMatrix.findIndex(row => row.includes(pair[1]));
    const c2 = keyMatrix[r2].findIndex(c => c === pair[1]);

    if (r1 === r2) {
      ciphertextArray.push(keyMatrix[r1][(c1 + 1) % 5]);
      ciphertextArray.push(keyMatrix[r2][(c2 + 1) % 5]);
    } else if (c1 === c2) {
      ciphertextArray.push(keyMatrix[(r1 + 1) % 5][c1]);
      ciphertextArray.push(keyMatrix[(r2 + 1) % 5][c2]);
    } else {
      ciphertextArray.push(keyMatrix[r1][c2]);
      ciphertextArray.push(keyMatrix[r2][c1]);
    }
  }

  return asciiToHex(ciphertextArray.join(''));
};

// Decryption
export const decrypt: Decrypter = ({ciphertext, key}) => {
  if (ciphertext === '') return '';
  ciphertext = hexToAscii(ciphertext);
  const keyMatrix: string[][] = parseKey(key);

  const ciphertextArray: string[][] = [];
  for (const pair of ciphertext.match(/.{2}/g)!) {
    ciphertextArray.push(pair.split(''));
  }

  const plaintextArray: string[] = [];
  for (const pair of ciphertextArray) {
    const r1: number = keyMatrix.findIndex(row => row.includes(pair[0]));
    const c1: number = keyMatrix[r1].findIndex(c => c === pair[0]);

    const r2: number = keyMatrix.findIndex(row => row.includes(pair[1]));
    const c2: number = keyMatrix[r2].findIndex(c => c === pair[1]);

    if (r1 === r2) {
      plaintextArray.push(keyMatrix[r1][(c1 + 4) % 5]);
      plaintextArray.push(keyMatrix[r2][(c2 + 4) % 5]);
    } else if (c1 === c2) {
      plaintextArray.push(keyMatrix[(r1 + 4) % 5][c1]);
      plaintextArray.push(keyMatrix[(r2 + 4) % 5][c2]);
    } else {
      plaintextArray.push(keyMatrix[r1][c2]);
      plaintextArray.push(keyMatrix[r2][c1]);
    }
  }

  return plaintextArray.join('');
};
