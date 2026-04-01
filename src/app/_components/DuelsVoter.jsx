import Link from "next/link";

import "./css/DuelsVoter.css";
import "./css/Bouton.css";

const DuelsVoter = ({ }) => {
    return (
        <div className="PageVoter">

            <span className="filtre">
                <details>
                    <summary className="btn">Filtre</summary>

                    <div className="menuFiltre">
                        <Link href="/">
                            <p>Plus Populaire</p>
                        </Link>
                        <div className="separateur"></div>
                        <Link href="/">
                            <p>Plus Récents</p>
                        </Link>
                    </div>
                </details>
            </span>

            <div className="gridVote">
                <div className="listeVote">
                    <h1>Titre de la chansons</h1>
                    <div className="duelsVote">
                        <div className="infoChanteur">
                            <img className="play" src="/Images/svg/play_bleu.svg" alt="Icon d'un play" />
                            <img className="venyl" src="/Images/svg/venyl.svg" alt="Icon d'un Venyl" />
                            <div>
                                <p>Date</p>
                                <p>Nom du chanteur 01</p>
                                <div className="like">
                                    <img className="coeur" src="/Images/svg/coeur.svg" alt="Icon Coeur" />
                                    <p>Nb likes</p>
                                </div>
                            </div>
                            <div className="ligne"></div>
                        </div>
                        <div className="infoChanteur">
                            <img className="play" src="/Images/svg/play_bleu.svg" alt="Icon d'un play" />
                            <img className="venyl" src="/Images/svg/venyl.svg" alt="Icon d'un Venyl" />
                            <div>
                                <p>Date</p>
                                <p>Nom du chanteur 02</p>
                                <div className="like">
                                    <img className="coeur" src="/Images/svg/coeur.svg" alt="Icon Coeur" />
                                    <p>Nb likes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DuelsVoter;