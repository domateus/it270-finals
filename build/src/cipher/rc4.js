"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.decrypt = exports.encrypt = void 0;
// RC4
const crypto_1 = require("crypto");
const utils_1 = require("./utils");
const encrypt = ({ plaintext, key }) => {
    key = (0, utils_1.hexToAscii)(key);
    plaintext = (0, utils_1.hexToAscii)(plaintext);
    if (!key || key.length === 0) {
        return '';
    }
    const S = [];
    const T = [];
    for (let i = 0; i < 256; i++) {
        S[i] = i;
        T[i] = key.charCodeAt(i % key.length);
    }
    // Key Schedule
    let j = 0;
    let tmp = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + S[i] + T[i]) % 256;
        tmp = S[i];
        S[i] = S[j];
        S[j] = tmp;
    }
    const CT = [];
    let k = 0;
    let i = 0;
    j = 0;
    // Bit stream encryption/decryption:
    for (let n = 0; n < plaintext.length; n++) {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;
        // Swap (S[i], S[j]);
        tmp = S[i];
        S[i] = S[j];
        S[j] = tmp;
        k = (S[i] + S[j]) % 256;
        CT.push(plaintext.charCodeAt(n) ^ S[k]);
    }
    return (0, utils_1.asciiToHex)(CT.map(c => String.fromCharCode(c)).join(''));
};
exports.encrypt = encrypt;
const decrypt = ({ ciphertext, key }) => {
    const hexPT = (0, exports.encrypt)({ plaintext: ciphertext, key });
    return (0, utils_1.hexToAscii)(hexPT);
};
exports.decrypt = decrypt;
const generateKey = () => {
    return (0, utils_1.asciiToHex)((0, crypto_1.randomInt)(0, 255).toString());
};
exports.generateKey = generateKey;
//# sourceMappingURL=rc4.js.map