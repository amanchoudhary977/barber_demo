import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { FlowProvider } from '@/context/FlowContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StyleGenius — AI-Powered Grooming Previews',
  description:
    'Upload your photo and preview realistic hairstyles and beard styles powered by AI. Get personalized grooming recommendations based on your face shape and features.',
  keywords: ['grooming', 'hairstyle', 'beard', 'AI', 'style preview', 'face shape'],
  openGraph: {
    title: 'StyleGenius — AI-Powered Grooming Previews',
    description:
      'Preview realistic hairstyles and beard styles with AI. Personalized recommendations based on your features.',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FlowProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </FlowProvider>
      </body>
    </html>
  );
}
