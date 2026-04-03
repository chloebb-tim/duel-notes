"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { voterAction } from "@/app/_actions/recording";
import { toast } from "react-toastify";
import { getSongTitle, getSongUrl } from "@/app/_data/songMetadata";

const MIX_SYNC_OFFSET_MS = 200;

const getDisplayName = (recording) => {
    const name = recording?.userName?.trim();
    return name || recording?.userId || "Inconnu";
};
const getDisplayDateTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const getPlaybackKey = (duelId, recordingId) => `${duelId}:${recordingId}`;

const DuelCard = ({ duel, monVoteInitial, activePlaybackKey, setActivePlaybackKey }) => {
    const [voteActuel, setVoteActuel] = useState(monVoteInitial ?? null);
    const [playingRecordingId, setPlayingRecordingId] = useState(null);
    const [likes, setLikes] = useState({
        [duel.premierChanteur?.id]: duel.premierChanteur?.nbLikes ?? 0,
        [duel.deuxiemeChanteur?.id]: duel.deuxiemeChanteur?.nbLikes ?? 0,
    });
    const [isPending, startTransition] = useTransition();
    const mixRefs = useRef({});

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

    useEffect(() => {
        if (playingRecordingId === null) return;

        const localKey = getPlaybackKey(duel.id, playingRecordingId);
        if (activePlaybackKey && activePlaybackKey === localKey) return;

        stopAllMixes();
        setPlayingRecordingId(null);
    }, [activePlaybackKey, playingRecordingId, duel.id]);

    const stopMix = (recordingId) => {
        const mix = mixRefs.current[recordingId];
        if (!mix) return;
        if (mix.musicStartTimeoutId) {
            window.clearTimeout(mix.musicStartTimeoutId);
            mix.musicStartTimeoutId = null;
        }
        mix.voice.onended = null;
        mix.music.onended = null;
        mix.voice.pause();
        mix.voice.currentTime = 0;
        mix.voice.removeAttribute("src");
        mix.voice.load();
        mix.music.pause();
        mix.music.currentTime = 0;
        mix.music.removeAttribute("src");
        mix.music.load();
    };

    const stopAllMixes = () => {
        Object.keys(mixRefs.current).forEach((id) => {
            stopMix(Number(id));
        });
    };

    const handlePlayClick = async (chanteur) => {
        if (!chanteur?.id || !chanteur?.voiceUrl) return;
        const songUrl = getSongUrl(duel.songChoice);

        if (playingRecordingId === chanteur.id) {
            stopMix(chanteur.id);
            setPlayingRecordingId(null);
            setActivePlaybackKey(null);
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
            mixRefs.current[chanteur.id] = { voice, music, musicStartTimeoutId: null };
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
            setActivePlaybackKey((current) => {
                const currentKey = getPlaybackKey(duel.id, chanteur.id);
                return current === currentKey ? null : current;
            });
            stopMix(chanteur.id);
        };

        currentMix.voice.onended = clearIfCurrent;
        currentMix.music.onended = clearIfCurrent;

        try {
            if (songUrl) {
                await currentMix.voice.play();
                currentMix.musicStartTimeoutId = window.setTimeout(async () => {
                    try {
                        await currentMix.music.play();
                    } catch (error) {
                        console.error("Lecture musique impossible:", error);
                    }
                }, MIX_SYNC_OFFSET_MS);
            } else {
                await currentMix.voice.play();
            }
            setPlayingRecordingId(chanteur.id);
            setActivePlaybackKey(getPlaybackKey(duel.id, chanteur.id));
        } catch (error) {
            console.error("Lecture audio impossible:", error);
        }
    };

    const handleVote = (enregistrementId) => {
        if (voteActuel === enregistrementId || isPending) return;

        startTransition(async () => {
            const res = await voterAction(enregistrementId, duel.id);
            if (res.success) {
                setLikes((prev) => {
                    const next = { ...prev };
                    if (res.changed && voteActuel !== null) {
                        next[voteActuel] = (next[voteActuel] ?? 1) - 1;
                    }
                    next[enregistrementId] = (next[enregistrementId] ?? 0) + 1;
                    return next;
                });
                setVoteActuel(enregistrementId);
            }
        });
    };

    const handleReport = (event) => {
        const detailsElement = event.currentTarget.closest("details");
        if (detailsElement) {
            detailsElement.open = false;
        }
        toast.info(`Signalement recu. L'équipe de modération va évaluer la situation.`);
    };

    const renderChanteur = (chanteur) => {
        if (!chanteur) return null;
        const id = chanteur.id;
        const dejaVotePourCelui = voteActuel === id;
        const dejaVotePourAutre = voteActuel !== null && voteActuel !== id;

        return (
            <div className="infoChanteur">
                <button
                    className={`playButton ${playingRecordingId === id ? "playButtonActif" : ""}`}
                    onClick={() => handlePlayClick(chanteur)}
                    disabled={!chanteur.voiceUrl}
                    aria-label={playingRecordingId === id ? "Arreter l'enregistrement" : "Lire l'enregistrement"}
                    type="button"
                >
                    <img
                        className="play"
                        src={playingRecordingId === id ? "/Images/svg/pause_bleu.svg" : "/Images/svg/play_bleu.svg"}
                        alt={playingRecordingId === id ? "Icon pause" : "Icon play"}
                    />
                </button>
                <img className="venyl" src="/Images/svg/venyl.svg" alt="Icon d'un Venyl" />
                <div className="information">
                    <details className="menuSignalement">
                        <summary aria-label="Options du recording">...</summary>
                        <button
                            type="button"
                            className="btnSignaler"
                            onClick={handleReport}
                        >
                            Signaler
                        </button>
                    </details>
                    <p className="nomChanteur">{getDisplayName(chanteur)}</p>
                    <p className="dateEnregistrement">
                        {getDisplayDateTime(chanteur.createdAt)}
                    </p>
                    <button
                        className={`boutonVote ${dejaVotePourCelui ? "vote-actif" : ""} ${dejaVotePourAutre ? "vote-desactive" : ""}`}
                        onClick={() => handleVote(id)}
                        disabled={isPending}
                        aria-label="Voter"
                    >
                        <img className="coeur" src="/Images/svg/coeur.svg" alt="Icon Coeur" />
                        <p>{likes[id] ?? 0}</p>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="listeVote">
            <div className="titreChanson">
                <h2>{getSongTitle(duel.songChoice)}</h2>
            </div>
            <div className="duelsVote">
                {renderChanteur(duel.premierChanteur)}
                <div className="ligne"></div>
                {renderChanteur(duel.deuxiemeChanteur)}
            </div>
        </div>
    );
};

export default DuelCard;
