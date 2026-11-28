"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X, Send, Sparkles } from "lucide-react";
import styles from "./ai-project-assistant.module.css";
import ReactMarkdown from "react-markdown";
import api from "@/app/lib/axios";
import remarkGfm from "remark-gfm";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AskProjectResponse = {
  message: string;
  showData: string;
};

const subscribeToMount = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function AIProjectAssistant({
  onClose,
  teamId,
  projectId
}: {
  onClose: () => void;
  teamId: string,
  projectId: string
}) {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your RedSun AI Assistant. Ask me anything about your project.",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, isLoading]);

  async function sendMessage() {
    const question = userInput.trim();
    if (!question) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: question },
    ]);
    setUserInput("");

    try {
      setIsLoading(true)
      const response = await api.post<AskProjectResponse>( // This sends the question to your existing backend endpoint.
        `/ai/teams/${teamId}/projects/${projectId}/ask`,
        { userQuestion: question },
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: response.data.showData },
      ]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally{
      setIsLoading(false)
    }
  }


  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!isMounted) return null;

  return createPortal((
    <div className={styles.backdrop}>
      <div className={styles.chatContainer} role="dialog" aria-modal="true" aria-labelledby="ai-assistant-title">

        <div className={styles.header}>
          <Sparkles />
          <h2 id="ai-assistant-title">RedSun AI Assistant</h2>

          <button type="button" onClick={onClose} aria-label="Close AI assistant">
            <X />
          </button>
        </div>        

        <div className={styles.messages} aria-live="polite">
            {messages.map((message, index) => ( // If true → apply userMessage styling. If false → apply aiMessage styling.
                <div key={index} className={message.role === "user"? styles.userMessage: styles.aiMessage}>
                {
                  message.role === "assistant"?(
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  ):(
                    <p>{message.content}</p>
                  )
                }
                </div>
            ))}

            {
              isLoading && (
                <div className={styles.aiMessage}>
                  <p>RedSun AI is thinking...</p>
                </div>
              )
            }

            <div ref={messagesEndRef} />
            </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="Ask about your project..."
            value={userInput}
            onChange={(e)=> setUserInput(e.target.value)}

            onKeyDown={(e)=>{
              if(e.key === "Enter" && !isLoading){
                sendMessage()
              }
            }}
          />

          <button type="button" aria-label="Send message" onClick={sendMessage}>
            <Send />
          </button>
        </div>

      </div>
    </div>
  ), document.body);
}
