import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");
    newSocket.onopen = () => {
      newSocket.send("Hello Server!");
    };
    newSocket.onmessage = (message) => {
      setMessages((m) => [...m, message.data]);
    };
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputEl = document.getElementById("form-input") as HTMLInputElement;
    const inputValue = inputEl.value;
    if (inputValue) {
      socket?.send(inputValue);
      inputEl.value = "";
    }
  };

  return (
    <div>
      <h3>Messages</h3>
      <form onSubmit={submitForm}>
        <input id="form-input" />
      </form>
      {messages.map((message) => (
        <p>{message}</p>
      ))}
    </div>
  );
}

export default App;
