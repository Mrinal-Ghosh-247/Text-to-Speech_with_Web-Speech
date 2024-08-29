// src/components/TextToSpeech.js
import React, { useState } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  // Load voices when the component mounts
  React.useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      if (allVoices.length > 0) {
        setSelectedVoice(allVoices[0].name);
      }
    };

    if (window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleVoiceChange = (event) => {
    setSelectedVoice(event.target.value);
  };

  const synthesiseSpeech = () => {
    if (!window.speechSynthesis) {
      alert('SpeechSynthesis is not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(voice => voice.name === selectedVoice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    console.log(utterance);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <h1>Text-to-Speech</h1>
      <textarea
        rows="5"
        cols="40"
        value={text}
        onChange={handleTextChange}
        placeholder="Type something..."
      />
      <br />
      <label>
        Select Voice:
        <select value={selectedVoice} onChange={handleVoiceChange}>
          {voices.map(voice => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button onClick={synthesiseSpeech}>Speak</button>
    </div>
  );
};

export default TextToSpeech;
