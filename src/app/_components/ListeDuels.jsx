import "./css/DuelsVoter.css";
import "./css/ListeDuels.css";
import "./css/Bouton.css";
import { getDuelsIncomplets } from "../_data/data_recording";
import ListeDuelsClient from "./ListeDuelsClient";


const ListeDuels = async () => {
  const duels = await getDuelsIncomplets();
  return (
    <div className="PageVoter PageDuels">
      <ListeDuelsClient duels={duels} />
    </div>
  );
};

export default ListeDuels;