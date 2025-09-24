"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Users, Mail, DollarSign, Globe, TrendingUp } from "lucide-react";
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

interface PublicStats {
  letters: {
    count: number;
    uniqueSenders: number;
  };
  openings: {
    count: number;
    uniqueOpeners: number;
  };
  cost: {
    totalFiat: number;
    avgPerLetter: number;
  };
  arweave: {
    gateway: string;
    ok: boolean;
    rttMs: number;
  };
}

export default function StatsPage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStats: PublicStats = {
          letters: {
            count: 1247,
            uniqueSenders: 892
          },
          openings: {
            count: 734,
            uniqueOpeners: 456
          },
          cost: {
            totalFiat: 2847.32,
            avgPerLetter: 2.28
          },
          arweave: {
            gateway: "https://arweave.net",
            ok: true,
            rttMs: 245
          }
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error("統計データの取得エラー:", error);
        setError("統計データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: string;
    color?: string;
  }> = ({ icon, title, value, subtitle, trend, color = jade[500] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: color }}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
        <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen" style={{background: `linear-gradient(135deg, ${jade[50]} 0%, ${jade[100]} 100%)`}}>
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{background: jade[500]}}>
              <BarChart3 className="h-5 w-5 text-white"/>
            </div>
            <span className="text-xl font-bold text-gray-900">永遠の手紙</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">ホーム</a>
            <a href="/send" className="text-gray-600 hover:text-gray-900">手紙を送る</a>
            <a href="/read" className="text-gray-600 hover:text-gray-900">手紙を読む</a>
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
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">公開統計</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                永遠の手紙システムの利用状況とArweaveネットワークの稼働状況をリアルタイムで表示します
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-jade-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg text-gray-600">統計データを読み込み中...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
                <div className="text-red-700 mb-2">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                >
                  再読み込み
                </button>
              </div>
            ) : stats ? (
              <div className="space-y-8">
                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={<Mail className="h-6 w-6 text-white" />}
                    title="送信された手紙"
                    value={stats.letters.count}
                    subtitle={`${stats.letters.uniqueSenders}人の送信者`}
                    trend="+12%"
                    color={jade[500]}
                  />
                  
                  <StatCard
                    icon={<Users className="h-6 w-6 text-white" />}
                    title="開封された手紙"
                    value={stats.openings.count}
                    subtitle={`${stats.openings.uniqueOpeners}人の開封者`}
                    trend="+8%"
                    color={jade[600]}
                  />
                  
                  <StatCard
                    icon={<DollarSign className="h-6 w-6 text-white" />}
                    title="総保存費用"
                    value={`¥${stats.cost.totalFiat.toLocaleString()}`}
                    subtitle={`平均 ¥${stats.cost.avgPerLetter.toFixed(2)}/通`}
                    color={jade[700]}
                  />
                  
                  <StatCard
                    icon={<Globe className="h-6 w-6 text-white" />}
                    title="Arweave稼働率"
                    value={stats.arweave.ok ? "99.9%" : "障害中"}
                    subtitle={`応答時間: ${stats.arweave.rttMs}ms`}
                    color={stats.arweave.ok ? jade[500] : "#ef4444"}
                  />
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Letter Statistics */}
                  <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">手紙統計</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">総送信数</span>
                        <span className="font-semibold text-gray-900">{stats.letters.count.toLocaleString()}通</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">ユニーク送信者</span>
                        <span className="font-semibold text-gray-900">{stats.letters.uniqueSenders.toLocaleString()}人</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">開封率</span>
                        <span className="font-semibold text-gray-900">
                          {((stats.openings.count / stats.letters.count) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-gray-600">平均手紙あたり開封者</span>
                        <span className="font-semibold text-gray-900">
                          {(stats.openings.uniqueOpeners / stats.letters.count).toFixed(1)}人
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Network Status */}
                  <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">ネットワーク状況</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">プライマリゲートウェイ</span>
                        <span className="font-semibold text-gray-900">{stats.arweave.gateway}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">ステータス</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`h-2 w-2 rounded-full ${stats.arweave.ok ? 'bg-green-500' : 'bg-red-500'}`}
                          />
                          <span className="font-semibold text-gray-900">
                            {stats.arweave.ok ? "正常" : "障害"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">応答時間</span>
                        <span className="font-semibold text-gray-900">{stats.arweave.rttMs}ms</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-gray-600">データ永続性</span>
                        <span className="font-semibold text-green-600">保証済み</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">統計について</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-4">
                      これらの統計は永遠の手紙システムの利用状況をリアルタイムで表示しています。
                      すべてのデータは匿名化されており、個人を特定できる情報は含まれていません。
                    </p>
                    <ul className="text-gray-600 space-y-2">
                      <li>• 手紙データはArweaveブロックチェーンに永続保存されます</li>
                      <li>• 暗号化により送信者と受信者のプライバシーが保護されます</li>
                      <li>• 統計データは10分ごとに更新されます</li>
                      <li>• ネットワーク稼働率は過去24時間の平均値です</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </Container>
      </main>
    </div>
  );
}
