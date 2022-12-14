"use strict";
// Polyalphabetic Cipher using Vigenère Cipher (UTF-16).
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.decrypt = exports.encrypt = void 0;
const utils_1 = require("./utils");
// Encryption
const encrypt = ({ plaintext, key }) => {
    const parsedKey = (0, utils_1.hexToAscii)(key);
    return (0, utils_1.asciiToHex)((0, utils_1.hexToAscii)(plaintext)
        .split('')
        .map((c, i) => String.fromCharCode(c.charCodeAt(0) + parsedKey[i % parsedKey.length].charCodeAt(0)))
        .join(''));
};
exports.encrypt = encrypt;
// Decryption
const decrypt = ({ ciphertext, key }) => {
    const parsedKey = (0, utils_1.hexToAscii)(key);
    return (0, utils_1.hexToAscii)(ciphertext)
        .split('')
        .map((c, i) => String.fromCharCode(c.charCodeAt(0) - parsedKey[i % parsedKey.length].charCodeAt(0)))
        .join('');
};
exports.decrypt = decrypt;
const generateKey = () => {
    return Array.from(Array(127).keys())
        .sort(() => Math.random() - 0.5)
        .map(c => c.toString(16).padStart(2, '0'))
        .join('');
};
exports.generateKey = generateKey;
//# sourceMappingURL=polyalphabetic.js.map