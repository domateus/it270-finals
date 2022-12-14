import { BigInteger } from 'jsbn';
declare type Point = {
    x: BigInteger;
    y: BigInteger;
};
export declare function init(): void;
export declare function plaintextToPoint(plaintext: string): Point[];
export declare function pointToPlaintext(pointArray: Point[]): string;
export {};
