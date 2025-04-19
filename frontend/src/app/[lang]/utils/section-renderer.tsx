import Hero from "../components/Hero";
import Slider from "../components/Slider";
import Banners from "../components/Banners";
import Heading from "../components/Heading";
import FeaturedProducts from "../components/FeaturedProducts";

export function sectionRenderer(section: any, index: number) {
  switch (section.__component) {
    case "sections.hero":
      return <Hero key={index} data={section} />;
    case "sections.slider":
      return <Slider key={index} data={section} />;
    case "sections.banners":
      return <Banners key={index} data={section} />;
    case "sections.heading":
      return <Heading key={index} data={section} />;
    case "sections.featured-products":
      return <FeaturedProducts key={index} data={section} />;
    default:
      return null;
  }
}
