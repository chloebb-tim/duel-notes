"use client";
import "./css/Hero.css";

import React from 'react'
import { useEffect } from "react";
import { gsap } from "gsap";

const Hero = ({ }) => {

    useEffect(() => {
        const tl = gsap.timeline({});
        const alexandrin = document.querySelector(".alexandrin");

        tl.to(alexandrin, {
            y: 100,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        });
        tl.to(alexandrin, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    }, []);

    return (
        <div className="instructions">
            {/* <div className="hero"> */}
            <div className="textHero">
                <div>
                    <h1 className="titre">Instructions</h1>
                    <div className="alexandrin">
                        <p >
                            C’est une arène féroce, ici la voix fait loi <br />

                            Même musique pour deux, mais chacun sa version,<br />

                            Rejoins le Duel des Notes, chante avec passion<br />

                            Pour réussir à gagner, deux choix s’offrent à toi<br />
                        </p>
                        <br />
                        <p >
                            Trouve un duel qui t’inspire, puis fais-le à ta façon<br />

                            Avec les mêmes paroles posées sur le même son<br />

                            Tu peux aussi lancer ton propre défi vocal<br />

                            Donne le meilleur de toi et attends ton rival<br />

                        </p>
                        <br />
                        <p >
                            Trouve un duel qui t’inspire, puis fais-le à ta façon<br />

                            Avec les mêmes paroles posées sur le même son<br />

                            Tu peux aussi lancer ton propre défi vocal<br />

                            Donne le meilleur de toi et attends ton rival<br />
                        </p>
                    </div>
                </div>
{/* 
                <div className="btnVoirDuels ">
                    <button className="btn" onClick={() => window.location.href = "/duels"}>Voir les duels</button>
                    <img className="cle" src="/Images/svg/CleDeSol.svg" alt="Clé de sol" />
                </div> */}
            </div>
            {/* </div> */}

        </div>
    )
}

export default Hero;