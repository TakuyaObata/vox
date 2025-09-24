import { hash } from 'argon2-browser'

export function normalizeIdentity(name: string, dob: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, '') + 
                    dob.replace(/[^\d]/g, '')
  return normalized
}

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, '')
}

export async function deriveKAns(
  answerNorm: string, 
  salt: Uint8Array, 
  params: { iterations: number; memory: number; parallelism: number }
): Promise<Uint8Array> {
  const result = await hash({
    pass: answerNorm,
    salt: salt,
    time: params.iterations,
    mem: params.memory,
    parallelism: params.parallelism,
    type: 2,
    hashLen: 32
  })
  return result.hash
}

export async function aeadEncrypt(
  data: Uint8Array, 
  key: Uint8Array
): Promise<{ encrypted: Uint8Array; iv: Uint8Array; tag: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(key),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv), tagLength: 128 },
    cryptoKey,
    new Uint8Array(data)
  )
  
  const encryptedArray = new Uint8Array(encrypted)
  const tag = encryptedArray.slice(-16)
  const ciphertext = encryptedArray.slice(0, -16)
  
  return { encrypted: ciphertext, iv, tag }
}

export async function aeadDecrypt(
  encrypted: Uint8Array,
  key: Uint8Array,
  iv: Uint8Array,
  tag: Uint8Array
): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(key),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )
  
  const combined = new Uint8Array(encrypted.length + tag.length)
  combined.set(encrypted)
  combined.set(tag, encrypted.length)
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv), tagLength: 128 },
    cryptoKey,
    new Uint8Array(combined)
  )
  
  return new Uint8Array(decrypted)
}

export async function buildLetterPayload(
  html: Uint8Array,
  question: string,
  answer: string,
  kdfParams: { iterations: number; memory: number; parallelism: number }
): Promise<{ payload: string; bucketId: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(32))
  const answerNorm = normalizeAnswer(answer)
  const kAns = await deriveKAns(answerNorm, salt, kdfParams)
  
  const kMsg = crypto.getRandomValues(new Uint8Array(32))
  const { encrypted, iv, tag } = await aeadEncrypt(html, kMsg)
  
  const { encrypted: encryptedKey } = await aeadEncrypt(kMsg, kAns)
  
  const letterData: {
    question: string;
    kdfParams: {
      salt: string;
      iterations: number;
      memory: number;
      parallelism: number;
    };
    encryptedData: string;
    encryptedKey: string;
    iv: string;
    tag: string;
  } = {
    question,
    kdfParams: {
      salt: Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(''),
      iterations: kdfParams.iterations,
      memory: kdfParams.memory,
      parallelism: kdfParams.parallelism
    },
    encryptedData: Array.from(encrypted).map(b => b.toString(16).padStart(2, '0')).join(''),
    encryptedKey: Array.from(encryptedKey).map(b => b.toString(16).padStart(2, '0')).join(''),
    iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
    tag: Array.from(tag).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  const payload = JSON.stringify(letterData)
  
  const bucketId = await generateBucketId(question + answerNorm)
  
  return { payload, bucketId }
}

async function generateBucketId(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
}

export function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}
