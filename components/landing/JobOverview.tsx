import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

interface JobOverviewProps {
  whatYouWillDo: string[];
  whoWeLookingFor: string[];
  whyStartGuides: string[];
}

export function JobOverview({ whatYouWillDo, whoWeLookingFor, whyStartGuides }: JobOverviewProps) {
  return (
    <>
      {/* Role Overview Section */}
      <section className="w-full bg-white py-20 md:py-24 px-6">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* What You'll Do */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 pb-4 border-b border-gray-200">
                What You&apos;ll Do
              </h3>
              <ul className="space-y-3">
                {whatYouWillDo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who We're Looking For */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 pb-4 border-b border-orange-100">
                Who We&apos;re Looking For
              </h3>
              <ul className="space-y-3">
                {whoWeLookingFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why StartGuides */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 pb-4 border-b border-gray-200">
                Why StartGuides
              </h3>
              <ul className="space-y-3">
                {whyStartGuides.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-b from-dark-900 to-dark-950 py-20 md:py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Apply?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Join us in transforming how America&apos;s frontline forces learn and perform.
          </p>
          <Link href="/apply">
            <Button size="large" variant="primary" className="inline-flex items-center gap-2">
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
