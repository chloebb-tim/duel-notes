import Link from "next/link";

import "./css/DuelsVoter.css";
import "./css/Bouton.css";

import { getDuelscomplets } from "@/app/_data/data_recording";

const getDisplayName = (recording) => {
    const name = recording?.userName?.trim();
    return name || recording?.userId || "Inconnu";
};

const DuelsVoter = async () => {
    const duels = await getDuelscomplets();

    return (
        <div className="PageVoter">
            <div className="filtre">
                <details>
                    <summary className="btn">Filtre</summary>
                    <div className="menuFiltre">
                        <Link href="/"><p>Plus Populaire</p></Link>
                        <div className="separateur"></div>
                        <Link href="/"><p>Plus Récents</p></Link>
                    </div>
                </details>
            </div>

            <div className="gridVote">
                {duels.map((duel) => (
                    <div className="listeVote" key={duel.id}>
                        <h1>{duel.songChoice ?? "Chanson inconnue"}</h1>
                        <div className="duelsVote">
                            <div className="infoChanteur">
                                <img className="play" src="/Images/svg/play_bleu.svg" alt="Icon d'un play" />
                                <img className="venyl" src="/Images/svg/venyl.svg" alt="Icon d'un Venyl" />
                                <div className="information">
                                    <p>{getDisplayName(duel.premierChanteur)}</p>
                                    <div className="like">
                                        <img className="coeur" src="/Images/svg/coeur.svg" alt="Icon Coeur" />
                                        <p>{duel.premierChanteur?.nbLikes ?? 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ligne"></div>
                            <div className="infoChanteur">
                                <img className="play" src="/Images/svg/play_bleu.svg" alt="Icon d'un play" />
                                <img className="venyl" src="/Images/svg/venyl.svg" alt="Icon d'un Venyl" />
                                <div className="information">
                                    <p>{getDisplayName(duel.deuxiemeChanteur)}</p>
                                    <div className="like">
                                        <img className="coeur" src="/Images/svg/coeur.svg" alt="Icon Coeur" />
                                        <p>{duel.deuxiemeChanteur?.nbLikes ?? 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DuelsVoter;