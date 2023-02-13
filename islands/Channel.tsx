import { useEffect, useRef, useState } from "preact/hooks";
import { io } from "socket.io-client";
import { DIRECTUS_HOST } from "../utils/directus/transport.ts";

interface ChannelProps {
  token: string;
  channel: string;
}

let counter = 0;

export default function Channel(props: ChannelProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const [pushData, setPushData] = useState<Array<Record<string, unknown>>>([]);
  // deno-lint-ignore no-explicit-any
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(DIRECTUS_HOST, {
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
      setLastPong(new Date().toLocaleString());
    });

    socket.on("data", (data: Record<string, unknown>) => {
      data._counter = ++counter;
      data._time = new Date();
      setPushData((dataList) => {
        const newList = [...dataList, data];
        if (newList.length > 10) {
          newList.shift();
        }
        return newList;
      });
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
    <>
      <div class="flex flex-col justify-center items-center">
        <div class="lg:flex lg:flex-row">
          <div class="block rounded-lg shadow-lg bg-white max-w-sm text-center">
            <div class="py-3 px-6 border-b border-gray-300 flex justify-center">
              <span class="px-4 py-2 rounded-full border border-gray-300 text-gray-500 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease">
                {props.channel ?? "Not in a channel"}
              </span>
            </div>
            <div class="p-6">
              <h5 class="text-gray-900 text-xl font-medium mb-2">
                {isConnected ? "ONLINE" : "-"}
              </h5>
              <p class="text-gray-700 text-base mb-4">
                你正在订阅这个频道...
              </p>
              <button
                type="button"
                class=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={sendPing}
              >
                Ping
              </button>
            </div>
            <div class="py-3 px-6 border-t border-gray-300 text-gray-600">
              {lastPong ?? "did not ping yet"}
            </div>
          </div>
          <PushData dataList={pushData} />
        </div>
      </div>
    </>
  );
}

function PushData(props: { dataList: Array<Record<string, unknown>> }) {
  return (
    <div class="overflow-x-auto lg:ml-6">
      <div class="py-2 inline-block min-w-full">
        <table class="min-w-full text-center">
          <thead class="border-b bg-white">
            <tr>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-2"
              >
                #
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-2"
              >
                data
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-2"
              >
                time
              </th>
            </tr>
          </thead>
          <tbody>
            {props.dataList.map(
              (data, index) => (
                <tr class="bg-white border-b" key={data._counter}>
                  <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {String(data._counter)}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-2 whitespace-normal max-w-[9rem] lg:max-w-lg truncate">
                    {JSON.stringify(extractData(data))}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-2 whitespace-normal">
                    {(data._time as Date).toLocaleString()}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function extractData(data: Record<string, unknown>) {
  const { _counter, _time, ...extracted } = data;
  return extracted;
}
