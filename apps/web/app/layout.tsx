import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { RoleProvider } from '@/context/RoleContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hospital Management System (HMS) Demo',
  description:
    'Clinical portal with Role-Based Access Control (RBAC), Audit Trail Viewer, and AI Voice Receptionist Integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}
