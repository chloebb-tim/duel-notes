//to do:
// - stop mix when recording again
//- enleve boutons quand on enregistre? looks weird rn. ou les garder mais disabled? that would be prettier?
"use client";

import "./record.css";
import { useState, useRef } from "react";

const PageRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [songChoice, setSongChoice] = useState("chanson1");
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
  const [countdown, setCountdown] = useState(null);

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

  const getSongUrl = (choice) =>
    choice === "chanson1" ? "/chanson1.mp3" : "/chanson2.mp3";

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

  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: {
  //         echoCancellation: false,
  //         noiseSuppression: false,
  //         autoGainControl: false,
  //         sampleRate: 48000,
  //         channelCount: 1,
  //       },
  //     });

  //     const mediaRecorder = new MediaRecorder(stream, {
  //       mimeType: 'audio/webm;codecs=opus',
  //       audioBitsPerSecond: 192000,
  //     });
  //     mediaRecorderRef.current = mediaRecorder;

  //     const chunks = [];
  //     mediaRecorder.ondataavailable = (event) => {
  //       if (event.data && event.data.size > 0) {
  //         chunks.push(event.data);
  //       }
  //     };

  //     mediaRecorder.onstop = () => {
  //       const blob = new Blob(chunks, {
  //         type: mediaRecorder.mimeType || 'audio/webm',
  //       });
  //       setAudioBlob(blob);
  //       const audioURL = URL.createObjectURL(blob);
  //       if (audioRef.current) {
  //         audioRef.current.src = audioURL;
  //       }
  //       stream.getTracks().forEach((track) => track.stop());
  //     };

  //     if (musicRef.current) {
  //       const musicAudio = musicRef.current;
  //       musicAudio.src = songChoice === 'chanson1' ? '/chanson1.mp3' : '/chanson2.mp3';
  //       musicAudio.currentTime = 0;
  //       try {
  //         await musicAudio.play();
  //         setIsMusicPlaying(true);
  //       } catch (playError) {
  //         console.error('Unable to play music during recording:', playError);
  //       }
  //     }

  //     mediaRecorder.start();
  //     setIsRecording(true);
  //   } catch (error) {
  //     console.error('Error accessing microphone:', error);
  //     alert('Could not access microphone. Please check permissions.');
  //   }
  // };

  const startRecording = async () => {
    if (isSongPreviewPlaying && musicRef.current) {
      musicRef.current.pause();
      setIsSongPreviewPlaying(false);
    }

    if (isMixPlaying) {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsMixPlaying(false);
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
          audioContextRef.current.close().catch(() => {});
          audioContextRef.current = null;
        }

        setIsMusicPlaying(false);
      };

      const musicUrl =
        songChoice === "chanson1" ? "/chanson1.mp3" : "/chanson2.mp3";

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

      await Promise.all([
        warmUpAudioOutput(audioContext, 3500),
        runCountdown(),
      ]);

      musicEl.currentTime = 0;

      mediaRecorder.start();
      setIsRecording(true);

      await musicEl.play();
      setIsMusicPlaying(true);

  };

  // const stopRecording = () => {
  //   if (mediaRecorderRef.current && isRecording) {
  //     mediaRecorderRef.current.stop();
  //     setIsRecording(false);
  //   }

  //   if (musicRef.current && !musicRef.current.paused) {
  //     musicRef.current.pause();
  //     musicRef.current.currentTime = 0;
  //     setIsMusicPlaying(false);
  //   }
  // };

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
    if (!audioBlob || !musicRef.current || !audioRef.current) return;

    const musicAudio = musicRef.current;
    const voiceAudio = audioRef.current;

    const voiceUrl = URL.createObjectURL(audioBlob);
    voiceAudio.src = voiceUrl;
    voiceAudio.currentTime = 0;

    musicAudio.src =
      songChoice === "chanson1" ? "/chanson1.mp3" : "/chanson2.mp3";
    musicAudio.currentTime = 0;

      await Promise.all([musicAudio.play(), voiceAudio.play()]);
      setIsMixPlaying(true);
 
    
  };

  const handleStopMix = () => {
    if (musicRef.current) musicRef.current.pause();
    if (audioRef.current) audioRef.current.pause();
    setIsMixPlaying(false);
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

      console.log("Saving to database...");
      const dbResponse = await fetch("/api/recordings", {
        method: "POST",
        body: JSON.stringify({
          songChoice: songChoice,
          voiceUrl: url,
          voiceUploadthingKey: key,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Database response status:", dbResponse.status);

      if (dbResponse.ok) {
        alert("ca marche youpi!!!");
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
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
  <div className="record-page">
    <section className="record-topbar">
      <div className="song-selection-box">
        <label htmlFor="songChoice">Choisis une chanson</label>
        <div className="song-selection-inline">
          <select
            id="songChoice"
            value={songChoice}
            onChange={(e) => {
              const newChoice = e.target.value;
              setSongChoice(newChoice);
              if (isSongPreviewPlaying && musicRef.current) {
                musicRef.current.src = getSongUrl(newChoice);
                musicRef.current.currentTime = 0;
                musicRef.current.play().catch(() => {});
              }
            }}
            className="song-select"
            disabled={isRecording}
          >
            <option value="chanson1">chanson 1</option>
            <option value="chanson2">chanson 2</option>
          </select>

          <button
            type="button"
            className="music-control-button"
            onClick={handleToggleSongPreview}
            disabled={isRecording || isMixPlaying}
            aria-label={isSongPreviewPlaying ? 'Pause preview' : 'Play preview'}
          >
            <span className="material-icons">
              {isSongPreviewPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
      </div>

    </section>

    <section className="record-main">
      <div className="record-left">
        {countdown && <div className="countdown-overlay">{countdown}</div>}

        <button
          className={`mic-toggle ${isRecording ? 'recording' : ''}`}
          id="micr"
          onClick={handleButtonClick}
          disabled={countdown !== null}
        >
          <span className="material-icons">
            {isRecording ? 'stop' : 'mic'}
          </span>
        </button>

        <audio className="playback" ref={audioRef} controls />
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
          <h2>Paroles</h2>
                    <div>
            <p>ceci est une chanson très touchante</p>
            <p>ceci est très bien écrit</p>
            <p>une tres belle chanson</p>
            <p>wow wow je pleure</p>
            <p>ceci est une chanson très touchante</p>
            <p>ceci est très bien écrit</p>
            <p>une tres belle chanson</p>
            <p>wow wow je pleure</p>
            <p>ceci est une chanson très touchante</p>
            <p>ceci est très bien écrit</p>
            <p>une tres belle chanson</p>
            <p>wow wow je pleure</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
};

export default PageRecord;
