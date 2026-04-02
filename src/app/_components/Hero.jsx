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
            <div className="textHero">
                <div>
                    <h1 className="titre">Instructions</h1>
                    <div className="alexandrin">
                        <p >
                            C’est le Duel des Notes, exprime toute ta passion <br />

                            La même musique pour deux, mais chacun sa version<br />

                            C’est une arène féroce, ici la voix fait loi<br />

                            Pour avoir la victoire, deux options s’offrent à toi<br />
                        </p>
                        <br />
                        <p >
                            Trouve un duel qui t’inspire, fais-le à ta façon<br />

                            Avec les mêmes paroles, posées sur le même son<br />

                            Tu peux aussi lancer ton propre défi vocal<br />

                            Donne le meilleur de toi et attends ton rival<br />

                        </p>
                        <br />
                        <p >
                            Quand tu as terminé, n’oublie pas de voter<br />

                            Les duels les plus aimés sont toujours affichés<br />

                            Pour chaque duel écouté, choisis la meilleure voix<br />

                            Ça peut être difficile, car tu n’as qu’un seul choix<br />
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Hero;