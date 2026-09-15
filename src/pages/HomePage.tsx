import React from 'react';
import { Hero } from '../components/Hero';
import { RegistrationStatus } from '../components/RegistrationStatus';
import { ClubMarquee } from '../components/ClubMarquee';
import { Messages } from '../components/Messages';
import { Stats } from '../components/Stats';
import { About } from '../components/About';
import { ClubShowcase } from '../components/ClubShowcase';
import { Achievements } from '../components/Achievements';
import { Benefits } from '../components/Benefits';
import { RegistrationProcess } from '../components/RegistrationProcess';
import { CTASection } from '../components/CTASection';

export function HomePage() {
  return (
    <>
      <Hero />
      <RegistrationStatus />
      <ClubMarquee />
      <Messages />
      <Stats />
      <About />
      <ClubShowcase />
      <Achievements />
      <Benefits />
      <RegistrationProcess />
      <CTASection />
    </>
  );
}
