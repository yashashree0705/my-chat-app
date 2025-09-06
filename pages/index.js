import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const userMessage = input;
    setMessages([...messages, { role: "user", content: userMessage }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Travel Assistant</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 400, overflowY: "scroll" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{m.role === "user" ? "You" : "Assistant"}:</b> {m.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          style={{ width: "80%", padding: 5 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} style={{ padding: "5px 10px", marginLeft: 5 }}>
          Send
        </button>
      </div>
    </div>
  );
}
