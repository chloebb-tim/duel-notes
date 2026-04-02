import "./css/DuelsVoter.css";
import "./css/ListeDuels.css";
import "./css/Bouton.css";
import { Suspense } from "react";
import { getDuelsIncomplets } from "../_data/data_recording";
import ListeDuelsClient from "./ListeDuelsClient";


const ListeDuels = async () => {
  const duels = await getDuelsIncomplets();
  return (
    <div className="PageVoter PageDuels">
      <Suspense fallback={<div>Chargement...</div>}>
        <ListeDuelsClient duels={duels} />
      </Suspense>
    </div>
  );
};

export default ListeDuels;