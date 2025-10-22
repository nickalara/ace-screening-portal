'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Copy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id') || 'N/A';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16 md:py-24 px-6">
      <div className="max-w-success mx-auto">
        <div className="bg-white border border-success-600 rounded-xl p-12 md:p-16 shadow-lg text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success-600 rounded-full mb-8 animate-in">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Application Submitted Successfully!
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
            Thank you for applying to the Application Content Engineer role at StartGuides.
          </p>

          {/* Application ID */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Your Application ID
            </p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-lg md:text-xl font-mono font-semibold text-slate-900 tracking-wide">
                {applicationId}
              </p>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                aria-label="Copy application ID"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="text-left max-w-md mx-auto mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              What Happens Next?
            </h2>
            <ol className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  1
                </span>
                <span>Our team will review your application within 3-5 business days</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  2
                </span>
                <span>We'll reach out via email if we'd like to schedule an interview</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  3
                </span>
                <span>Please keep your Application ID for future reference</span>
              </li>
            </ol>
          </div>

          {/* Timeline Callout */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-md p-4 mb-8">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium">Expected response time: 3-5 business days</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/">
              <Button variant="secondary" size="medium" className="w-full md:w-auto">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
