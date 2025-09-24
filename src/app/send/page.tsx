"use client";

import React, { useState } from "react";
import { Mail, Upload, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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

export default function SendPage() {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDob: "",
    question: "",
    answer: "",
    content: "",
    attachments: [] as File[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const newTotalSize = totalSize + newFiles.reduce((sum, file) => sum + file.size, 0);
    
    if (newTotalSize > MAX_SIZE) {
      alert("ファイルサイズの合計が5MBを超えています");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
    setTotalSize(newTotalSize);
  };

  const removeFile = (index: number) => {
    const removedFile = formData.attachments[index];
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setTotalSize(prev => prev - removedFile.size);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(0);

    try {
      
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      alert("手紙が正常に送信されました！");
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
            <Link href="/" className="text-gray-600 hover:text-gray-900">ホーム</Link>
            <Link href="/read" className="text-gray-600 hover:text-gray-900">手紙を読む</Link>
            <Link href="/stats" className="text-gray-600 hover:text-gray-900">統計</Link>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">手紙を送る</h1>
              <p className="text-lg text-gray-600">
                暗号化された手紙をArweaveブロックチェーンに永続保存します
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">受取者情報</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      受取者の名前
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => handleInputChange("recipientName", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                      placeholder="山田太郎"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      受取者の生年月日
                    </label>
                    <input
                      type="date"
                      value={formData.recipientDob}
                      onChange={(e) => handleInputChange("recipientDob", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Security Question */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">秘密の質問</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      質問
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => handleInputChange("question", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                      placeholder="あなたの好きな色は？"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      答え
                    </label>
                    <input
                      type="text"
                      value={formData.answer}
                      onChange={(e) => handleInputChange("answer", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                      placeholder="青"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      この答えを知る人だけが手紙を読むことができます
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">手紙の内容</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      本文
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                      placeholder="ここに手紙の内容を書いてください..."
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      添付ファイル（画像・音声）
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        ファイルをドラッグ&ドロップまたはクリックして選択
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,audio/*"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-200"
                      >
                        ファイルを選択
                      </label>
                    </div>

                    {/* File List */}
                    {formData.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Upload className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              削除
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Size and Cost Info */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">使用容量</span>
                    <span className="text-sm text-gray-600">
                      {formatFileSize(totalSize)} / {formatFileSize(MAX_SIZE)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(totalSize / MAX_SIZE) * 100}%`,
                        background: totalSize > MAX_SIZE * 0.8 ? '#ef4444' : jade[500]
                      }}
                    />
                  </div>
                  {totalSize > MAX_SIZE * 0.8 && (
                    <div className="flex items-center gap-2 mt-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">容量制限に近づいています</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  {isSubmitting && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">送信中...</span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            background: jade[500]
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || totalSize > MAX_SIZE}
                    className="w-full py-4 px-6 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isSubmitting || totalSize > MAX_SIZE 
                        ? '#9ca3af' 
                        : `linear-gradient(135deg, ${jade[500]} 0%, ${jade[600]} 100%)`
                    }}
                  >
                    {isSubmitting ? "送信中..." : "手紙を送信"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  );
}
