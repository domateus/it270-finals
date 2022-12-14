"use strict";
// Caesar Cipher using UTF-16.
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.decrypt = exports.encrypt = void 0;
const utils_1 = require("./utils");
// Encryption
const encrypt = ({ plaintext, key }) => {
    const result = (0, utils_1.hexToAscii)(plaintext)
        .split('')
        .map(c => (0, utils_1.asciiToHex)(String.fromCharCode(c.charCodeAt(0) + parseInt(key, 16))))
        .join('');
    return result;
};
exports.encrypt = encrypt;
// Decryption
const decrypt = ({ ciphertext, key }) => {
    return (0, utils_1.hexToAscii)(ciphertext)
        .split('')
        .map(c => String.fromCharCode(c.charCodeAt(0) - parseInt(key, 16)))
        .join('');
};
exports.decrypt = decrypt;
const generateKey = () => {
    return (Math.floor(Math.random() * 26 + 1) % 26)
        .toString(16)
        .padStart(2, '0');
};
exports.generateKey = generateKey;
//# sourceMappingURL=caesarCipher.js.map