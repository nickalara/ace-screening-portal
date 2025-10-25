import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CardBasedApplicationForm } from '@/components/form/CardBasedApplicationForm';

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Application Content Engineer
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            We&apos;re excited to learn more about you. Please complete all sections below.
          </p>
        </div>

        {/* Application Form */}
        <CardBasedApplicationForm />
      </div>
    </main>
  );
}
