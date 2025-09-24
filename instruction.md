スタック：**Vercel + Next.js (App Router)**、**Supabase（Auth/DB/Storage不使用）**、**Irys（旧Bundlr）**、**Arweave**。
暗号：**Argon2id + AES-GCM（鍵封筒方式）**。無料枠：**1通 5MB**。言語：**日本語**。

---

# 0. 目的・ゴール

* コアは**分散**（Arweave）で永続閲覧可能。
* 送信UIは**中央集権**（運営が Irys 費用負担）。
* 受信は**未登録でも検索/復号可能**。登録済み受信者（=開封者）は**送り手と中央メッセージ**可。
* 公開統計：

  * 送信手紙数・送信者人数
  * 受取（開封）手紙数・受取者人数
  * 投稿コスト
  * Arweave ステータス
* オプション：**運営DBへのミラー保存**（送信者が選択）。
* **ボランティア運営**につき、違法対策は**ダミー処理**で占位（後日切替）。

## 成功基準（MVP）

* 送信→Arweave 永続保存（Irys 経由）、**txid 取得**。
* 未登録受信者が**bucketId 検索→質問回答→復号表示**。
* 受信者が**登録して開封**すると、**送り手と1:1メッセージ**可能。
* 公開ダッシュボードに**統計**と**Arweave疎通**が表示。
* 1通 5MB 制限、**多言語不要**（日本語固定）。

---

# 1. ドメイン仕様

## 1.1 正規化・識別

* `normalizeIdentity(name, dob)`：`"${name}|${dob}"` を **Unicode NFC → lower → 余白縮約**。
* `bucketId = sha256(normalizeIdentity).hex().slice(0,8)`（32bit相当・小文字hex）。
* **Arweave Tx Tags**

  * `type = "letter-v1"`
  * `bucket = <bucketId>`
  * `content-type = "text/html"`（単一HTML）または `"application/json"`（マニフェスト）
  * `lang = "ja"`

## 1.2 暗号（鍵封筒方式）

* 回答（秘密の質問）は**公開しない**。
* `K_ans = Argon2id(answerNormalized, salt=16B, t=2~3, m=64~256MiB, p=1)`
* `K_msg = rand(32B)`
* 本文HTML（最大5MB）：`AES-256-GCM(K_msg)`
* 封筒：`AES-256-GCM(K_ans, K_msg)`
* 復号判定：**GCMタグ**のみ（Honey Encryption 不使用）。
* JSON ペイロード（Arweave）例：

```json
{
  "version": "v1",
  "type": "letter",
  "question": "最初に飼った犬の名前は？",
  "kdf": {"algo":"argon2id","salt":"base64","t":2,"m":65536,"p":1},
  "envelope": {"aead":"aes-256-gcm","nonce":"base64","ciphertext":"base64"},
  "message": {"aead":"aes-256-gcm","nonce":"base64","ciphertext":"base64","aad":"base64"},
  "createdAt": 1732456789
}
```

---

# 2. ユーザーモデルと認証

* **送信（Sender）**：**登録必須**（Supabase Email OTP/Link）。
* **受信（Reader）**：未登録OK。**開封後に登録**すれば「開封者（Opener）」ロール付与。
* **ロール**：`anon | sender | opener | admin`（Supabase Auth JWTに `role` クレーム付与）。

---

# 3. データモデル（Supabase / Postgres）

```sql
-- users（Supabase auth.users を利用、拡張プロフィールのみ）
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

-- letters（中央レーンのメタ台帳。原本はArweave）
create table public.letters (
  id uuid primary key default gen_random_uuid(),
  txid text unique not null,
  bucket_id text not null,
  sender_id uuid references auth.users(id),
  bytes integer not null,
  cost_ar numeric,
  cost_fiat numeric,
  mirror_opt_in boolean default false,
  mirror_id text,                        -- ミラー保存のID（任意）
  created_at timestamptz default now()
);

-- openings（開封履歴：受取者が登録して開封したとき記録）
create table public.openings (
  id uuid primary key default gen_random_uuid(),
  txid text not null references public.letters(txid) on delete cascade,
  opener_id uuid not null references auth.users(id) on delete cascade,
  opened_at timestamptz default now(),
  unique (txid, opener_id)
);

-- telemetry（匿名統計イベント：集計バッチ前提）
create table public.telemetry (
  id bigserial primary key,
  event text not null,                   -- 'sent' | 'found' | 'decrypt' | 'view' | 'status'
  txid text,
  bucket_id text,
  value numeric,
  meta jsonb,
  created_at timestamptz default now()
);
```

---

# 4. 機能フロー

## 4.1 送信（中央レーン）

1. Sender ログイン → フォーム入力（宛先情報・質問と答え・本文/画像/音声）。
2. クライアントで暗号化（鍵封筒方式）。
3. **ダミー違法チェック**（非同期・常に通す・ログだけ残す）。
4. サーバ（Next.js Route Handler）で Irys SDK を使いアップロード → **txid 取得**。
5. `letters` へ台帳書込（bytes/cost/mirrorOptIn）。（mirrorOptIn=true のときは Supabase Storage **は使わず**別のWORM的保管 or S3互換へ「同一バイト列」保存、`mirror_id` 記録のみ）
6. **完了**（txid, bucketId を返す）。

## 4.2 受信（未登録OK）

1. 名前+生年月日 → `bucketId` 計算 → **Arweave GraphQL** 検索。
2. 候補 tx を列挙、**質問文のみ表示**。
3. 回答入力 → ローカル復号（成功時のみ本文表示）。
4. その場で終了 or **登録して「開封者」化**→チャット有効化。

## 4.3 開封者登録

