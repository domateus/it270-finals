"use strict";
// Playfair Cipher
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.parseKey = exports.generateKey = void 0;
const utils_1 = require("./utils");
// Generate the key matrix from the key string for Playfair Cipher
const generateKey = ({ message }) => {
    // remove non-alphabets
    let keyArray = message
        .toUpperCase()
        .split('')
        .filter(c => c.match(/[A-Z]/));
    // replace J with I
    keyArray = keyArray.map(c => (c === 'J' ? 'I' : c));
    // add alphabet to the key (minus J)
    keyArray = [...keyArray, ...'ABCDEFGHIKLMNOPQRSTUVWXYZ'.split('')];
    // remove duplicates
    keyArray = keyArray.filter((c, i) => keyArray.indexOf(c) === i);
    return (0, utils_1.asciiToHex)(keyArray.join(''));
};
exports.generateKey = generateKey;
const parseKey = (key) => 
// split into 5x5 matrix and return the matrix
(0, utils_1.hexToAscii)(key)
    .match(/.{5}/g)
    .map(c => c.split(''));
exports.parseKey = parseKey;
// Encryption
const encrypt = ({ plaintext, key }) => {
    const keyMatrix = (0, exports.parseKey)(key);
    let plaintextArray = (0, utils_1.hexToAscii)(plaintext)
        .toUpperCase()
        .split('')
        .filter(c => c.match(/[A-Z]/));
    plaintextArray = plaintextArray.map(c => (c === 'J' ? 'I' : c));
    plaintextArray = plaintextArray.reverse();
    const pairArray = [];
    while (plaintextArray.length > 0) {
        const pair = [plaintextArray.pop()];
        if (plaintextArray.length === 0 ||
            plaintextArray[plaintextArray.length - 1] === pair[0]) {
            pair.push('X');
        }
        else {
            pair.push(plaintextArray.pop());
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
        }
        else if (c1 === c2) {
            ciphertextArray.push(keyMatrix[(r1 + 1) % 5][c1]);
            ciphertextArray.push(keyMatrix[(r2 + 1) % 5][c2]);
        }
        else {
            ciphertextArray.push(keyMatrix[r1][c2]);
            ciphertextArray.push(keyMatrix[r2][c1]);
        }
    }
    return (0, utils_1.asciiToHex)(ciphertextArray.join(''));
};
exports.encrypt = encrypt;
// Decryption
const decrypt = ({ ciphertext, key }) => {
    if (ciphertext === '')
        return '';
    ciphertext = (0, utils_1.hexToAscii)(ciphertext);
    const keyMatrix = (0, exports.parseKey)(key);
    const ciphertextArray = [];
    for (const pair of ciphertext.match(/.{2}/g)) {
        ciphertextArray.push(pair.split(''));
    }
    const plaintextArray = [];
    for (const pair of ciphertextArray) {
        const r1 = keyMatrix.findIndex(row => row.includes(pair[0]));
        const c1 = keyMatrix[r1].findIndex(c => c === pair[0]);
        const r2 = keyMatrix.findIndex(row => row.includes(pair[1]));
        const c2 = keyMatrix[r2].findIndex(c => c === pair[1]);
        if (r1 === r2) {
            plaintextArray.push(keyMatrix[r1][(c1 + 4) % 5]);
            plaintextArray.push(keyMatrix[r2][(c2 + 4) % 5]);
        }
        else if (c1 === c2) {
            plaintextArray.push(keyMatrix[(r1 + 4) % 5][c1]);
            plaintextArray.push(keyMatrix[(r2 + 4) % 5][c2]);
        }
        else {
            plaintextArray.push(keyMatrix[r1][c2]);
            plaintextArray.push(keyMatrix[r2][c1]);
        }
    }
    return plaintextArray.join('');
};
exports.decrypt = decrypt;
//# sourceMappingURL=playfair.js.map