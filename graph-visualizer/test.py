import json
import random
import asyncio
import websockets

async def handler(websocket):
    """
    Handles incoming WebSocket connections and sends random data.
    """
    print("Client connected")
    try:
        while True:
            await websocket.send(json.dumps({
                "channel1": random.random(),
                "channel2": random.random()
            }))
            await asyncio.sleep(1)
    except websockets.ConnectionClosed:
        print("Client disconnected")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("WebSocket server started on ws://0.0.0.0:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())