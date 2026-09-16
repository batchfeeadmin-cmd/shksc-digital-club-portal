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
import { HomeTestimonials } from '../components/HomeTestimonials';
import { HomeFAQ } from '../components/HomeFAQ';
import { HomeSocial } from '../components/HomeSocial';
import { CTASection } from '../components/CTASection';
import { HomeNotices } from '../components/HomeNotices';

export function HomePage() {
  return (
    <>
      <Hero />
      <RegistrationStatus />
      <ClubMarquee />
      <Messages />
      <Stats />
      <HomeNotices />
      <About />
      <ClubShowcase />
      <Achievements />
      <Benefits />
      <HomeTestimonials />
      <HomeFAQ />
      <HomeSocial />
      <CTASection />
    </>
  );
}
