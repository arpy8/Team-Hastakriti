import websockets

URI = "ws://192.168.137.21:81/ws"

async def send_message(message, uri=URI):
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to {uri}")
            
            await websocket.send(message)
            print(f"Sent message: {message}")
            
            response = await websocket.recv()
            print(f"Received response: {response}")
            
    except websockets.exceptions.ConnectionClosed:
        print("Connection closed unexpectedly")
    except websockets.exceptions.InvalidURI:
        print("Invalid WebSocket URI")
    except Exception as e:
        print(f"An error occurred: {e}")

# async def main():
#     if len(sys.argv) > 1:
#         uri = sys.argv[1]
#     if len(sys.argv) > 2:
#         message = sys.argv[2]
    
    # await send_message(uri, message)

# if __name__ == "__main__":
#     asyncio.run(send_message("M"))