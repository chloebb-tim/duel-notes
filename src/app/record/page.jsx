'use client';

import './record.css';
import { useState, useRef } from 'react';

const PageRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [songChoice, setSongChoice] = useState('chanson1');
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const audioURL = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = audioURL;
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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

  const handlePublish = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('files', file);

      console.log("Starting upload...");
      const uploadResponse = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
      });

      console.log("Upload response status:", uploadResponse.status);
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.text();
        console.error("Upload error:", errorData);
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      const uploadedFiles = await uploadResponse.json();
      console.log("Upload successful:", uploadedFiles);

      if (!uploadedFiles || !Array.isArray(uploadedFiles) || !uploadedFiles[0]) {
        throw new Error('Invalid upload response');
      }

      const { url, key } = uploadedFiles[0];

      console.log("Saving to database...");
      const dbResponse = await fetch('/api/recordings', {
        method: 'POST',
        body: JSON.stringify({
          songChoice: songChoice,
          voiceUrl: url,
          voiceUploadthingKey: key,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Database response status:", dbResponse.status);

      if (dbResponse.ok) {
        alert('Recording published successfully!');
        setAudioBlob(null);
        if (audioRef.current) {
          audioRef.current.src = '';
        }
      } else {
        const errorData = await dbResponse.json();
        throw new Error(errorData.error || 'Failed to save recording');
      }
    } catch (error) {
      console.error('Error publishing recording:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="pt-12 record-container">
      <div className="song-selection">
        <label htmlFor="songChoice">Choose a song:</label>
        <select
          id="songChoice"
          value={songChoice}
          onChange={(e) => setSongChoice(e.target.value)}
          className="song-select"
        >
          <option value="chanson1">Song 1</option>
          <option value="chanson2">Song 2</option>
        </select>
      </div>

      <button
        className={`mic-toggle ${isRecording ? 'recording' : ''}`}
        id='micr'
        onClick={handleButtonClick}
      >
        <span className="material-icons">
          {isRecording ? 'stop' : 'mic'}
        </span>
      </button>

      <audio className='playback' ref={audioRef} controls></audio>

      {audioBlob && !isRecording && (
        <button
          className="publish-button"
          onClick={handlePublish}
          disabled={isUploading}
        >
          {isUploading ? 'Publishing...' : 'Publish Recording'}
        </button>
      )}
    </div>
  );
};

export default PageRecord;
