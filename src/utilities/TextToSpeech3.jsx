
import React, { useState, useRef } from "react";

const TTSComponent = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  React.useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      if (!selectedVoice && allVoices.length > 0) {
        setSelectedVoice(allVoices[0].name);
      }
    };

    if (window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleVoiceChange = (event) => {
    setSelectedVoice(event.target.value);
  };

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      const useVoice = voices.find((voice, index) => {
        if (voice.name === selectedVoice) {
          console.log("Voice index:", index); // Log the index of the voice
          return true;
        }
        return false;
      });
    if (useVoice) {
      utterance.voice = useVoice;
    }
    console.log(utterance);

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const filteredVoices = voices.filter(voice =>
    voice.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text to speak"
        rows="5"
        cols="50"
      ></textarea>
      <br />
      <label>
        Search Voice:
        <input 
          type="text" 
          value={searchTerm} 
          onChange={handleSearchChange} 
          placeholder="Search voices" 
        />
      </label>
      <br />
      <label>
        Select Voice:
        <select value={selectedVoice} onChange={handleVoiceChange}>
          {filteredVoices.map(voice => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button onClick={handlePlay}>
        {isPaused ? "Resume" : "Play"}
      </button>
      <button onClick={handlePause} disabled={!isPlaying || isPaused}>
        Pause
      </button>
      <button onClick={handleStop} disabled={!isPlaying}>
        Stop
      </button>
    </div>
  );
};

export default TTSComponent;
