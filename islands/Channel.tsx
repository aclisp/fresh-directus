import { useEffect, useRef, useState } from "preact/hooks";
import { io } from "socket.io-client";

interface ChannelProps {
  token: string;
  channel: string;
}

export default function Channel(props: ChannelProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastPong, setLastPong] = useState<string | null>(null);
  // deno-lint-ignore no-explicit-any
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io("http://127.0.0.1:8055", {
      //transports: ["polling"],
      auth: {
        token: props.token,
        channel: props.channel,
      },
    });
    socketRef.current = socket;
    console.log(`channel created: socket id=${socket.id}`);

    socket.on("connect", () => {
      console.log(`channel connected: socket id=${socket.id}`);
      setIsConnected(true);
    });

    socket.io.on("reconnect_attempt", async () => {
      // refresh token here
      const res = await fetch("/api/token");
      if (res.ok) {
        const token = await res.text();
        socket.auth.token = token;
        // because the token is fetched later, we have to manually reconnect after auto-reconnection failure.
        setTimeout(() => socket.connect(), 5000);
      }
    });

    socket.on("disconnect", (reason: string) => {
      console.log(
        `channel disconnected: socket id=${socket.id} reason=${reason}`,
      );
      setIsConnected(false);
    });

    socket.on("pong", () => {
      console.log(`channel on pong: socket id=${socket.id}`);
      setLastPong(new Date().toISOString());
    });

    socket.on("data", (data: Record<string, unknown>) => {
      console.log(data);
    });

    return () => {
      console.log(`channel dropped: socket id=${socket.id}`);
      socket.close();
    };
  }, []);

  const sendPing = () => {
    socketRef.current.emit("ping");
  };

  return (
    <div>
      <p>Connected: {"" + isConnected}</p>
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
  );
}
