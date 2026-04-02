"use client";
import "./css/Palmares.css";

import React from 'react'
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getSongTitle, getSongUrl } from "@/app/_data/songMetadata";

const getDisplayName = (recording) => {
  const name = recording?.userName?.trim();
  return name || recording?.userId || "Inconnu";
};

const Palmares = ({ topDuels = [] }) => {
    const [playingRecordingId, setPlayingRecordingId] = useState(null);
    const mixRefs = useRef({});

    useEffect(() => {
        const tl = gsap.timeline({});
        const P1 = document.querySelector(".place1");
        const P2 = document.querySelector(".place2");
        const P3 = document.querySelector(".place3");

        tl.to(P1, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 0.7);
        tl.to(P2, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 0.9);
        tl.to(P3, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 1.1);
    }, []);

    useEffect(() => {
        return () => {
            Object.values(mixRefs.current).forEach((mix) => {
                if (!mix) return;
                mix.voice.pause();
                mix.voice.currentTime = 0;
                mix.music.pause();
                mix.music.currentTime = 0;
            });
        };
    }, []);

    const stopMix = (recordingId) => {
        const mix = mixRefs.current[recordingId];
        if (!mix) return;
        mix.voice.pause();
        mix.voice.currentTime = 0;
        mix.music.pause();
        mix.music.currentTime = 0;
    };

    const stopAllMixes = () => {
        Object.keys(mixRefs.current).forEach((id) => {
            stopMix(Number(id));
        });
    };

    const handlePlayClick = async (duel, chanteur) => {
        if (!chanteur?.id || !chanteur?.voiceUrl) return;
        const songUrl = getSongUrl(duel.songChoice);

        if (playingRecordingId === chanteur.id) {
            stopMix(chanteur.id);
            setPlayingRecordingId(null);
            return;
        }

        stopAllMixes();

        if (!mixRefs.current[chanteur.id]) {
            const voice = new Audio();
            const music = new Audio();
            music.preload = "none";
            voice.preload = "none";
            music.volume = 0.75;
            voice.volume = 1;
            mixRefs.current[chanteur.id] = { voice, music };
        }

        const currentMix = mixRefs.current[chanteur.id];
        currentMix.voice.src = chanteur.voiceUrl;
        currentMix.voice.currentTime = 0;

        if (songUrl) {
            currentMix.music.src = songUrl;
            currentMix.music.currentTime = 0;
        }

        const clearIfCurrent = () => {
            setPlayingRecordingId((current) => (current === chanteur.id ? null : current));
            stopMix(chanteur.id);
        };

        currentMix.voice.onended = clearIfCurrent;
        currentMix.music.onended = clearIfCurrent;

        try {
            if (songUrl) {
                await Promise.all([currentMix.music.play(), currentMix.voice.play()]);
            } else {
                await currentMix.voice.play();
            }
            setPlayingRecordingId(chanteur.id);
        } catch (error) {
            console.error("Lecture audio impossible:", error);
        }
    };

    const duel1 = topDuels[0] ?? null;
    const duel2 = topDuels[1] ?? null;
    const duel3 = topDuels[2] ?? null;

    return (
        <div className="palmares">
            <div className="place2">
                <img className="etoile2" src="/Images/png/etoile_2.png" alt="etoile" />
                <div>
                    <h2>{duel2 ? getSongTitle(duel2.songChoice) : "—"}</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>{duel2 ? getDisplayName(duel2.premierChanteur) : "—"}</p>
                            <div className="actions_palmares">
                                <p className="likes_palmares">{duel2 && <>{duel2.premierChanteur?.nbLikes ?? 0} <img className="coeur_palmares" src="/Images/svg/coeur.svg" alt="coeur" /></>}</p>
                                <button
                                    className="btn_play_palmares"
                                    type="button"
                                    onClick={() => handlePlayClick(duel2, duel2?.premierChanteur)}
                                    disabled={!duel2?.premierChanteur?.voiceUrl}
                                    aria-label={playingRecordingId === duel2?.premierChanteur?.id ? "Arreter l'enregistrement" : "Lire l'enregistrement"}
                                >
                                    <img
                                        className="play_palmares"
                                        src={playingRecordingId === duel2?.premierChanteur?.id ? "/Images/svg/pause_2.svg" : "/Images/svg/Play_2.svg"}
                                        alt={playingRecordingId === duel2?.premierChanteur?.id ? "Icon pause" : "Icon play"}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="separe"></div>
                        <div className="info_palmares">
                            <p>{duel2 ? getDisplayName(duel2.deuxiemeChanteur) : "—"}</p>
                            <div className="actions_palmares">
                                <p className="likes_palmares">{duel2 && <>{duel2.deuxiemeChanteur?.nbLikes ?? 0} <img className="coeur_palmares" src="/Images/svg/coeur.svg" alt="coeur" /></>}</p>
                                <button
                                    className="btn_play_palmares"
                                    type="button"
                                    onClick={() => handlePlayClick(duel2, duel2?.deuxiemeChanteur)}
                                    disabled={!duel2?.deuxiemeChanteur?.voiceUrl}
                                    aria-label={playingRecordingId === duel2?.deuxiemeChanteur?.id ? "Arreter l'enregistrement" : "Lire l'enregistrement"}
                                >
                                    <img
                                        className="play_palmares"
                                        src={playingRecordingId === duel2?.deuxiemeChanteur?.id ? "/Images/svg/pause_2.svg" : "/Images/svg/Play_2.svg"}
                                        alt={playingRecordingId === duel2?.deuxiemeChanteur?.id ? "Icon pause" : "Icon play"}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="place1">
                <img className="etoile1" src="/Images/png/etoile_1.png" alt="etoile" />
                <div>
                    <h2>{duel1 ? getSongTitle(duel1.songChoice) : "—"}</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>{duel1 ? getDisplayName(duel1.premierChanteur) : "—"}</p>
                            <div className="actions_palmares">
                                <p className="likes_palmares">{duel1 && <>{duel1.premierChanteur?.nbLikes ?? 0} <img className="coeur_palmares" src="/Images/svg/coeur.svg" alt="coeur" /></>}</p>
                                <button
                                    className="btn_play_palmares"
                                    type="button"
                                    onClick={() => handlePlayClick(duel1, duel1?.premierChanteur)}
                                    disabled={!duel1?.premierChanteur?.voiceUrl}
                                    aria-label={playingRecordingId === duel1?.premierChanteur?.id ? "Arreter l'enregistrement" : "Lire l'enregistrement"}
                                >
                                    <img
                                        className="play_palmares"
                                        src={playingRecordingId === duel1?.premierChanteur?.id ? "/Images/svg/pause_1.svg" : "/Images/svg/play_1.svg"}
                                        alt={playingRecordingId === duel1?.premierChanteur?.id ? "Icon pause" : "Icon play"}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="separe"></div>
                        <div className="info_palmares">
                            <p>{duel1 ? getDisplayName(duel1.deuxiemeChanteur) : "—"}</p>
                            <div className="actions_palmares">
                                <p className="likes_palmares">{duel1 && <>{duel1.deuxiemeChanteur?.nbLikes ?? 0} <img className="coeur_palmares" src="/Images/svg/coeur.svg" alt="coeur" /></>}</p>
                                <button
                                    className="btn_play_palmares"
                                    type="button"
                                    onClick={() => handlePlayClick(duel1, duel1?.deuxiemeChanteur)}
                                    disabled={!duel1?.deuxiemeChanteur?.voiceUrl}
                                    aria-label={playingRecordingId === duel1?.deuxiemeChanteur?.id ? "Arreter l'enregistrement" : "Lire l'enregistrement"}
                                >
                                    <img
                                        className="play_palmares"
                                        src={playingRecordingId === duel1?.deuxiemeChanteur?.id ? "/Images/svg/pause_1.svg" : "/Images/svg/play_1.svg"}
                                        alt={playingRecordingId === duel1?.deuxiemeChanteur?.id ? "Icon pause" : "Icon play"}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="place3">
                <img className="etoile3" src="/Images/png/etoile_3.png" alt="etoile" />
                <div>
                    <h2>{duel3 ? getSongTitle(duel3.songChoice) : "—"}</h2>
                    <div className="info">
                        <div className="info_palmares">
                            <p>{duel3 ? getDisplayName(duel3.premierChanteur) : "—"}</p>
                            <div className="actions_palmares">
                                <p className="likes_palmares">{duel3 && <>{duel3.premierChanteur?.nbLikes ?? 0} <img className="coeur_palmares" src="/Images/svg/coeur.svg" alt="coeur" /></>}</p>
                                <button
                                    className="btn_play_palmares"
                                    type="button"
                                    onClick={() => handlePlayClick(duel3, duel3?.premierChanteur)}
                                    disabled={!duel3?.premierChanteur?.voiceUrl}
                                    aria-label={playingRecordingId === duel3?.premierChanteur?.id ? "Arreter l'enregistrement" : "Lire l'enregistrement"}
                                >
                                    <img
                                        className="play_palmares"
                                        src={playingRecordingId === duel3?.premierChanteur?.id ? "/Images/svg/pause_3.svg" : "/Images/svg/play_3.svg"}
                                        alt={playingRecordingId === duel3?.premierChanteur?.id ? "Icon pause" : "Icon play"}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="separe"></div>
                        <div className="info_palmares">
                            <p>{duel3 ? getDisplayName(duel3.deuxiemeChanteur) : "—"}</p>
                            <div className="actions_palmares">
                                <p className="likes_palmares">{duel3 && <>{duel3.deuxiemeChanteur?.nbLikes ?? 0} <img className="coeur_palmares" src="/Images/svg/coeur.svg" alt="coeur" /></>}</p>
                                <button
                                    className="btn_play_palmares"
                                    type="button"
                                    onClick={() => handlePlayClick(duel3, duel3?.deuxiemeChanteur)}
                                    disabled={!duel3?.deuxiemeChanteur?.voiceUrl}
                                    aria-label={playingRecordingId === duel3?.deuxiemeChanteur?.id ? "Arreter l'enregistrement" : "Lire l'enregistrement"}
                                >
                                    <img
                                        className="play_palmares"
                                        src={playingRecordingId === duel3?.deuxiemeChanteur?.id ? "/Images/svg/pause_3.svg" : "/Images/svg/play_3.svg"}
                                        alt={playingRecordingId === duel3?.deuxiemeChanteur?.id ? "Icon pause" : "Icon play"}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Palmares;