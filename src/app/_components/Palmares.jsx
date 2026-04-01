"use client";
import "./css/Palmares.css";

import React from 'react'
import { useEffect } from "react";
import { gsap } from "gsap";

const Palmares = ({ }) => {

    useEffect(() => {
        const tl = gsap.timeline({});
        const P1 = document.querySelector(".place1");
        const P2 = document.querySelector(".place2");
        const P3 = document.querySelector(".place3");

        tl.to(P1, {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, 1.5);
        tl.to(P2, {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, 2.5);
        tl.to(P3, {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, 3.5);
    }, []);

    return (
        <div className="palmares">
            <div className="place2">
                <img className="etoile2" src="/Images/png/etoile_2.png" alt="etoile" />
                <div>
                    <h2>Nom de la Chansons</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>Nom du chanteur 01</p>
                            <img className="play_palmares" src="/Images/svg/play_2.svg" alt="icon_Play" />
                        </div>
                        <div className="separe"></div>
                        <div className="info_palmares">
                            <p>Nom du chanteur 02</p>
                            <img className="play_palmares" src="/Images/svg/play_2.svg" alt="icon_Play" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="place1">
                <img className="etoile1" src="/Images/png/etoile_1.png" alt="etoile" />
                <div>
                    <h2>Nom de la Chansons</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>Nom du chanteur 01</p>
                            <img className="play_palmares" src="/Images/svg/play_1.svg" alt="icon_Play" />
                        </div>
                        <div className="separe"></div>
                        <div className="info_palmares">
                            <p>Nom du chanteur 02</p>
                            <img className="play_palmares" src="/Images/svg/play_1.svg" alt="icon_Play" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="place3">
                <img className="etoile3" src="/Images/png/etoile_3.png" alt="etoile" />
                <div>
                    <h2>Nom de la Chansons</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>Nom du chanteur 01</p>
                            <img className="play_palmares" src="/Images/svg/play_3.svg" alt="icon_Play" />
                        </div>
                        <div className="separe"></div>
                        <div className="info_palmares">
                            <p>Nom du chanteur 02</p>
                            <img className="play_palmares" src="/Images/svg/play_3.svg" alt="icon_Play" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Palmares;