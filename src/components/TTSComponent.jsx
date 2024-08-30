import { OPENAI_API_KEY } from '../config';
import { useState } from "react";

const TTSComponent = () => {
    const [text, setText] = useState("");
    // const [isPlaying, setIsPlaying] = useState(false);
    // const [isPaused, setIsPaused] = useState(false);
   
    const streamTTS = async (text) => {
        
        try {
            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'audio/mpeg' // or any other supported format
                },
                body: JSON.stringify({
                    model: "tts-1",
                    voice: "alloy",
                    input: text,
                    stream: true
                })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            
            // Read the stream
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log('Streaming finished');
                    break;
                }
                
                // Convert the chunk to audio and play it
                playAudioChunk(value);
            }
            
        } catch (error) {
            console.error('Error in TTS streaming:', error);
        }
    };
    
    const handleTextChange = (event) => {
        setText(event.target.value);
      };

    const playAudioChunk = (chunk) => {
        const audioBlob = new Blob([chunk], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    };
    
    const handleSpeak = () => {
        streamTTS(text);
    };
    
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
            <button onClick={handleSpeak}>Speak</button>
        </div>
    );
};

export default TTSComponent;