export interface SignedRequest<T> {
    content: T;
    fingerprint: string;
    signature: string;
}