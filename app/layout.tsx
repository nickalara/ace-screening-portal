import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Application Content Engineer - StartGuides',
  description: 'Join the team redefining how America\'s warfighters learn. Apply for the Application Content Engineer role at StartGuides.',
  keywords: 'Application Content Engineer, StartGuides, military training, AI-first, job application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
