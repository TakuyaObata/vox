"use client";

import React from "react";
import { Mail, Shield, Globe, Clock, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const jade = {
  50: "#f0fdf4",
  100: "#dcfce7", 
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
  950: "#052e16"
};

const Container: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const CTA: React.FC<{ as?: "a" | "button"; href?: string; variant?: "primary" | "ghost"; children: React.ReactNode; [key: string]: unknown }> = ({ as = "a", href = "#", variant = "primary", children, ...rest }) => {
  const base = "inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold transition-transform active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const styles = variant === "primary"
    ? `text-white shadow-md shadow-[${jade[600]}]/30`
    : `text-[${jade[800]}] bg-white/60 backdrop-blur border border-white/50 hover:bg-white`;
  
  if (as === "a") {
    return (
      <a 
        href={href}
        className={`${base} ${styles}`}
        style={variant === "primary" ? { background: `linear-gradient(135deg, ${jade[500]} 0%, ${jade[600]} 100%)` } : {}}
        {...rest}
      >
        {children}
      </a>
    );
  }
  
  return (
    <button 
      className={`${base} ${styles}`}
      style={variant === "primary" ? { background: `linear-gradient(135deg, ${jade[500]} 0%, ${jade[600]} 100%)` } : {}}
      {...rest}
    >
      {children}
    </button>
  );
};

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionTitle: React.FC<{ eyebrow?: string; title: string; subtitle?: string }> = ({ eyebrow, title, subtitle }) => (
  <div className="text-center">
    {eyebrow && <div className="text-sm font-medium text-gray-500 mb-2">{eyebrow}</div>}
    <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

export function JadeLanding() {
  return (
    <div className="min-h-screen" style={{background: `linear-gradient(135deg, ${jade[50]} 0%, ${jade[100]} 100%)`}}>
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{background: jade[500]}}>
              <Mail className="h-5 w-5 text-white"/>
            </div>
            <span className="text-xl font-bold text-gray-900">永遠の手紙</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">機能</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">使い方</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <CTA variant="ghost" href="/read">手紙を読む</CTA>
            <CTA href="/send">手紙を送る</CTA>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <Container className="text-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur rounded-full px-4 py-2 text-sm font-medium text-gray-700 mb-6">
                <Globe className="h-4 w-4" />
                分散UI対応・半永久保存
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                永遠に残る<br />
                <span style={{color: jade[600]}}>暗号化手紙</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Arweaveブロックチェーンで半永久保存。受取者だけが読める暗号化手紙を、無料枠で最大5MBまで送信できます。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <CTA href="/send" className="text-lg px-8 py-4">
                  手紙を送る <ArrowRight className="h-5 w-5" />
                </CTA>
                <CTA variant="ghost" href="/read" className="text-lg px-8 py-4">
                  手紙を読む
                </CTA>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{background: jade[100]}}>
                      <Shield className="h-5 w-5" style={{color: jade[600]}} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">エンドツーエンド暗号化</div>
                      <div className="text-sm text-gray-600">Argon2id + AES-256-GCM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{background: jade[100]}}>
                      <Clock className="h-5 w-5" style={{color: jade[600]}} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">永続保存</div>
                      <div className="text-sm text-gray-600">Arweaveブロックチェーン</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <Container>
          <SectionTitle 
            eyebrow="主な機能"
            title="なぜ永遠の手紙なのか"
            subtitle="従来のメールやメッセージとは異なる、永続性と暗号化を重視した手紙システム"
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card>
              <div className="text-center">
                <div className="h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background: jade[100]}}>
                  <Shield className="h-6 w-6" style={{color: jade[600]}} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">完全暗号化</h3>
                  <p className="text-gray-600">秘密の質問の答えを知る人だけが復号可能。サーバには暗号化済みデータのみ保存。</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <div className="h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background: jade[100]}}>
                  <Clock className="h-6 w-6" style={{color: jade[600]}} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">永続保存</h3>
                  <p className="text-gray-600">Arweaveブロックチェーンで半永久保存。中央サービスが停止しても手紙は残り続けます。</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <div className="h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background: jade[100]}}>
                  <Users className="h-6 w-6" style={{color: jade[600]}} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">匿名受信</h3>
                  <p className="text-gray-600">受取者は登録不要。名前と生年月日だけで手紙を検索・受信できます。</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <Container>
          <SectionTitle 
            title="使い方"
            subtitle="シンプルな3ステップで永遠の手紙を送受信"
          />
          
          <ol className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { step: "1", title: "手紙を作成", desc: "宛先情報、秘密の質問、本文を入力。画像や音声も添付可能（最大5MB）。" },
              { step: "2", title: "暗号化して送信", desc: "クライアント側で暗号化後、Arweaveに永続保存。txidが発行されます。" },
              { step: "3", title: "受取者が復号", desc: "名前・生年月日で検索し、秘密の質問に答えて手紙を読めます。" }
            ].map((item, i) => (
              <li key={i}>
                <Card className="h-full">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{background: jade[500]}}>
                      {item.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Stats Preview */}
      <section className="py-20 bg-white/50">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">リアルタイム統計</h2>
            <div className="inline-flex items-center gap-2 text-gray-600 mb-8">
              <Globe className="h-4 w-4" />
              分散ビューアでも確認可能
            </div>
          </div>
        </Container>
      </section>

      {/* Technical Details */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">技術仕様</h2>
            <p className="text-lg text-gray-600">オープンソースの暗号化技術とブロックチェーンを活用</p>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white/50">
        <Container>
          <SectionTitle 
            title="よくある質問"
            subtitle="永遠の手紙について知っておきたいこと"
          />
          
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {[
              { q: "無料で使えますか？", a: "はい、1ユーザーあたり1日1通、最大5MBまで無料でご利用いただけます。" },
              { q: "手紙は本当に永続保存されますか？", a: "Arweaveブロックチェーンに保存されるため、理論上は数百年以上保存される設計です。" },
              { q: "暗号化は安全ですか？", a: "Argon2id + AES-256-GCMを使用し、秘密の答えを知る人のみが復号可能です。" },
              { q: "受取者は登録が必要ですか？", a: "いいえ、名前と生年月日があれば誰でも手紙を検索・受信できます。" }
            ].map((item, i) => (
              <Card key={i}>
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur">
        <Container className="py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md flex items-center justify-center" style={{background: jade[500]}}>
                <Mail className="h-3.5 w-3.5 text-white"/>
              </div>
              <span>© {new Date().getFullYear()} 永遠の手紙</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-zinc-800">利用規約</a>
              <a href="#" className="hover:text-zinc-800">プライバシー</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
