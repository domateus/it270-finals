"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dh = exports.secretKey = exports.psk = void 0;
const crypto_1 = require("crypto");
const utils_1 = require("./utils");
const bytes = 16;
const psk = async () => {
    const p1 = (0, utils_1.generatePrime)(bytes);
    const p2 = (0, utils_1.generatePrime)(bytes);
    let [p, q] = await Promise.all([p1, p2]);
    if (p < q) {
        const temp = p;
        p = q;
        q = temp;
    }
    return [p, q].map(v => (0, utils_1.bigIntegerToXBytePaddedHex)(v, bytes));
};
exports.psk = psk;
const secretKey = () => {
    return (0, crypto_1.randomInt)(2 << 30, 2 << 50).toString(16);
};
exports.secretKey = secretKey;
const dh = ({ b, e, p }) => {
    const base = (0, utils_1.hexToXByteBigIntegerArray)(b, bytes)[0];
    const exponent = (0, utils_1.hexToXByteBigIntegerArray)(e, bytes)[0];
    const modulus = (0, utils_1.hexToXByteBigIntegerArray)(p, bytes)[0];
    return (0, utils_1.bigIntegerToXBytePaddedHex)(base.modPow(exponent, modulus), bytes);
};
exports.dh = dh;
//# sourceMappingURL=diffieHellman.js.map