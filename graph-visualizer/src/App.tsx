import "./App.css"
import { AppSidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { GraphComponent } from "@/components/graph-component"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useState, useEffect, useRef } from "react"


function generateRandomEMGData(prevData = { channel1: 0, channel2: 0 }) {
  const minVal = -200;
  const maxVal = 1200;
  const variation = 50; // Normal small fluctuations
  const peakChance = 0.1; // 10% chance of a peak event
  const peakMagnitude = 300; // Large spikes when peaks happen

  function generateChannelValue(prevValue) {
    let newValue = prevValue + Math.floor(Math.random() * (2 * variation + 1)) - variation;

    // Occasionally add a peak
    if (Math.random() < peakChance) {
      const peak = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * peakMagnitude);
      newValue += peak;
    }

    return Math.max(minVal, Math.min(maxVal, newValue)); // Keep within range
  }

  return {
    timestamp: Date.now(),
    channel1: generateChannelValue(prevData.channel1),
    channel2: generateChannelValue(prevData.channel2)
  };
}


export default function Home() {
  const [socketData, setSocketData] = useState<Object[]>();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isConnected) {
      interval = setInterval(() => {
        setSocketData(prevData => {
          const newData = [
            ...(prevData || []),
            {
              ...generateRandomEMGData(),
              formattedTimestamp: new Date().toLocaleTimeString(),
            },
          ].slice(-500);
          return newData;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  function handleConnectClick() {
    if (socketRef.current && isConnected) {

      socketRef.current.close();
      setIsConnected(false);
    } else if (!socketRef.current || !isConnected) {

      const socketUrl = "ws://127.0.0.1:8080";
      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      setIsConnected(true);

      socket.onmessage = async (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          setSocketData(prevData => {
            const newData = [
              ...(prevData || []),
              {
                ...data,
                formattedTimestamp: new Date(data.timestamp).toLocaleTimeString(),
              },
            ].slice(-500);
            return newData;
          });
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      socket.onopen = () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      };

      socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setIsConnected(false);
      };
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex h-screen bg-background text-foreground">
          <AppSidebar isConnected={isConnected} handleConnectClick={handleConnectClick} />
          <div className="flex flex-wrap items-start justify-center gap-2 p-4">
            <div className="flex gap-2 w-full">
              <div className="flex-1 p-2">
                <GraphComponent
                  title="EMG Channel 1"
                  data={socketData}
                  minY={-200}
                  maxY={1200}
                  blue
                />
              </div>
              <div className="flex-1 p-2">
                <GraphComponent
                  title="EMG Channel 2"
                  data={socketData}
                  minY={-200}
                  maxY={1200}
                  green
                />
              </div>
            </div>
            <div className="flex-1 p-4">
              <GraphComponent
                title="Real Time EMG Visualization"
                data={socketData}
                minY={-400}
                maxY={1200}
                green
                blue
              />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}