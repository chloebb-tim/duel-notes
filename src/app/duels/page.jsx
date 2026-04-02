import ListeDuels from "../_components/ListeDuels";
import Header from "@/app/_components/Header";

export const dynamic = 'force-dynamic';

const PageDuels = async () => {
  return (
    <div>
      <Header />
      <ListeDuels />
    </div>
  )
};
export default PageDuels;
