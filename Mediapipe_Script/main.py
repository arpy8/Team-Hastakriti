import cv2
import time
import asyncio
from hand_detection import HandDetector
from websocket import send_message

DEBOUNCE_DELAY = 0.5  
GESTURE_TIMEOUT = 0.5 

def put_text(img, text, position):
    cv2.putText(img, text, position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2, cv2.LINE_AA)

def swap_binary(binary_string):
    return ''.join('1' if bit == '0' else '0' for bit in binary_string) 

async def process_frame(cap, hand_detector, finger_log, last_print_time, last_gesture_time, gesture_ready):
    _, raw_img = cap.read()
    hands, _ = hand_detector.findHands(raw_img)
    current_time = time.time()

    if not gesture_ready and current_time - last_gesture_time >= GESTURE_TIMEOUT:
        gesture_ready = True

    try:
        if hands and gesture_ready:
            hand = hands[0]
            fingers = hand_detector.fingersUp(hand)
            
            if len(finger_log) > 10:
                finger_log.clear()
            
            finger_id = "".join(map(str, fingers))
            
            try:
                if (finger_id != finger_log[-1] and 
                    current_time - last_print_time >= DEBOUNCE_DELAY):
                    finger_log.append(finger_id)
                    
                    await send_message(swap_binary(finger_id))
                    # await send_message(random.choice(["10011", "11111", "00000"]))
                    
                    last_print_time = current_time
                    last_gesture_time = current_time
                    gesture_ready = False

            except IndexError:
                finger_log.append(finger_id)
                # Replace asyncio.run with direct await
                await send_message(finger_id)
                print(finger_id)
                
                last_print_time = current_time
                last_gesture_time = current_time
                gesture_ready = False
            
    except Exception as e:
        print(e)

    status = "Ready" if gesture_ready else f"Wait {GESTURE_TIMEOUT - (current_time - last_gesture_time):.1f}s"
    put_text(raw_img, status, (10, 30))
    cv2.imshow("Mediapipe Hand Controller", raw_img)
    
    return last_print_time, last_gesture_time, gesture_ready

async def main():
    cap = cv2.VideoCapture(0)
    hand_detector = HandDetector(maxHands=1)
    finger_log = []
    last_print_time = 0
    last_gesture_time = 0
    gesture_ready = True

    try:
        while True:
            last_print_time, last_gesture_time, gesture_ready = await process_frame(
                cap, hand_detector, finger_log,
                last_print_time, last_gesture_time, gesture_ready
            )
            
            if cv2.waitKey(5) & 0xFF == 27:
                break
            
            # Give other tasks a chance to run
            await asyncio.sleep(0.01)
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    asyncio.run(main())