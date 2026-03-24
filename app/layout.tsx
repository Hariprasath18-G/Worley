import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/components/AppProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Worley Transition Pathfinder',
  description:
    'Delivering Sustainable Change. AI-Powered Scenario Explorer for Asset Transition Decisions. Upload asset data, get multi-pathway scenario comparisons across Optimize+CCS, Repurpose to Hydrogen, Repurpose to Biofuels, and Decommission.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-worley-text-primary">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
