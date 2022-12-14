"use strict";
// Rail Fence Cipher
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.decrypt = exports.encrypt = void 0;
const utils_1 = require("./utils");
// Encryption
const encrypt = ({ plaintext, key }) => {
    const parsedText = (0, utils_1.hexToAscii)(plaintext);
    const depth = parseInt(key, 16);
    if (depth < 2)
        return plaintext;
    let plaintextArray = parsedText
        .toUpperCase()
        .replace(/[^A-Z]/gi, '')
        .split('');
    // Padding until it's a multiple of 'k'
    // https://en.wikipedia.org/wiki/Rail_fence_cipher#Decryption
    while (plaintextArray.length % (2 * (depth - 1)) !== 0)
        plaintextArray.push('X');
    plaintextArray = plaintextArray.reverse();
    const rails = [];
    for (let i = 0; i < depth; i++) {
        rails.push([]);
    }
    let i = 0;
    let step = 1;
    while (plaintextArray.length > 0) {
        rails[i].push(plaintextArray.pop());
        i += step;
        if (i < 0 || i >= depth) {
            step *= -1;
            i += step * 2;
        }
    }
    const ciphertext = rails.map(row => row.join('')).join('');
    return (0, utils_1.asciiToHex)(ciphertext);
};
exports.encrypt = encrypt;
// Decryption
const decrypt = ({ ciphertext, key }) => {
    const parsedText = (0, utils_1.hexToAscii)(ciphertext);
    const depth = parseInt(key, 16);
    if (depth < 2)
        return parsedText;
    const ciphertextArray = parsedText.split('');
    const size = parsedText.length;
    const k = size / (2 * (depth - 1)); // https://en.wikipedia.org/wiki/Rail_fence_cipher#Decryption
    const rails = [];
    // Push first rail
    rails.push(ciphertextArray.splice(0, k));
    // Push middle rails (if any)
    for (let i = 1; i < depth - 1; i++)
        rails.push(ciphertextArray.splice(0, 2 * k));
    // Push last rail
    rails.push(ciphertextArray);
    let i = 0;
    let step = 1; // 1 or -1
    let plaintext = '';
    while (plaintext.length < size) {
        plaintext += rails[i].shift();
        i += step;
        if (i < 0 || i >= depth) {
            step *= -1;
            i += step * 2;
        }
    }
    return plaintext;
};
exports.decrypt = decrypt;
const generateKey = () => {
    return Math.floor(Math.random() * 10)
        .toString(16)
        .padStart(2, '0');
};
exports.generateKey = generateKey;
//# sourceMappingURL=railFence.js.map