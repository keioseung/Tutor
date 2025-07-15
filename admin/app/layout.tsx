import React from 'react';
import '../app/globals.css';
import MainLayout from '../components/MainLayout';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Education Admin',
  description: 'AI Education Platform Admin Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
} 