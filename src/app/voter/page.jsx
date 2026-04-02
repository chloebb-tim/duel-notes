import DuelsVoter from "../_components/DuelsVoter";
import Header from "@/app/_components/Header";

export const dynamic = 'force-dynamic';

const PageVote = async () => {
  return (
    <div>
      <Header />
      <DuelsVoter />
    </div>
  )
};
export default PageVote;
