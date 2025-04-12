import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import Email from "../components/Email";
import Slider from "../components/Slider";
import Banners from "../components/Banners";

export function sectionRenderer(section: any, index: number) {
  switch (section.__component) {
    case "sections.hero":
      return <Hero key={index} data={section} />;
    case "sections.pricing":
      return <Pricing key={index} data={section} />;
    case "sections.lead-form":
      return <Email key={index} data={section} />;
    case "sections.slider":
      return <Slider key={index} data={section} />;
    case "sections.banners":
      return <Banners key={index} data={section} />;
    default:
      return null;
  }
}
