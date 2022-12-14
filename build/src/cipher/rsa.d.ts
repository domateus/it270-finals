export declare const generateKeys: RandomKeyGenerator;
export declare const parseKeys: (key: string) => {
    publicKey: string;
    privateKey: string;
};
export declare const encrypt: Encrypter;
export declare const decrypt: Decrypter;
