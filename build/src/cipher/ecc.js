"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointToPlaintext = exports.plaintextToPoint = exports.init = void 0;
const jsbn_1 = require("jsbn");
const a = jsbn_1.BigInteger.ZERO;
const prime = new jsbn_1.BigInteger('257');
const three = new jsbn_1.BigInteger('3');
const two = new jsbn_1.BigInteger('2');
const G = { x: two, y: two };
const getPrivateKey = () => Math.floor(Math.random() * parseInt(prime.toString()) + 1) % 128;
const GENERATOR = { x: new jsbn_1.BigInteger('2'), y: new jsbn_1.BigInteger('2') };
const GENERATOR_POINTS = [GENERATOR];
function init() {
    const generatorPoint = { x: new jsbn_1.BigInteger('2'), y: new jsbn_1.BigInteger('2') };
    let addedPoint = add({ p: generatorPoint, q: generatorPoint });
    GENERATOR_POINTS.push(addedPoint);
    ASCII_ENCODED.set(1, GENERATOR);
    ASCII_ENCODED.set(2, addedPoint);
    for (let i = 0; i < 128; i++) {
        //TODO checkup double val
        addedPoint = add({ p: generatorPoint, q: addedPoint });
        GENERATOR_POINTS.push(addedPoint);
        ASCII_ENCODED.set(i + 3, addedPoint);
    }
}
exports.init = init;
const ASCII_ENCODED = new Map();
const findMapKey = (point, map) => {
    let result = null;
    for (const [key, value] of map) {
        if (value.x === point.x && value.y === point.y) {
            result = key;
        }
    }
    return result;
};
function plaintextToPoint(plaintext) {
    init();
    const plaintextArray = plaintext.split('');
    const pointArray = plaintextArray.map(l => ASCII_ENCODED.get(l.charCodeAt(0)));
    return pointArray;
}
exports.plaintextToPoint = plaintextToPoint;
function pointToPlaintext(pointArray) {
    // console.log(ASCII_ENCODED);
    const charCodeArray = pointArray.map(c => findMapKey(c, ASCII_ENCODED));
    const plaintext = charCodeArray.map(c => String.fromCharCode(c)).join('');
    return plaintext;
}
exports.pointToPlaintext = pointToPlaintext;
const add = ({ p, q }) => {
    const lambda = getLambda({ p, q });
    if (lambda === null)
        return { x: jsbn_1.BigInteger.ZERO, y: jsbn_1.BigInteger.ZERO };
    const x = lambda.multiply(lambda).subtract(p.x).subtract(q.x).mod(prime);
    const y = lambda.multiply(p.x.subtract(x)).subtract(p.y).mod(prime);
    return { x, y };
};
const getLambda = ({ p, q }) => {
    if (!p.x.compareTo(q.x) && !p.y.compareTo(q.y)) {
        const numerator = three.multiply(p.x.pow(2)).add(a);
        let denominator = p.y.multiply(two);
        if (numerator.equals(jsbn_1.BigInteger.ZERO)) {
            return jsbn_1.BigInteger.ZERO;
        }
        if (denominator.equals(jsbn_1.BigInteger.ZERO)) {
            return null;
        }
        if (denominator.compareTo(jsbn_1.BigInteger.ZERO) < 0) {
            while (denominator.compareTo(jsbn_1.BigInteger.ZERO) < 0) {
                denominator = denominator.add(prime);
            }
        }
        else {
            denominator = denominator.modInverse(prime);
        }
        return numerator.multiply(denominator).mod(prime);
    }
    let numerator = q.y.subtract(p.y);
    let denominator = q.x.subtract(p.x);
    if (numerator.equals(jsbn_1.BigInteger.ZERO)) {
        return jsbn_1.BigInteger.ZERO;
    }
    if (denominator.equals(jsbn_1.BigInteger.ZERO)) {
        return null;
    }
    while (numerator.compareTo(jsbn_1.BigInteger.ZERO) < 0) {
        numerator = numerator.add(prime);
    }
    while (denominator.compareTo(jsbn_1.BigInteger.ZERO) < 0) {
        denominator = denominator.add(prime);
    }
    denominator = denominator.modInverse(prime);
    return numerator.multiply(denominator).mod(prime);
};
const multiply = ({ p, n }) => {
    let result = p;
    for (let i = 1; i < n; i++) {
        result = add({ p: result, q: p });
    }
    return result;
};
const negate = (p) => {
    return { x: p.x, y: p.y.multiply(new jsbn_1.BigInteger('-1')) };
};
const subtract = ({ p, q }) => {
    return add({ p, q: negate(q) });
};
const Apk = getPrivateKey();
const Apublic = multiply({ p: G, n: Apk });
const primes = [
    29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107,
    109, 113, 127,
];
const Bpk = primes[Math.floor(Math.random() * primes.length)];
const Bpublic = multiply({ p: G, n: Bpk });
console.log('nb', Bpk);
console.log('pb', Bpublic.x.toString(), Bpublic.y.toString());
const message = 'Hi katha, I love you so much';
const asciiToPointMap1 = [G];
for (let i = 1; i < 140; i++) {
    const point = add({ p: asciiToPointMap1[i - 1], q: G });
    asciiToPointMap1.push(point);
}
const asciiToPointMap = asciiToPointMap1.map(({ x, y }, i) => {
    return {
        x: x.toString(16).padStart(4, '0'),
        y: y.toString(16).padStart(4, '0'),
    };
});
const asciiToBigIntegerPoint = (message) => {
    const points = [];
    for (let i = 0; i < message.length; i++) {
        points.push(asciiToPointMap1[message.charCodeAt(i)]);
    }
    return points;
};
const asciiToStringPoint = (message) => {
    const points = [];
    for (let i = 0; i < message.length; i++) {
        points.push(asciiToPointMap[message.charCodeAt(i)]);
    }
    return points;
};
const encrypt = ({ m, k, publicB, }) => {
    const kg = multiply({ p: G, n: k });
    console.log('kg', kg.x.toString(), kg.y.toString()); // (136, 128)
    const kpb = multiply({ p: publicB, n: k });
    console.log('kpb', kpb.x.toString(), kpb.y.toString()); // (68, 84)
    return m.map(pm => {
        const p = add({ p: pm, q: kpb });
        return [
            {
                x: kg.x.toString(16).padStart(4, '0'),
                y: kg.y.toString(16).padStart(4, '0'),
            },
            {
                x: p.x.toString(16).padStart(4, '0'),
                y: p.y.toString(16).padStart(4, '0'),
            },
        ];
    });
};
const computeK = (pb) => {
    let k = primes[Math.floor(Math.random() * primes.length)];
    let kpb = multiply({ p: pb, n: k });
    const kg = multiply({ p: G, n: k });
    while (kg.x.compareTo(jsbn_1.BigInteger.ZERO) === 0 ||
        kg.y.compareTo(jsbn_1.BigInteger.ZERO) === 0 ||
        (!kpb.x.compareTo(jsbn_1.BigInteger.ZERO) && !kpb.y.compareTo(jsbn_1.BigInteger.ZERO))) {
        k = primes[Math.floor(Math.random() * primes.length)];
        kpb = multiply({ p: pb, n: k });
    }
    return k;
};
const decrypt = ({ c, privateB }) => {
    const m = c.map(([kg, p]) => {
        const kgp = multiply({
            p: { x: new jsbn_1.BigInteger(kg.x, 16), y: new jsbn_1.BigInteger(kg.y, 16) },
            n: privateB,
        });
        const p1 = subtract({
            p: { x: new jsbn_1.BigInteger(p.x, 16), y: new jsbn_1.BigInteger(p.y, 16) },
            q: kgp,
        });
        return p1;
    });
    return m;
};
const m = plaintextToPoint(message);
m.forEach(p => {
    console.log('encrypted', p.x.toString(), p.y.toString());
});
for (let i = 0; i < 10; i++) {
    const k = computeK(Bpublic);
    console.log('k', k);
    const publicB = multiply({ p: G, n: Bpk });
    const ciphertext = encrypt({ m, k, publicB });
    const plaintext = decrypt({ c: ciphertext, privateB: Bpk });
    plaintext.forEach(p => {
        console.log('decrypted', p.x.toString(), p.y.toString());
    });
}
// console.log("plaintext", pointToPlaintext(plaintext));
//////////////////////////////////////////////////
// const nb = 101;
// const pb = multiply({ p: G, n: nb });
// console.log("pb", pb.x.toString(), pb.y.toString()); // (197, 167)
// const pm = { x: new BigInteger("112"), y: new BigInteger("26") };
// const k = 41;
// // const kg = multiply({ p: G, n: k });
// // const kpb = multiply({ p: pb, n: k });
// const cm = encrypt({ m: [pm], k, publicB: pb });
// console.log(
//   "cm",
//   parseInt(cm[0][0].x, 16),
//   parseInt(cm[0][0].y, 16), // (136, 128)
//   parseInt(cm[0][1].x, 16),
//   parseInt(cm[0][1].y, 16) // (246, 174)
// );
// const decrypted = decrypt({ c: cm, privateB: nb });
// console.log("decrypted", decrypted[0].x.toString(), decrypted[0].y.toString()); // (112, 26)
//# sourceMappingURL=ecc.js.map