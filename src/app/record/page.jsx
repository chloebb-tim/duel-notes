//to do:
// - stop mix when recording again
//- enleve boutons quand on enregistre? looks weird rn. ou les garder mais disabled? that would be prettier?
"use client";

import "./record.css";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { SONGS, SONG_GROUPS, getSongUrl } from "@/app/_data/songMetadata";

import Header from "@/app/_components/Header";

const PageRecord = () => {
  const router = useRouter();
  const RETARD_GOSSANT_ESTI = 200;
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [songChoice, setSongChoice] = useState("chanson1_v1");
  const [isUploading, setIsUploading] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMixPlaying, setIsMixPlaying] = useState(false);
  const [isSongPreviewPlaying, setIsSongPreviewPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const musicRef = useRef(null);
  const audioContextRef = useRef(null);
  const musicElementRef = useRef(null);
  const musicSourceRef = useRef(null);
  const micStreamRef = useRef(null);
  const mixContextRef = useRef(null);
  const mixSourcesRef = useRef({ music: null, voice: null });
  const [countdown, setCountdown] = useState(null);
  const [step, setStep] = useState("choose");
  const [previewingCard, setPreviewingCard] = useState(null);
  const currentSong = SONGS[songChoice];

  const runCountdown = async () => {
    setCountdown(3);
    await new Promise((r) => setTimeout(r, 1000));

    setCountdown(2);
    await new Promise((r) => setTimeout(r, 1000));

    setCountdown(1);
    await new Promise((r) => setTimeout(r, 1000));

    setCountdown("Chante!");
    await new Promise((r) => setTimeout(r, 500));

    setCountdown(null);
  };

  //yayyy no more cut au début!!!
  const warmUpAudioOutput = async (audioContext, duration = 3500) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    gain.gain.value = 0.00001;
    oscillator.frequency.value = 440;

    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();

    await new Promise((resolve) => setTimeout(resolve, duration));

    oscillator.stop();
    oscillator.disconnect();
    gain.disconnect();
  };

  const stopMixPlayback = async () => {
    const { music, voice } = mixSourcesRef.current;

    if (music) {
      try {
        music.stop();
      } catch { }
      music.disconnect();
    }

    if (voice) {
      try {
        voice.stop();
      } catch { }
      voice.disconnect();
    }

    mixSourcesRef.current = { music: null, voice: null };

    if (mixContextRef.current) {
      await mixContextRef.current.close().catch(() => { });
      mixContextRef.current = null;
    }

    setIsMixPlaying(false);
  };

  const handleToggleSongPreview = async () => {
    if (!musicRef.current) return;

    const musicAudio = musicRef.current;
    if (isSongPreviewPlaying) {
      musicAudio.pause();
      setIsSongPreviewPlaying(false);
      return;
    }

    musicAudio.src = getSongUrl(songChoice);
    musicAudio.currentTime = 0;
    musicAudio.onended = () => setIsSongPreviewPlaying(false);

    try {
      await musicAudio.play();
      setIsSongPreviewPlaying(true);
    } catch (error) {
      console.error("Unable to play song preview:", error);
    }
  };

  const startRecording = async () => {
    if (isSongPreviewPlaying && musicRef.current) {
      musicRef.current.pause();
      setIsSongPreviewPlaying(false);
    }

    if (isMixPlaying) {
      await stopMixPlayback();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
    });

    micStreamRef.current = stream;

    const track = stream.getAudioTracks()[0];
    console.log("Mic settings:", track.getSettings());

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current = mediaRecorder;

    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, {
        type: mediaRecorder.mimeType || "audio/webm",
      });

      setAudioBlob(blob);

      const audioURL = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.src = audioURL;

      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }

      if (musicElementRef.current) {
        musicElementRef.current.pause();
        musicElementRef.current.src = "";
        musicElementRef.current = null;
      }

      if (musicSourceRef.current) {
        musicSourceRef.current.disconnect();
        musicSourceRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => { });
        audioContextRef.current = null;
      }

      setIsMusicPlaying(false);
    };

    const musicUrl = getSongUrl(songChoice);

    const audioContext = new window.AudioContext();
    audioContextRef.current = audioContext;

    const musicEl = new Audio(musicUrl);
    musicEl.preload = "auto";
    musicEl.crossOrigin = "anonymous";
    musicElementRef.current = musicEl;

    const source = audioContext.createMediaElementSource(musicEl);
    musicSourceRef.current = source;

    const musicGain = audioContext.createGain();
    musicGain.gain.value = 1.0;

    source.connect(musicGain).connect(audioContext.destination);

    await audioContext.resume();

    await Promise.all([warmUpAudioOutput(audioContext, 3500), runCountdown()]);

    musicEl.currentTime = 0;

    mediaRecorder.start();
    setIsRecording(true);

    await musicEl.play();
    setIsMusicPlaying(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (musicElementRef.current) {
      musicElementRef.current.pause();
      musicElementRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const hiddenInputRef = useRef(null);
  const uploadButtonRef = useRef(null);

  const handlePlayMix = async () => {
    if (!audioBlob) return;

    await stopMixPlayback();

    const songUrl = getSongUrl(songChoice);
    const mixContext = new window.AudioContext();
    mixContextRef.current = mixContext;

    try {
      const [songArrayBuffer, voiceArrayBuffer] = await Promise.all([
        fetch(songUrl).then((res) => res.arrayBuffer()),
        audioBlob.arrayBuffer(),
      ]);

      const [songBuffer, voiceBuffer] = await Promise.all([
        mixContext.decodeAudioData(songArrayBuffer.slice(0)),
        mixContext.decodeAudioData(voiceArrayBuffer.slice(0)),
      ]);

      const songSource = mixContext.createBufferSource();
      songSource.buffer = songBuffer;
      const voiceSource = mixContext.createBufferSource();
      voiceSource.buffer = voiceBuffer;

      const songGain = mixContext.createGain();
      songGain.gain.value = 0.75;
      const voiceGain = mixContext.createGain();
      voiceGain.gain.value = 1;

      songSource.connect(songGain).connect(mixContext.destination);
      voiceSource.connect(voiceGain).connect(mixContext.destination);

      mixSourcesRef.current = { music: songSource, voice: voiceSource };

      songSource.onended = () => {
        if (mixContextRef.current === mixContext) {
          stopMixPlayback();
        }
      };
      voiceSource.onended = () => {
        if (mixContextRef.current === mixContext) {
          stopMixPlayback();
        }
      };

      await mixContext.resume();
      const startAt = mixContext.currentTime + 0.05;
      songSource.start(startAt + RETARD_GOSSANT_ESTI / 1000);
      voiceSource.start(startAt);

      setIsMixPlaying(true);
    } catch (error) {
      console.error("Unable to play synchronized mix:", error);
      await stopMixPlayback();
    }
  };

  const handleStopMix = () => {
    stopMixPlayback();
  };

  const handlePublish = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      const file = new File([audioBlob], `recording-${Date.now()}.wav`, {
        type: "audio/wav",
      });

      const formData = new FormData();
      formData.append("files", file);

      console.log("on essaie de upload!!!!");
      const uploadResponse = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      console.log(uploadResponse.status);

      // if (!uploadResponse.ok) {
      //   const errorData = await uploadResponse.text();
      //   console.error("Upload error:", errorData);
      //   throw new Error(`Upload failed with status ${uploadResponse.status}`);
      // }

      const uploadedFiles = await uploadResponse.json();
      console.log(uploadedFiles);

      const { url, key } = uploadedFiles[0];

      console.log("Saving");
      const dbResponse = await fetch("/api/recordings", {
        method: "POST",
        body: JSON.stringify({
          songChoice,
          voiceUrl: url,
          voiceUploadthingKey: key,
          // pas de duelId: crée toujours un nouveau duel
        }),
        headers: { "Content-Type": "application/json" },
      });

      console.log("Database response status:", dbResponse.status);

      if (dbResponse.ok) {
        router.push("/duels?published=1");
        setAudioBlob(null);
        if (audioRef.current) {
          audioRef.current.src = "";
        }
      } else {
        const errorData = await dbResponse.json();
        throw new Error(errorData.error || "Failed to save recording");
      }
    } catch (error) {
      console.error("Error publishing recording:", error);
      toast.error("Erreur : " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreviewCard = (song) => {
    if (!musicRef.current) return;
    if (previewingCard === song) {
      musicRef.current.pause();
      setPreviewingCard(null);
      return;
    }
    musicRef.current.src = getSongUrl(song);
    musicRef.current.currentTime = 0;
    musicRef.current.play().catch(() => { });
    setPreviewingCard(song);
  };

  const handleChooseSong = (song) => {
    if (musicRef.current) musicRef.current.pause();
    setPreviewingCard(null);
    setSongChoice(song);
    setStep("record");
  };

  if (step === "choose") {
    return (
      <>
        <Header />
        <div className="record-choose-page">
          <audio ref={musicRef} preload="auto" hidden />
          <h1 className="choose-title">Choisis une chanson</h1>
          <div className="song-cards">
            {SONG_GROUPS.map((group) => (
              <div key={group.key} className="song-card">
                <h2 className="song-card-title">{group.title}</h2>
                <div className="contenuChoose">
                <div className="song-versions">
                  {group.versions.map((vkey, i) => (
                    <div key={vkey} className="song-version-row">
                      <span className="song-version-label">Version {i + 1}</span>
                      <button
                        type="button"
                        className={`song-card-preview-btn small${previewingCard === vkey ? " previewing" : ""}`}
                        onClick={() => handlePreviewCard(vkey)}
                        aria-label={previewingCard === vkey ? "Pause" : "Écouter"}
                      >
                        <span className="material-icons">
                          {previewingCard === vkey ? "pause" : "play_arrow"}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="song-version-choose-btn"
                        onClick={() => handleChooseSong(vkey)}
                      >
                        Choisir
                      </button>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="record-page">
        <section className="record-main">
          <div className="record-left">
            <div className="mic-stage">
              {countdown && <div className="countdown-overlay">{countdown}</div>}

              <button
                className={`mic-toggle ${isRecording ? "recording" : ""}`}
                id="micr"
                onClick={handleButtonClick}
                disabled={countdown !== null}
              >
                <span className="material-icons">
                  {isRecording ? "stop" : "mic"}
                </span>
              </button>
            </div>

            <audio ref={audioRef} hidden />
            <audio ref={musicRef} preload="auto" hidden />

            <div className="record-actions">
              {audioBlob && !isRecording && (
                <button
                  className="publish-button"
                  type="button"
                  onClick={isMixPlaying ? handleStopMix : handlePlayMix}
                >
                  Écoute ta version
                </button>
              )}

              {audioBlob && !isRecording && (
                <button
                  className="publish-button"
                  type="button"
                  onClick={handlePublish}
                  disabled={isUploading}
                >
                  Publier
                </button>
              )}
            </div>
          </div>

          <div className="record-right">
            <div className="lyrics-box">
              <div className="lyrics-header">
                <div>
                  <p className="lyrics-song-label">Chanson choisie</p>
                  <h2>{currentSong.title}</h2>
                </div>
                <div className="lyrics-song-controls">
                  <button
                    type="button"
                    className="music-control-button"
                    onClick={handleToggleSongPreview}
                    disabled={isRecording || isMixPlaying}
                    aria-label={isSongPreviewPlaying ? "Pause preview" : "Play preview"}
                  >
                    <span className="material-icons">
                      {isSongPreviewPlaying ? "pause" : "play_arrow"}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="change-song-btn"
                    onClick={() => {
                      if (isSongPreviewPlaying && musicRef.current) musicRef.current.pause();
                      setIsSongPreviewPlaying(false);
                      setStep("choose");
                    }}
                    disabled={isRecording}
                  >
                    Changer
                  </button>
                </div>
              </div>
              <div className="lyrics-content">
                {currentSong.lyrics.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PageRecord;
