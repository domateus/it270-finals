"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.decrypt = exports.encrypt = void 0;
const utils = require("./utils");
const encrypt = ({ plaintext, key }) => {
    if (plaintext.length !== key.length) {
        throw new Error('OTP key should have the same length like the message!');
    }
    const result = [];
    for (let i = 0; i < plaintext.length; i += 2) {
        const p = parseInt(plaintext.slice(i, i + 2), 16);
        const k = parseInt(key.slice(i, i + 2), 16);
        const r = ((p + k) % utils.number_ASCII_TABLE_SIZE)
            .toString(16)
            .padStart(2, '0');
        result.push(r);
    }
    return result.join('');
};
exports.encrypt = encrypt;
const decrypt = ({ ciphertext, key }) => {
    if (ciphertext.length !== key.length) {
        throw new Error('OTP key should have the same length like the message!');
    }
    const result = [];
    for (let i = 0; i < ciphertext.length; i += 2) {
        const c = parseInt(ciphertext.slice(i, i + 2), 16);
        const k = parseInt(key.slice(i, i + 2), 16);
        const r = utils.hexToAscii(((c - k + utils.number_ASCII_TABLE_SIZE) % utils.number_ASCII_TABLE_SIZE)
            .toString(16)
            .padStart(2, '0'));
        result.push(r);
    }
    return result.join('');
};
exports.decrypt = decrypt;
const generateKey = ({ message }) => {
    return utils.generateRandomString(message.length);
};
exports.generateKey = generateKey;
//# sourceMappingURL=otp.js.map