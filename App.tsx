import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { InputArea } from './components/InputArea';
import { CameraModal } from './components/CameraModal';
import { Message, Sender, MessageType } from './types';
import { geminiService } from './services/geminiService';
import { fileToBase64 } from './utils/image';
import { GoogleGenAI, LiveServerMessage, Modality, Chat } from '@google/genai';
import { createBlob } from './utils/audio';
import { ParticleBackground } from './components/ParticleBackground';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: Sender.AI,
      type: MessageType.TEXT,
      text: 'Hello! I am Klug AI, your study buddy. How can I help you today?  Pals, ask me anything! 🚀',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  const sessionPromiseRef = useRef<Promise<Chat> | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if(!aiRef.current) {
        aiRef.current = geminiService.initAI();
    }
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (isLoading) return;

    // A prompt is required for the vision model, even if the user provides no text.
    const promptForAI = (pendingImage && !text.trim()) ? "Describe this image." : text;
    if (!promptForAI.trim() && !pendingImage) return; // Don't send empty messages

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      type: pendingImage ? MessageType.IMAGE : MessageType.TEXT,
      text: text,
      imageUrl: pendingImage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if(!aiRef.current) throw new Error("AI not initialized");
      const aiResponseText = await geminiService.generateAnswer(aiRef.current, promptForAI, pendingImage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        type: MessageType.TEXT,
        text: aiResponseText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error getting response from AI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        type: MessageType.TEXT,
        text: 'Oops! 😅 Something went wrong. Could you please try that again?',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setPendingImage(null);
    }
  }, [isLoading, pendingImage]);

  const handleCapture = useCallback((dataUrl: string) => {
    setIsCameraOpen(false);
    setPendingImage(dataUrl);
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
        const base64 = await fileToBase64(file);
        setPendingImage(base64);
    } catch (error) {
        console.error("Error converting file to base64", error);
        const errorMessage: Message = {
            id: Date.now().toString(),
            sender: Sender.AI,
            type: MessageType.TEXT,
            text: 'Sorry, I couldn\'t process that file. Please try another one. 📂',
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessage]);
    }
  };

  const toggleVoiceChat = async () => {
    if (isListening) {
      setIsListening(false);
      if(sessionPromiseRef.current){
        // In a real app, you would properly close the session.
        // For simplicity here we just stop listening.
        console.log("Stopping voice chat");
        sessionPromiseRef.current = null;
      }
    } else {
        setIsListening(true);
        setIsLoading(true);

        const ai = aiRef.current;
        if (!ai) {
          setIsLoading(false);
          setIsListening(false);
          return;
        }

        const currentInputTranscriptionRef = { current: '' };
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const handleTranscription = (text: string, final: boolean) => {
              if (final) {
                const userMessage: Message = {
                  id: Date.now().toString(),
                  sender: Sender.USER,
                  type: MessageType.TEXT,
                  text: text.trim(),
                  timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, userMessage]);
              }
            };
            
            const session = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current = message.serverContent.inputTranscription.text;
                        }

                        if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                           // Voice output is complex to implement without more infrastructure,
                           // so we will use the text transcription as the AI response.
                        }

                        if(message.serverContent?.turnComplete && message.serverContent.outputTranscription) {
                            const aiResponseText = message.serverContent.outputTranscription.text;
                            const fullInput = currentInputTranscriptionRef.current;
                            handleTranscription(fullInput, true);

                            const aiMessage: Message = {
                                id: (Date.now() + 1).toString(),
                                sender: Sender.AI,
                                type: MessageType.TEXT,
                                text: aiResponseText,
                                timestamp: new Date().toISOString(),
                            };
                            setMessages((prev) => [...prev, aiMessage]);
                            setIsLoading(false);
                            setIsListening(false); // Stop listening after one exchange
                        }
                    },
                    onerror: (e) => {
                        console.error('Live session error:', e);
                        setIsLoading(false);
                        setIsListening(false);
                    },
                    onclose: () => {
                        console.log('Live session closed');
                        setIsLoading(false);
                        setIsListening(false);
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                }
            });

            const sessionPromise = Promise.resolve(session);
            // This is a simplified approach. Full voice chat requires more complex state management.
        } catch (err) {
            console.error('Error starting voice chat:', err);
            setIsLoading(false);
            setIsListening(false);
        }
    }
  };


  return (
    <div className="flex flex-col h-screen w-screen bg-transparent text-text-primary font-sans antialiased">
      <ParticleBackground />
      <Header />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputArea 
        onSendMessage={handleSendMessage} 
        onCameraClick={() => setIsCameraOpen(true)}
        onFileUpload={handleFileUpload}
        onVoiceClick={toggleVoiceChat}
        isListening={isListening}
        disabled={isLoading}
        pendingImage={pendingImage}
        onClearPendingImage={() => setPendingImage(null)}
      />
      {isCameraOpen && (
        <CameraModal 
          onCapture={handleCapture} 
          onClose={() => setIsCameraOpen(false)} 
        />
      )}
    </div>
  );
}