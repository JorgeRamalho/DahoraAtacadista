import { HomeCarousel } from "@/components/home/HomeCarousel";
import { HomeClubStatusBar } from "@/components/home/HomeClubStatusBar";
import { HomeAppDownload } from "@/components/home/HomeAppDownload";
import { HomeBenefits } from "@/components/home/HomeBenefits";
import { HomeCardSpotlight } from "@/components/home/HomeCardSpotlight";
import { HomeJourney } from "@/components/home/HomeJourney";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeCadastro } from "@/components/home/HomeCadastro";
import { brand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: `${brand.fullName} — ${brand.slogan}`,
  },
};

export default function HomePage() {
  return (
    <>
      <HomeCarousel />
      <HomeClubStatusBar />
      <HomeAppDownload />
      <HomeBenefits />
      <HomeCardSpotlight />
      <HomeJourney />
      <HomeHero />
      <HomeFaq />
      <HomeCadastro />
    </>
  );
}
