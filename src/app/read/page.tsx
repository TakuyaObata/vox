"use client";

import React, { useState } from "react";
import { Search, Lock, Eye, UserPlus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
// import { normalizeIdentity, normalizeAnswer, deriveKAns, aeadDecrypt, hexToUint8Array } from "@/lib/crypto";

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

interface LetterCandidate {
  txid: string;
  question: string;
  timestamp: string;
}

export default function ReadPage() {
  const [searchData, setSearchData] = useState({
    recipientName: "",
    recipientDob: ""
  });
  
  const [candidates, setCandidates] = useState<LetterCandidate[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<LetterCandidate | null>(null);
  const [answer, setAnswer] = useState("");
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchData.recipientName || !searchData.recipientDob) {
      setError("名前と生年月日を入力してください");
      return;
    }

    setIsSearching(true);
    setError(null);
    setCandidates([]);

    try {
      const bucketId = `bucket_${searchData.recipientName}_${searchData.recipientDob}`.replace(/\s+/g, '').toLowerCase();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCandidates: LetterCandidate[] = [
        {
          txid: "abc123def456",
          question: "あなたの好きな色は？",
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          txid: "xyz789uvw012",
          question: "初めて飼ったペットの名前は？",
          timestamp: "2024-01-10T14:20:00Z"
        }
      ];
      
      setCandidates(mockCandidates);
    } catch (error) {
      console.error("検索エラー:", error);
      setError("手紙の検索に失敗しました");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDecrypt = async () => {
    if (!selectedLetter || !answer) {
      setError("答えを入力してください");
      return;
    }

    setIsDecrypting(true);
    setError(null);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockContent = `
        <h2>親愛なる${searchData.recipientName}へ</h2>
        <p>この手紙があなたに届くことを願っています。</p>
        <p>永遠に保存される手紙として、私の想いを込めて書いています。</p>
        <p>Arweaveブロックチェーンに永続保存されたこの手紙が、時を超えてあなたに届きますように。</p>
        <p>愛を込めて</p>
      `;
      
      setDecryptedContent(mockContent);
    } catch (error) {
      console.error("復号エラー:", error);
      setError("復号に失敗しました。答えが正しいか確認してください。");
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleRegisterAsOpener = () => {
    alert("開封者として登録する機能は実装中です");
  };

  return (
    <div className="min-h-screen" style={{background: `linear-gradient(135deg, ${jade[50]} 0%, ${jade[100]} 100%)`}}>
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{background: jade[500]}}>
              <Eye className="h-5 w-5 text-white"/>
            </div>
            <span className="text-xl font-bold text-gray-900">永遠の手紙</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">ホーム</a>
            <a href="/send" className="text-gray-600 hover:text-gray-900">手紙を送る</a>
            <a href="/stats" className="text-gray-600 hover:text-gray-900">統計</a>
          </nav>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">手紙を読む</h1>
              <p className="text-lg text-gray-600">
                名前と生年月日で手紙を検索し、秘密の答えで復号して読むことができます
              </p>
            </div>

            {/* Search Section */}
            <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">手紙を検索</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    あなたの名前
                  </label>
                  <input
                    type="text"
                    value={searchData.recipientName}
                    onChange={(e) => setSearchData(prev => ({ ...prev, recipientName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    placeholder="山田太郎"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    あなたの生年月日
                  </label>
                  <input
                    type="date"
                    value={searchData.recipientDob}
                    onChange={(e) => setSearchData(prev => ({ ...prev, recipientDob: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full py-3 px-6 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: isSearching 
                      ? '#9ca3af' 
                      : `linear-gradient(135deg, ${jade[500]} 0%, ${jade[600]} 100%)`
                  }}
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      検索中...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Search className="h-4 w-4" />
                      手紙を検索
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Candidates List */}
            {candidates.length > 0 && (
              <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">見つかった手紙</h2>
                
                <div className="space-y-3">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.txid}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                        selectedLetter?.txid === candidate.txid
                          ? 'border-jade-500 bg-jade-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedLetter(candidate)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{candidate.question}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(candidate.timestamp).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">暗号化済み</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decryption Section */}
            {selectedLetter && (
              <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">手紙を復号</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      質問: {selectedLetter.question}
                    </label>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                      placeholder="答えを入力してください"
                    />
                  </div>

                  <button
                    onClick={handleDecrypt}
                    disabled={isDecrypting || !answer}
                    className="w-full py-3 px-6 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: isDecrypting || !answer
                        ? '#9ca3af' 
                        : `linear-gradient(135deg, ${jade[500]} 0%, ${jade[600]} 100%)`
                    }}
                  >
                    {isDecrypting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        復号中...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Lock className="h-4 w-4" />
                        手紙を復号
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Decrypted Content */}
            {decryptedContent && (
              <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">手紙の内容</h2>
                  <div className="flex items-center gap-2 text-green-600">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">復号成功</span>
                  </div>
                </div>
                
                <div 
                  className="prose prose-gray max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: decryptedContent }}
                />

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    この手紙を正常に復号できました。開封者として登録すると、送信者に通知が送られます。
                  </p>
                  
                  <button
                    onClick={handleRegisterAsOpener}
                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-2xl transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${jade[500]} 0%, ${jade[600]} 100%)`
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                    開封者として登録
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </Container>
      </main>
    </div>
  );
}
