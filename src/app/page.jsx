import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";


export const metadata = {
  title: "Duel de Notes",
  description: "Gagne des duels musicaux",
};

const PageAccueil = async () => {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/signin");
  }
  
  redirect("/palmares");
};
export default PageAccueil;
