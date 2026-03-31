import "./css/Palmares.css";

const Palmares = ({ }) => {
    return (
        <div className="palmares">
            <div className="place2">
                {/* <img className="etoile2" src="/Images/png/etoile_2.png" alt="etoile" /> */}
                <div>
                    <h2>Nom du chanteur</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>Chansons</p>
                            <p>Nb likes</p>
                        </div>
                        <div className="ligne"></div>
                        <img src="/Images/svg/play_2.svg" alt="icon_Play" />
                    </div>
                </div>
            </div>
            <div className="place1">
                {/* <img className="etoile1" src="/Images/png/etoile_1.png" alt="etoile" /> */}
                <div>
                    <h2>Nom du chanteur</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>Chansons</p>
                            <p>Nb likes</p>
                        </div>
                        <div className="ligne"></div>
                        <img src="/Images/svg/play_1.svg" alt="icon_Play" />
                    </div>
                </div>
            </div>
            <div className="place3">
                {/* <img className="etoile3" src="/Images/png/etoile_3.png" alt="etoile" /> */}
                <div>
                    <h2>Nom du chanteur</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>Chansons</p>
                            <p>Nb likes</p>
                        </div>
                        <div className="ligne"></div>
                        <img src="/Images/svg/play_3.svg" alt="icon_Play" />
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Palmares;