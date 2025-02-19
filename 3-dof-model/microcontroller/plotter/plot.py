import sys
import serial
import serial.tools.list_ports
import pyqtgraph as pg
from pyqtgraph.Qt import QtWidgets, QtCore
from collections import deque
import csv
import numpy as np

def list_available_ports():
    ports = serial.tools.list_ports.comports()
    available_ports = [port.device for port in ports]
    return available_ports

# ---------------------------- Configuration ----------------------------
# Constant Y-axis range settings
Y_MIN = -10    # Set your desired minimum y-axis value
Y_MAX = 1000   # Set your desired maximum y-axis value

# Serial port configuration
SERIAL_PORT = 'COM7'      # Replace with your Arduino's serial port
BAUD_RATE = 115200        # Must match the baud rate in your Arduino code

# Data saving option
SAVE_DATA = False          # Set to True if you want to save data

# Plotting configuration
PLOT_UPDATE_INTERVAL = 50  # in ms, adjust as needed
BUFFER_SIZE = 1000

# CSV Buffer Size (Number of rows to write at once)
CSV_BUFFER_SIZE = 100

# ----------------------------------------------------------------------

class SerialThread(QtCore.QThread):
    data_received = QtCore.pyqtSignal(float)

    def __init__(self, port, baud_rate):
        super().__init__()
        self.port = port
        self.baud_rate = baud_rate
        self.serial_conn = None
        self._running = True

    def run(self):
        try:
            self.serial_conn = serial.Serial(self.port, self.baud_rate, timeout=1)
            print(f"Connected to {self.port} at {self.baud_rate} baud.")
        except serial.SerialException as e:
            print(f"SerialException: {e}")
            available_ports = list_available_ports()
            print("Available ports:", available_ports)
            self._running = False
            return

        while self._running:
            try:
                if self.serial_conn.in_waiting:
                    line = self.serial_conn.readline().decode('utf-8').strip()
                    if line:
                        value = float(line)
                        self.data_received.emit(value)
            except ValueError:
                print(f"Non-numeric data received.")
            except Exception as e:
                print(f"Error reading serial data: {e}")
            self.msleep(1)  # Sleep for 1 ms to prevent CPU overuse

    def stop(self):
        self._running = False
        if self.serial_conn and self.serial_conn.is_open:
            self.serial_conn.close()
        self.quit()
        self.wait()

class Plotter(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Arduino Serial Plotter')

        # Central widget
        self.central_widget = QtWidgets.QWidget()
        self.setCentralWidget(self.central_widget)

        # Layout
        self.layout = QtWidgets.QVBoxLayout()
        self.central_widget.setLayout(self.layout)

        # Graphics Layout Widget
        self.win = pg.GraphicsLayoutWidget(title="Real-Time Serial Data Plot")
        self.layout.addWidget(self.win)

        # Add a plot
        self.plot = self.win.addPlot(title="EMG Signal")
        self.plot.setLabel('left', 'Amplitude')
        self.plot.setLabel('bottom', 'Samples')
        self.plot.showGrid(x=True, y=True)
        self.plot.setYRange(Y_MIN, Y_MAX, padding=0)

        # Initialize a curve to plot
        self.curve = self.plot.plot(pen='y')

        # Initialize data buffer using NumPy for efficiency
        self.data_buffer = np.zeros(BUFFER_SIZE)

        # CSV file setup
        if SAVE_DATA:
            self.csv_file = open('emg_data.csv', 'w', newline='')
            self.csv_writer = csv.writer(self.csv_file)
            self.csv_write_buffer = []

        # Set up the serial thread
        self.serial_thread = SerialThread(SERIAL_PORT, BAUD_RATE)
        self.serial_thread.data_received.connect(self.receive_data)
        self.serial_thread.start()

        # Timer for updating the plot
        self.timer = QtCore.QTimer()
        self.timer.timeout.connect(self.update_plot)
        self.timer.start(PLOT_UPDATE_INTERVAL)  # Update every 50 ms

    @QtCore.pyqtSlot(float)
    def receive_data(self, value):
        # Shift buffer to the left and append new value
        np.roll(self.data_buffer, -1)
        self.data_buffer[-1] = value

        if SAVE_DATA:
            self.csv_write_buffer.append([value])
            if len(self.csv_write_buffer) >= CSV_BUFFER_SIZE:
                self.csv_writer.writerows(self.csv_write_buffer)
                self.csv_write_buffer = []

    def update_plot(self):
        # Update the plot with the current buffer
        self.curve.setData(self.data_buffer)

    def closeEvent(self, event):
        # Stop the serial thread
        self.serial_thread.stop()
        if SAVE_DATA:
            # Write any remaining data
            if self.csv_write_buffer:
                self.csv_writer.writerows(self.csv_write_buffer)
            self.csv_file.close()
        event.accept()

def main():
    available_ports = list_available_ports()
    print("Available Serial Ports:", available_ports)

    if SERIAL_PORT not in available_ports:
        print(f"Error: {SERIAL_PORT} not found among available ports: {available_ports}")
        sys.exit()

    app = QtWidgets.QApplication(sys.argv)
    plotter = Plotter()
    plotter.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
