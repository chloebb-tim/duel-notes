
import Palmares from "@/app/_components/Palmares"
import Hero from "../_components/Hero";
import Header from "@/app/_components/Header";
import { getTopDuelsPalmares } from "@/app/_data/data_recording";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Duel de Notes",
  description: "Gagne des duels musicaux",
};

const PagePalmares = async () => {
  const topDuels = await getTopDuelsPalmares();
  return (
    <div>
      <Header />
      <Hero></Hero>
      <Palmares topDuels={topDuels} />
    </div>
  );
};
export default PagePalmares;
