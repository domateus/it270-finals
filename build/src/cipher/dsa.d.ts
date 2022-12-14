declare type DSASignPayload = {
    m: string;
    g: string;
    k: string;
    p: string;
    x: string;
    q: string;
};
declare type DSASign = (payload: DSASignPayload) => string[];
declare type DSAVerifyPayload = {
    m: string;
    g: string;
    p: string;
    q: string;
    y: string;
    r: string;
    s: string;
};
declare type DSAVerify = (payload: DSAVerifyPayload) => boolean;
export declare const sign: DSASign;
export declare const verify: DSAVerify;
export {};
