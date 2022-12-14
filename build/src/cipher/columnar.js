"use strict";
// Columnar Cipher
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.decrypt = exports.encrypt = exports.genColumnarKey = void 0;
const utils_1 = require("./utils");
// Generate the key matrix from the key string for Playfair Cipher
const genColumnarKey = ({ key }) => {
    // Cleaning up key (numbers only, no repetitions)
    key = key.toUpperCase().replace(/[^0-9]/g, '');
    // Removing duplicated numbers from key
    return key
        .split('')
        .filter((item, pos, self) => self.indexOf(item) === pos)
        .map(c => parseInt(c));
};
exports.genColumnarKey = genColumnarKey;
// Encryption
const encrypt = ({ plaintext, key }) => {
    const order = (0, exports.genColumnarKey)({ key: (0, utils_1.hexToAscii)(key) });
    // Cleaning up plaintext
    plaintext = (0, utils_1.hexToAscii)(plaintext)
        .toUpperCase()
        .replace(/[^A-Z]/g, '');
    // Padding plaintext with Xs if it is not a multiple of the key length
    if (plaintext.length % order.length !== 0) {
        plaintext += 'X'.repeat(order.length - (plaintext.length % order.length));
    }
    // Calculating the number of cols to pair with key
    const numCols = order.length;
    // Calculating the number of rows to split the plaintext into
    const numRows = plaintext.length / numCols;
    // Split the plaintext into numRows of the size of numCols
    const columns = [];
    for (let i = 0; i < numRows; i++) {
        columns.push(plaintext.slice(i * numCols, (i + 1) * numCols).split(''));
    }
    // Rearrange columns into rows according to key
    const ciphertext = [];
    for (let i = 0; i < numCols; i++) {
        const j = order.indexOf(i);
        for (let k = 0; k < numRows; k++) {
            ciphertext.push(columns[k][j]);
        }
    }
    return (0, utils_1.asciiToHex)(ciphertext.join(''));
};
exports.encrypt = encrypt;
// Decryption
const decrypt = ({ ciphertext, key }) => {
    if (!ciphertext || ciphertext.length === 0) {
        return '';
    }
    const parsedText = (0, utils_1.hexToAscii)(ciphertext);
    const order = (0, exports.genColumnarKey)({ key: (0, utils_1.hexToAscii)(key) });
    // Calculating the number of rows to pair with key
    const numRows = order.length;
    // Calculating the number of cols to split the ciphertext into
    const numCols = parsedText.length / numRows;
    // Splitting the ciphertext into numRows of the size of numCols
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(parsedText.slice(i * numCols, (i + 1) * numCols));
    }
    // Prepare plaintext array
    const plaintext = [];
    for (let i = 0; i < numCols; i++) {
        plaintext.push('');
    }
    // Rearrange rows into columns according to order
    for (const i of order) {
        for (let j = 0; j < rows[i].length; j++) {
            plaintext[j] += rows[i][j];
        }
    }
    return plaintext.join('');
};
exports.decrypt = decrypt;
const generateKey = () => {
    const key = Array.from(Array(9).keys());
    // Shuffle the key
    for (let i = key.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [key[i], key[j]] = [key[j], key[i]];
    }
    return (0, utils_1.asciiToHex)(key.join(''));
};
exports.generateKey = generateKey;
//# sourceMappingURL=columnar.js.map