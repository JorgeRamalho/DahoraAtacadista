import { HomeCarousel } from "@/components/home/HomeCarousel";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBenefits } from "@/components/home/HomeBenefits";
import { HomeCardSpotlight } from "@/components/home/HomeCardSpotlight";
import { HomeJourney } from "@/components/home/HomeJourney";

export default function HomePage() {
  return (
    <>
      <HomeCarousel />
      <HomeHero />
      <HomeBenefits />
      <HomeCardSpotlight />
      <HomeJourney />
    </>
  );
}
