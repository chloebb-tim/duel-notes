import Link from "next/link";

import "./css/ListeDuels.css";
import "./css/Bouton.css";

const ListeDuels = ({ }) => {
    return (
        <div className="PageDuels">

            <Link href="/">
                <button className="btn">Nouveau Duel</button>
            </Link>

            <div className="gridDuels">
                <div className="listeDuels">
                    <h1>Titre de la chansons</h1>
                    <div className="infoChanteur">
                        <img className="play" src="/Images/svg/play_bleu.svg" alt="Icon d'un play" />
                        <img className="venyl" src="/Images/svg/venyl.svg" alt="Icon d'un Venyl" />
                        <div>
                            <p>Date</p>
                            <p>Nom du chanteur 01</p>
                        </div>
                        <div className="ligne"></div>
                        <button className="btn">Faire ce duel</button>
                    </div>
                </div>
                <div className="listeDuels">
                    <h1>Titre de la chansons</h1>
                    <div className="infoChanteur">
                        <img className="play" src="/Images/svg/play_bleu.svg" alt="Icon d'un play" />
                        <img className="venyl" src="/Images/svg/venyl.svg" alt="Icon d'un Venyl" />
                        <div>
                            <p>Date</p>
                            <p>Nom du chanteur 01</p>
                        </div>
                        <div className="ligne"></div>
                        <button className="btn">Faire ce duel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListeDuels;