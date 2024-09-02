import { OPENAI_API_KEY } from '../config';
import { useState, useRef } from "react";

const TTSComponent = () => {
    const [text, setText] = useState("");
    const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const audioQueue = useRef([]);
    const isPlayingRef = useRef(false);

    const streamTTS = async (text) => {
        try {
            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'audio/aac'
                },
                body: JSON.stringify({
                    model: "tts-1",
                    voice: "alloy",
                    response_format: "aac",
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

                audioQueue.current.push(value);
                if (!isPlayingRef.current) {
                    playAudioChunks();
                }
            }

        } catch (error) {
            console.error('Error in TTS streaming:', error);
        }
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const playAudioChunks = async () => {
        if (audioQueue.current.length === 0) return;

        isPlayingRef.current = true;

        while (audioQueue.current.length > 0) {
            const chunk = audioQueue.current.shift();
            const audioBlob = new Blob([chunk], { type: 'audio/aac' });
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();

            // Wait for the audio to finish playing before continuing
            await new Promise((resolve) => {
                source.onended = resolve;
            });
        }

        isPlayingRef.current = false;
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