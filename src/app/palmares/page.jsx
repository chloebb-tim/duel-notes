
import Palmares from "@/app/_components/Palmares"
import Hero from "../_components/Hero";
import Header from "@/app/_components/Header";

export const metadata = {
  title: "Duel de Notes",
  description: "Gagne des duels musicaux",
};

const PagePalmares = async () => {
 // const histoiresRecentes = await getRecentStories();
  return (
    <div>
      <Header />
      <Hero></Hero>
      <Palmares></Palmares>
    </div>
  );
};
export default PagePalmares;