* 開封成功 → Supabase Auth で新規登録/ログイン → `openings` に記録。
* **通知**：当面はメール通知（Supabase Functions か外部Mailer）。

---

# 5. API（Next.js Route Handlers, OpenAPI要旨）

```
POST /api/letters
  auth: sender
  body: { payload, tags, mirrorOptIn }
  resp: { txid, bucketId, fee: { ar, fiat } }

GET /api/index/:bucketId
  auth: none
  resp: { txids: string[], lastSynced?: string }  // Arweave直検索のフォールバック用キャッシュ

POST /api/openings
  auth: opener
  body: { txid }
  resp: { ok: true }

GET /api/stats/public
  auth: none
  resp: {
    letters: { count: number, uniqueSenders: number },
    openings: { count: number, uniqueOpeners: number },
    cost: { totalFiat: number, avgPerLetter: number },
    arweave: { gateway: string, ok: boolean, rttMs: number }
  }

POST /api/telemetry
  auth: none
  body: { events: TelemetryEvent[] }  // 任意・匿名
```

---

# 6. フロント（Next.js App Router）ページ構成

* `/` トップ（既存デザイン：翡翠テーマ）
* `/send` 送信フォーム（**ログイン必須**）

  * 入力：宛先名、生年月日、質問/答え、本文（リッチテキスト→HTML変換）、画像/音声（クライアント圧縮）
  * 進捗バー、サイズ合計（5MB上限）、見積り表示
* `/read` 受信（匿名OK）

  * バケット検索→候補→回答→復号表示
  * 復号成功後「登録して開封者になる」CTA
* `/stats` 公開ダッシュボード（送信/開封/費用/Arweave稼働）
* `/account` アカウント（ニックネームなど）

---

# 7. クライアント暗号ユーティリティ（要件）

* `normalizeAnswer(s: string): string`
* `deriveKAns(answerNorm: string, salt: Uint8Array, params): Promise<Uint8Array>` （Argon2id WASM）
* `aeadEncrypt/Decrypt`（WebCrypto AES-GCM, 96bit IV, 128bitタグ）
* `buildLetterPayload(html: Uint8Array, question: string, answer: string, kdfParams): LetterJSON`
* **5MB制限**：HTML + 画像/音声の data\:URI 埋め込み後の**最終サイズ**で判定。
* 画像は長辺 1280px / JPEG Q=0.7、音声は MP3 64–96kbps 推奨（クライアントで変換できない場合はサーバ前処理）。

---

# 8. Irys（Bundlr）連携（サーバ）

* SDK 初期化：`IRYS_NODE_URL`, `IRYS_TOKEN`（例：`matic`）
* `GET /api/fees?bytes=` でリアルタイム見積（Arweave `/price/bytes` も参考）
* `POST /api/letters`：payload を **そのまま**アップロード、**txid** を返す
* 失敗時は最大 **3回**リトライ、バックオフ
* **費用台帳**を `letters` に記録（AR/法定通貨換算）

---

# 9. 統計・テレメトリ

* 送信：`event='sent'`（txid, bytes, cost, lane='central', mirrorOptIn）
* 受信：`event='found'`（bucketId, count）、`event='decrypt'`（txid, success, kdfTimeMs）、`event='view'`（txid）
* ステータス：`event='status'`（gateway, ok, rttMs）
* 集計SQL（公開ダッシュボード用）：

```sql
-- 送信手紙数・送信者人数
select count(*) as letters, count(distinct sender_id) as unique_senders from letters;

-- 受取手紙数・受取者人数（開封者）
select count(*) as openings, count(distinct opener_id) as unique_openers from openings;

-- 費用
select coalesce(sum(cost_fiat),0) as total_fiat,
       coalesce(avg(cost_fiat),0)  as avg_per_letter
from letters;

-- Arweave ステータス（直近N分）
select (sum(case when (meta->>'ok')::boolean then 1 else 0 end)::float / greatest(count(*),1)) > 0.95 as ok_rate_high
from telemetry where event='status' and created_at > now() - interval '10 minutes';
```

---

# 10. ダミー違法対策（占位）

* `POST /api/moderation/check`：入力（テキスト/画像/音声メタ）を受け、**常に `ok: true`** を返す。
* 返却時間は **ランダム 200–500ms** で擬似。
* 本番導入時はここを差し替え。

---

# 11. レート制御・濫用対策（最小）

* 送信：**1ユーザ/日 1通**、1通 **5MB**。
* 404/429/5xx レスポンスを統計に記録。

---

# 12. 環境変数

* `NEXT_PUBLIC_ARWEAVE_GATEWAYS`（CSV, 例：`https://arweave.net,https://gateway.irys.xyz`）
* `IRYS_NODE_URL`, `IRYS_TOKEN`, `IRYS_PRIVATE_KEY`（必要形態に応じて）
* `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
* `APP_FREE_LIMIT_BYTES=5242880`
* `APP_ENABLE_TELEMETRY=true`

---

# 13. アクセシビリティ & i18n

* 日本語固定。`<html lang="ja">`、aria-label整備、キーボード操作可。
* 画像`alt`、音声は短い説明文。印刷CSSあり。

---

# 17. セキュリティ・プライバシー注意

* 回答平文・名前・生年月日を**サーバに送らない**（ローカルのみ）。
* 送信payloadは**暗号化済み**をIrysへ。そのハッシュ/txid以外は保持しない。
* 統計は**匿名**、IPは**ハッシュ**（ソルト日替わり）で保存。
* Mirrorは**オプトイン**のみ・**原本バイト列と完全一致**（WORM）。
* 利用規約に**永久保存の性質**と**削除＝鍵破棄の性質**を記載。

---

