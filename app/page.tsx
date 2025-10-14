import { Hero } from '@/components/landing/Hero';
import { JobOverview } from '@/components/landing/JobOverview';
import {
  JOB_TITLE,
  JOB_SUBTITLE,
  JOB_BADGES,
  WHAT_YOU_WILL_DO,
  WHO_WE_ARE_LOOKING_FOR,
  WHY_STARTGUIDES,
} from '@/lib/constants';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero
        title={JOB_TITLE}
        subtitle={JOB_SUBTITLE}
        badges={JOB_BADGES}
      />
      <JobOverview
        whatYouWillDo={WHAT_YOU_WILL_DO}
        whoWeLookingFor={WHO_WE_ARE_LOOKING_FOR}
        whyStartGuides={WHY_STARTGUIDES}
      />
    </main>
  );
}
