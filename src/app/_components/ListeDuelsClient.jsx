"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { getSongTitle, getSongUrl } from "@/app/_data/songMetadata";
import { gsap } from "gsap";

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

const ListeDuelsClient = ({ duels }) => {
  const [activePlaybackKey, setActivePlaybackKey] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("published") === "1") {
      toast.success("Enregistrement publié avec succès !");
      router.replace("/duels");
    }
  }, [searchParams, router]);

  useEffect(() => {
    const tl = gsap.timeline({});
    const gridVote = document.querySelector(".gridVote");

    tl.to(gridVote, {
      y: 100,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out"
    });
    tl.to(gridVote, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    });
  }, []);


  return (
    <>
      <div className="actionsDuels">
        <Link href="/record" className="btn inline">
          Nouveau duel
        </Link>
      </div>

      <div className="gridVote gridDuels">
        {duels.map((duel) => (
          <DuelIncompletCard
            key={duel.id}
            duel={duel}
            activePlaybackKey={activePlaybackKey}
            setActivePlaybackKey={setActivePlaybackKey}
          />
        ))}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

const DuelIncompletCard = ({ duel, activePlaybackKey, setActivePlaybackKey }) => {
  const [playingRecordingId, setPlayingRecordingId] = useState(null);
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
        await Promise.all([currentMix.music.play(), currentMix.voice.play()]);
      } else {
        await currentMix.voice.play();
      }
      setPlayingRecordingId(chanteur.id);
      setActivePlaybackKey(getPlaybackKey(duel.id, chanteur.id));
    } catch (error) {
      console.error("Lecture audio impossible:", error);
    }
  };

  const handleReport = (event) => {
    const detailsElement = event.currentTarget.closest("details");
    if (detailsElement) {
      detailsElement.open = false;
    }
    toast.info("Signalement reçu. L'équipe de modération va évaluer la situation.");
  };

  const chanteur = duel.premierChanteur;
  const chanteurId = chanteur?.id;
  const isPlaying = chanteurId !== undefined && playingRecordingId === chanteurId;

  return (
    <div className="listeVote listeDuels" key={duel.id}>
      <div className="titreChanson titreDuel">
        <h2>{getSongTitle(duel.songChoice)}</h2>
      </div>

      <div className="duelsVote">
        <div className="infoChanteur">
          <button
            className={`playButton ${isPlaying ? "playButtonActif" : ""}`}
            onClick={() => handlePlayClick(chanteur)}
            disabled={!chanteur?.voiceUrl}
            aria-label={isPlaying ? "Arreter l'enregistrement" : "Lire l'enregistrement"}
            type="button"
          >
            <img
              className="play"
              src={isPlaying ? "/Images/svg/pause_bleu.svg" : "/Images/svg/play_bleu.svg"}
              alt={isPlaying ? "Icon pause" : "Icon play"}
            />
          </button>
          <img className="venyl" src="/Images/svg/venyl.svg" alt="Venyl" />

          <div className="information infoEtatDuel">
            <details className="menuSignalement">
              <summary aria-label="Options du recording">...</summary>
              <button type="button" className="btnSignaler" onClick={handleReport}>
                Signaler
              </button>
            </details>
            <p className="nomChanteur">{getDisplayName(chanteur)}</p>
            <p className="dateEnregistrement">{getDisplayDateTime(chanteur?.createdAt)}</p>
          </div>
        </div>

        <div className="ligne"></div>

        <div className="infoChanteur infoAction">
          <Link href={`/join?duelId=${duel.id}`} className="btn">
            Faire ce duel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListeDuelsClient;
