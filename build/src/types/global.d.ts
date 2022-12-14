declare type Message<T = MessagePayloadTypes> = {
    id: string;
    from: string;
    to: string;
    timestamp: number;
    payload: T;
    images?: {
        id: string;
        src: string;
        padding: number;
    }[];
    hash?: string;
    hashVerified?: boolean;
    signature?: string[];
    signatureVerified?: boolean;
};
declare type MessagePayloadTypes = TextPayload | DHPSKPayload;
declare type EncryptionAlgorithm = 'Caesar cipher' | 'Monoalphabetic' | 'Polyalphabetic' | 'Hill cipher' | 'Playfair' | 'OTP' | 'Rail fence' | 'Columnar' | 'DES' | 'AES' | 'RC4' | 'RSA' | 'ECC';
declare type TextPayload = {
    type: 'MESSAGE';
    text: string;
    encryption: EncryptionAlgorithm;
    key?: AlgorithmKey;
    padding?: number;
};
declare type DHPSKPayload = {
    type: 'DHPSK';
    A?: string;
    B?: string;
};
declare type Contact = {
    id: number;
    name: string;
    hasUnreadMessages: boolean;
    canScrollToNewMessages: boolean;
    keys: AlgorithmKey[];
    publicKey: string;
    dhk?: string;
    dsak?: string;
};
declare type AlgorithmKey = {
    version: number;
    timestamp: number;
    value: string;
    type: EncryptionAlgorithm;
};
declare type AddKeyPayload = {
    contactName: string;
    key: AlgorithmKey;
};
declare type EncryptPayload = {
    plaintext: string;
    key: string;
};
declare type DecryptPayload = {
    ciphertext: string;
    key: string;
};
declare type GenerateKeyPayload = {
    algorithm?: EncryptionAlgorithm;
    message: string;
    contact?: Contact;
};
declare type DecryptMessagePayload = {
    algorithm?: EncryptionAlgorithm;
    message: string;
    key?: string;
};
declare type EncryptMessagePayload = {
    algorithm?: EncryptionAlgorithm;
    plaintext: string;
    key: string;
};
declare type AsyncRandomKeyGenerator = () => Promise<string[]>;
declare type DHModPowPayload = {
    b: string;
    e: string;
    p: string;
};
declare type DHModPow = (payload: DHModPowPayload) => string;
declare type Encrypter = (payload: EncryptPayload) => string;
declare type Decrypter = (payload: DecryptPayload) => string;
declare type KeyGenerator = (payload: GenerateKeyPayload) => string;
declare type RandomKeyGenerator = () => string;
declare type DHContants = {
    p: string;
    q: string;
    a: string;
};
declare type DSAContants = {
    p: string;
    q: string;
    g: string;
    x: string;
    y: string;
};
declare type PlayfairKeyMatrixGeneratorPayload = {
    key: string;
};
declare type KeyPair = {
    publicKey: bigint[];
    privateKey: bigint[];
};
declare type ColumnarKeyGeneratorPayload = {
    key: string;
};
declare type ColumnarKeyGenerator = (payload: ColumnarKeyGeneratorPayload) => number[];
declare type PlayfairKeyMatrixGenerator = (payload: PlayfairKeyMatrixGeneratorPayload) => string[][];
