import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const HomePage = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  // Receive message.
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Send message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage("");
    }
  };
  return (
    <main className="">
      <button onClick={() => toast.success("Hello")}></button>
      <section>
        <div className="p-4">
          <h2>Chat</h2>
          <div className="mb-2">
            {messages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
          <input
            className="border px-2 py-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
          />
          <button
            className="ml-2 bg-blue-500 px-4 py-1 text-white"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
