import serial
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from collections import deque

# Configure the serial port and baud rate
SERIAL_PORT = 'COM6'  # Replace with your Arduino's COM port
BAUD_RATE = 115200

# Number of data points to display
WINDOW_SIZE = 1000

# Initialize a deque to store the EMG data
data = deque([0]*WINDOW_SIZE, maxlen=WINDOW_SIZE)

# Initialize the plot
fig, ax = plt.subplots()
line, = ax.plot(data)
ax.set_ylim(-1000, 1000)  # Adjust based on expected EMG range
ax.set_xlim(0, WINDOW_SIZE)
ax.set_title('Real-Time EMG Signal')
ax.set_xlabel('Sample')
ax.set_ylabel('Amplitude')

def init():
    line.set_ydata([0] * WINDOW_SIZE)
    return line,

def update(frame):
    try:
        incoming_data = ser.readline().decode('utf-8').strip()
        value = float(incoming_data)
        data.append(value)
        line.set_ydata(data)
    except:
        pass
    return line,

# Open the serial port
ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)

ani = animation.FuncAnimation(fig, update, init_func=init, interval=20, blit=True)

plt.show()

ser.close()
