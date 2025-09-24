"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Calendar, Settings, LogOut, Shield } from "lucide-react";
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

interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  lettersSent: number;
  lettersOpened: number;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: UserProfile = {
          id: "user_123456",
          email: "user@example.com",
          displayName: "山田太郎",
          createdAt: "2024-01-15T10:30:00Z",
          lettersSent: 12,
          lettersOpened: 8
        };
        
        setUser(mockUser);
        setDisplayName(mockUser.displayName || "");
      } catch (error) {
        console.error("プロフィール取得エラー:", error);
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(prev => prev ? { ...prev, displayName } : null);
      setIsEditing(false);
    } catch (error) {
      console.error("プロフィール更新エラー:", error);
      alert("プロフィールの更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = "/";
    } catch (error) {
      console.error("サインアウトエラー:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{background: `linear-gradient(135deg, ${jade[50]} 0%, ${jade[100]} 100%)`}}>
        <header className="relative z-50 bg-white/80 backdrop-blur border-b border-gray-200">
          <Container className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{background: jade[500]}}>
                <User className="h-5 w-5 text-white"/>
              </div>
              <span className="text-xl font-bold text-gray-900">永遠の手紙</span>
            </div>
          </Container>
        </header>
        
        <main className="py-12">
          <Container>
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-jade-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg text-gray-600">プロフィールを読み込み中...</span>
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen" style={{background: `linear-gradient(135deg, ${jade[50]} 0%, ${jade[100]} 100%)`}}>
        <header className="relative z-50 bg-white/80 backdrop-blur border-b border-gray-200">
          <Container className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{background: jade[500]}}>
                <User className="h-5 w-5 text-white"/>
              </div>
              <span className="text-xl font-bold text-gray-900">永遠の手紙</span>
            </div>
          </Container>
        </header>
        
        <main className="py-12">
          <Container>
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">認証が必要です</h1>
              <p className="text-gray-600 mb-6">アカウントページにアクセスするにはログインが必要です。</p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-2xl transition-all duration-200"
                style={{background: `linear-gradient(135deg, ${jade[500]} 0%, ${jade[600]} 100%)`}}
              >
                ホームに戻る
              </a>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: `linear-gradient(135deg, ${jade[50]} 0%, ${jade[100]} 100%)`}}>
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{background: jade[500]}}>
              <User className="h-5 w-5 text-white"/>
            </div>
            <span className="text-xl font-bold text-gray-900">永遠の手紙</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">ホーム</a>
            <a href="/send" className="text-gray-600 hover:text-gray-900">手紙を送る</a>
            <a href="/read" className="text-gray-600 hover:text-gray-900">手紙を読む</a>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">アカウント</h1>
              <p className="text-lg text-gray-600">
                プロフィール情報と利用状況を管理できます
              </p>
            </div>

            {/* Profile Section */}
            <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">プロフィール</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  {isEditing ? "キャンセル" : "編集"}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    表示名
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                      placeholder="表示名を入力"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{user.displayName || "未設定"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    登録日
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full py-3 px-6 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50"
                      style={{
                        background: isSaving 
                          ? '#9ca3af' 
                          : `linear-gradient(135deg, ${jade[500]} 0%, ${jade[600]} 100%)`
                      }}
                    >
                      {isSaving ? "保存中..." : "プロフィールを保存"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">利用状況</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-jade-50 to-jade-100 rounded-2xl">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{background: jade[500]}}>
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{user.lettersSent}</h3>
                  <p className="text-sm font-medium text-gray-700">送信した手紙</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-jade-50 to-jade-100 rounded-2xl">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{background: jade[600]}}>
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{user.lettersOpened}</h3>
                  <p className="text-sm font-medium text-gray-700">開封した手紙</p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">アカウント操作</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  サインアウト
                </button>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    アカウントに関するご質問やサポートが必要な場合は、
                    <a href="mailto:support@example.com" className="text-jade-600 hover:text-jade-700">
                      サポートチーム
                    </a>
                    までお問い合わせください。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  );
}
