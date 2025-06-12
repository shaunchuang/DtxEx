import React from 'react';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/components/QueryProvider';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <title>動態醫療量表問卷系統</title>
        <meta name="description" content="動態醫療量表問卷系統 - 支援多種題型的問卷平台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <QueryProvider>
          <div className="min-h-screen bg-secondary-50">
            <header className="bg-white shadow-sm border-b border-secondary-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <h1 className="text-xl font-bold text-gradient">
                    動態醫療量表問卷系統
                  </h1>
                  <nav className="flex space-x-4">
                    <a
                      href="/"
                      className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      首頁
                    </a>
                    <a
                      href="/questionnaires"
                      className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      問卷列表
                    </a>
                    <a
                      href="/my-responses"
                      className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      我的記錄
                    </a>
                    <a
                      href="/admin"
                      className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      管理後台
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            
            <footer className="bg-white border-t border-secondary-200 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-center text-secondary-500 text-sm">
                  © 2025 動態醫療量表問卷系統. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
