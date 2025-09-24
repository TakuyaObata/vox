export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          display_name: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          display_name?: string | null
          created_at?: string
        }
      }
      letters: {
        Row: {
          id: string
          txid: string
          bucket_id: string
          sender_id: string | null
          bytes: number
          cost_ar: number | null
          cost_fiat: number | null
          mirror_opt_in: boolean
          mirror_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          txid: string
          bucket_id: string
          sender_id?: string | null
          bytes: number
          cost_ar?: number | null
          cost_fiat?: number | null
          mirror_opt_in?: boolean
          mirror_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          txid?: string
          bucket_id?: string
          sender_id?: string | null
          bytes?: number
          cost_ar?: number | null
          cost_fiat?: number | null
          mirror_opt_in?: boolean
          mirror_id?: string | null
          created_at?: string
        }
      }
      openings: {
        Row: {
          id: string
          txid: string
          opener_id: string
          opened_at: string
        }
        Insert: {
          id?: string
          txid: string
          opener_id: string
          opened_at?: string
        }
        Update: {
          id?: string
          txid?: string
          opener_id?: string
          opened_at?: string
        }
      }
      telemetry: {
        Row: {
          id: number
          event: string
          txid: string | null
          bucket_id: string | null
          value: number | null
          meta: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: number
          event: string
          txid?: string | null
          bucket_id?: string | null
          value?: number | null
          meta?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: number
          event?: string
          txid?: string | null
          bucket_id?: string | null
          value?: number | null
          meta?: Record<string, unknown> | null
          created_at?: string
        }
      }
    }
  }
}

export interface LetterJSON {
  html: string
  question: string
  kdfParams: {
    salt: string
    iterations: number
    memory: number
    parallelism: number
  }
  encryptedData: string
  iv: string
  tag: string
}

export interface TelemetryEvent {
  event: 'sent' | 'found' | 'decrypt' | 'view' | 'status'
  txid?: string
  bucket_id?: string
  value?: number
  meta?: Record<string, unknown>
}
