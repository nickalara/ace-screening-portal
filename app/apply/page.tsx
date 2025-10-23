import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ApplicationForm } from '@/components/form/ApplicationForm';

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="max-w-form mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Application Content Engineer
          </h1>
          <p className="text-lg text-slate-600">
            We&apos;re excited to learn more about you. Please complete all sections below.
          </p>
        </div>

        {/* Application Form */}
        <ApplicationForm />
      </div>
    </main>
  );
}
