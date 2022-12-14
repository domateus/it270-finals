"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplyHexStrings = exports.modPow = exports.bigIntToXBytePaddedHex = exports.bigIntegerToXBytePaddedHex = exports.bigIntegerToHex = exports.hexToXByteBigIntegerArray = exports.hexToAscii = exports.hexToBigInteger = exports.asciiToHex = exports.stringToNumber = exports.bigintToBigInteger = exports.getRandomPrime = exports.getRandomInt = exports.extendedEuclidean = exports.gcd = exports.generatePrime = exports.generateRandomString = exports.zip = exports.getAsciiCodes = exports.ASCII_ALPHABET_INDEX = exports.number_ASCII_TABLE_SIZE = exports.ASCII_TABLE_SIZE = exports.LIST_PRIMES_SIZE = exports.LIST_PRIMES = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsbn_1 = require("jsbn");
const forge = require("node-forge");
const crypto_1 = require("crypto");
exports.LIST_PRIMES = [
    7n,
    11n,
    13n,
    17n,
    19n,
    23n,
    29n,
    31n,
    37n,
    41n,
    43n,
    47n,
    53n,
    59n,
    61n,
    67n,
    71n,
    73n,
    79n,
    83n,
    89n,
    97n,
    101n,
    103n,
    107n,
    109n,
    113n,
    127n,
    131n,
    137n,
    139n,
    149n,
    151n,
    157n,
    163n,
    167n,
    173n,
    179n,
    181n,
    191n,
    193n,
    197n,
    199n,
    211n,
    223n,
    227n,
    229n,
    233n,
    239n,
    241n,
    251n,
    257n,
    263n,
    269n,
    271n,
    277n,
    281n,
    283n,
    293n,
    307n,
    311n,
    313n,
    317n,
    331n,
    337n,
    347n,
    349n,
    353n,
    359n,
    367n,
    373n,
    379n,
    383n,
    389n,
    397n,
];
exports.LIST_PRIMES_SIZE = exports.LIST_PRIMES.length;
exports.ASCII_TABLE_SIZE = 127n;
exports.number_ASCII_TABLE_SIZE = Number(exports.ASCII_TABLE_SIZE);
exports.ASCII_ALPHABET_INDEX = 65;
function getAsciiCodes(s) {
    return s.split('').map(c => BigInt(c.charCodeAt(0)));
}
exports.getAsciiCodes = getAsciiCodes;
const zip = (a, b) => a.map((k, i) => [k, b[i]]);
exports.zip = zip;
function generateRandomString(length) {
    return new Array(length)
        .map(() => (0, crypto_1.randomInt)(0, 127).toString(16).padStart(2, '0'))
        .join('');
}
exports.generateRandomString = generateRandomString;
async function generatePrime(bytes) {
    return await new Promise((resolve, reject) => {
        forge.prime.generateProbablePrime(bytes * 8, (e, p) => {
            if (e) {
                reject(e);
            }
            else {
                const v = new jsbn_1.BigInteger(p.toString(16), 16);
                resolve(v);
            }
        });
    });
}
exports.generatePrime = generatePrime;
function gcd(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}
exports.gcd = gcd;
function extendedEuclidean(a, b) {
    if (b === 0n) {
        return [1n, 0n, a];
    }
    const [x, y, gcd] = extendedEuclidean(b, a % b);
    return [y, x - (a / b) * y, gcd];
}
exports.extendedEuclidean = extendedEuclidean;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
exports.getRandomInt = getRandomInt;
function getRandomPrime(cap = 1) {
    const arrayIndex = getRandomInt(0, exports.LIST_PRIMES.length - cap);
    const randomPrime = exports.LIST_PRIMES[arrayIndex];
    return randomPrime;
}
exports.getRandomPrime = getRandomPrime;
function bigintToBigInteger(bigint) {
    return new jsbn_1.BigInteger(bigint.toString().replace('n', ''), 10);
}
exports.bigintToBigInteger = bigintToBigInteger;
function stringToNumber(plaintext) {
    return BigInt(plaintext
        .split('')
        .map(c => c.charCodeAt(0))
        .join(''));
}
exports.stringToNumber = stringToNumber;
function asciiToHex(str, x = 1) {
    const arr1 = [];
    const charSize = 2 * x;
    for (let n = 0, l = str.length; n < l; n++) {
        const hex = Number(str.charCodeAt(n)).toString(16).padStart(charSize, '0');
        arr1.push(hex);
    }
    return arr1.join('');
}
exports.asciiToHex = asciiToHex;
function hexToBigInteger(hex) {
    return new jsbn_1.BigInteger(hex, 16);
}
exports.hexToBigInteger = hexToBigInteger;
function hexToAscii(hex, x = 1) {
    let str = '';
    const charSize = 2 * x;
    for (let n = 0; n < hex.length; n += charSize) {
        str += String.fromCharCode(parseInt(hex.substr(n, charSize), 16));
    }
    return str;
}
exports.hexToAscii = hexToAscii;
function hexToXByteBigIntegerArray(hex, x) {
    const values = [];
    const bigintBytesSize = 2 * x;
    for (let i = 0; i < hex.length; i += bigintBytesSize) {
        values.push(hexToBigInteger(hex.slice(i, i + bigintBytesSize)));
    }
    return values;
}
exports.hexToXByteBigIntegerArray = hexToXByteBigIntegerArray;
function bigIntegerToHex(bigint) {
    return bigint.toString(16);
}
exports.bigIntegerToHex = bigIntegerToHex;
function bigIntegerToXBytePaddedHex(bigint, x) {
    return bigint.toString(16).padStart(2 * x, '0');
}
exports.bigIntegerToXBytePaddedHex = bigIntegerToXBytePaddedHex;
function bigIntToXBytePaddedHex(bigint, x) {
    return bigint.toString(16).padStart(2 * x, '0');
}
exports.bigIntToXBytePaddedHex = bigIntToXBytePaddedHex;
function modPow(value, exponent, modulus) {
    let result = jsbn_1.BigInteger.ONE;
    while (exponent > jsbn_1.BigInteger.ZERO) {
        if (exponent.mod(new jsbn_1.BigInteger('2')) === jsbn_1.BigInteger.ONE) {
            result = result.multiply(value).mod(modulus);
        }
        exponent = exponent.shiftRight(1);
        value = value.pow(2).mod(modulus);
    }
    return result;
}
exports.modPow = modPow;
function multiplyHexStrings(a, b) {
    const x = new jsbn_1.BigInteger(a, 16);
    const y = new jsbn_1.BigInteger(b, 16);
    const c = x.multiply(y);
    return c.toString(16);
}
exports.multiplyHexStrings = multiplyHexStrings;
//# sourceMappingURL=utils.js.map