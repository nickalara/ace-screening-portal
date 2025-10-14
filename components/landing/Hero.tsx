import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  title: string;
  subtitle: string;
  badges: string[];
  ctaText?: string;
  ctaHref?: string;
}

export function Hero({ title, subtitle, badges, ctaText = 'Apply Now', ctaHref = '/apply' }: HeroProps) {
  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-20 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {badges.map((badge) => (
            <span
              key={badge}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-sm text-slate-200 font-medium backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        <Link href={ctaHref}>
          <Button size="large" variant="primary" className="inline-flex items-center gap-2">
            {ctaText}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
