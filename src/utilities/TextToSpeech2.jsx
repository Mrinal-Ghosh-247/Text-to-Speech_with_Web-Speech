import { useState } from 'react';

const TextToSpeech2 = () => {
  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const synthesiseSpeech = () => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices()[1];
      // utterance.pitch = 1; 
      // utterance.rate = 1;  

      speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
    const pauseSpeech = (utterance) => {
      if (!utterance.paused) {
        utterance.pause();
      }
    }
  };


  return (
    <div>
      <h1>Text-to-Speech Converter</h1>
      <textarea
        rows="10"
        cols="50"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text here..."
      />
      <br />
      <button onClick={synthesiseSpeech}>Speak</button>
      <button onClick={pauseSpeech}>Pause</button>
    </div>
  );
};

export default TextToSpeech2;
