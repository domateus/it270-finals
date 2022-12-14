"use strict";
// Monoalphabetic Cipher using UTF-16.
// with random UTF-16 key generator
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.decrypt = exports.encrypt = void 0;
const utils_1 = require("./utils");
// Encryption
const encrypt = ({ plaintext, key }) => {
    const parsedKey = (0, utils_1.hexToAscii)(key);
    return (0, utils_1.asciiToHex)((0, utils_1.hexToAscii)(plaintext)
        .split('')
        .map(c => {
        return String.fromCharCode(parsedKey[c.charCodeAt(0)].charCodeAt(0));
    })
        .join(''));
};
exports.encrypt = encrypt;
// Decryption
const decrypt = ({ ciphertext, key }) => {
    const parsedKey = (0, utils_1.hexToAscii)(key);
    return (0, utils_1.hexToAscii)(ciphertext)
        .split('')
        .map(c => String.fromCharCode(
    // convert the key index as UTF-16 to char
    parsedKey.indexOf(c))) // lookup the index of the char in the key
        .join('');
};
exports.decrypt = decrypt;
// Random Key Generator for Monoalphabetic Cipher to use in the front-end
const generateKey = () => {
    return Array.from(Array(127).keys())
        .sort(() => Math.random() - 0.5)
        .map(c => c.toString(16).padStart(2, '0'))
        .join('');
};
exports.generateKey = generateKey;
//# sourceMappingURL=monoalphabetic.js.map