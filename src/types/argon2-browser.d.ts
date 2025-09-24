declare module 'argon2-browser' {
  export interface HashOptions {
    pass: string;
    salt: Uint8Array;
    time: number;
    mem: number;
    parallelism: number;
    type: number;
    hashLen: number;
  }

  export interface HashResult {
    hash: Uint8Array;
    hashHex: string;
    encoded: string;
  }

  export function hash(options: HashOptions): Promise<HashResult>;
}
