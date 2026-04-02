import Link from "next/link";

import "./css/ListeDuels.css";
import "./css/Bouton.css";
import { getDuelsIncomplets } from "../_data/data_recording";


const ListeDuels = async () => {
  const duels = await getDuelsIncomplets();
  return (
    <div className="PageDuels">
      <Link href="/record" className="btn inline">
        Nouveau duel
      </Link>

      <div className="gridDuels">
        {duels.map((duel) => (
          <div className="listeDuels" key={duel.id}>
            <h1>{duel.songChoice ?? "Chanson inconnue"}</h1>

            <div className="infoChanteur">
              <img className="play" src="/Images/svg/play_bleu.svg" alt="Play" />
              <img className="venyl" src="/Images/svg/venyl.svg" alt="Venyl" />

              <div>
                <p>Duel #{duel.id}</p>
                <p>En attente du 2e chanteur</p>
              </div>

              <div className="ligne"></div>

              <Link href={`/join?duelId=${duel.id}`} className="btn">
                Faire ce duel
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeDuels;