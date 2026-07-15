import { HomeCarousel } from "@/components/home/HomeCarousel";
import { HomeAppDownload } from "@/components/home/HomeAppDownload";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBenefits } from "@/components/home/HomeBenefits";
import { HomeCardSpotlight } from "@/components/home/HomeCardSpotlight";
import { HomeJourney } from "@/components/home/HomeJourney";
import { HomeCadastro } from "@/components/home/HomeCadastro";

export default function HomePage() {
  return (
    <>
      <HomeCarousel />
      <HomeAppDownload />
      <HomeBenefits />
      <HomeCardSpotlight />
      <HomeJourney />
      <HomeHero />
      <HomeCadastro />
    </>
  );
}
