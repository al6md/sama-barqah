import type { Metadata } from 'next';
import './globals.css';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { UserAuthProvider } from '@/contexts/UserAuthContext';
import { AuthModal } from '@/components/AuthModal';

export const metadata: Metadata = {
  title: 'سما البارقة للسفر والسياحة | Sama Al Barqah Travel & Tourism',
  description: 'سما البارقة للسفر والسياحة – اكتشف أجمل الوجهات والرحلات السياحية في كردستان والعراق واحجز رحلتك بسهولة وفخامة.',
  keywords: ['سياحة العراق', 'رحلات كردستان', 'سما البارقة', 'حجوزات سياحية أربيل', 'سليمانية', 'دهوك', 'سياحة وسفر العراق'],
  openGraph: {
    title: 'سما البارقة للسفر والسياحة | Sama Al Barqah',
    description: 'بوابتكم الفاخرة لأجمل الوجهات والرحلات السياحية في كردستان والعراق بأعلى معايير الراحة والأمان.',
    type: 'website',
    locale: 'ar_IQ',
    siteName: 'سما البارقة للسفر والسياحة'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سما البارقة للسفر والسياحة',
    description: 'بوابتكم الفاخرة لأجمل الرحلات السياحية في العراق.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#4CC9FE] selection:text-white bg-[#FDFFF5] text-[#1D2D2E]" style={{ fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif" }} suppressHydrationWarning>
        <UserAuthProvider>
          <AnalyticsTracker />
          {children}
          <AuthModal />
        </UserAuthProvider>
      </body>
    </html>
  );
}

