import json
import time
import serial
import random
import streamlit as st
from datetime import date
import plotly.graph_objects as go

WINDOW_SIZE = 100
LOGO = 'logo.png'

upper_limit = 950
curr_count = 0
session_count = 0 
session_id = "HOS-01"


def initialize_plot(title, x_title, y_title):
    """Initialize an empty Plotly figure with specified titles."""
    fig = go.Figure()
    fig.update_layout(
        title=title,
        xaxis_title=x_title,
        yaxis_title=y_title,
        template="plotly_white"
    )
    return fig

def plot_line_chart(data, placeholder, count):
    """Plot a line chart based on the data."""
    if not data:
        fig = initialize_plot("Waiting for Data...", "X-axis", "Y-axis")
        placeholder.plotly_chart(fig)
        return

    x = [float(point["timestamp"]) for point in data]
    y = [float(point["channel1"]) for point in data]

    fig = go.Figure()
    
    fig.add_shape(
        type="line",
        x0=min(x) if x else 0, x1=max(x) if x else 1,  # Line spans the x-axis range
        y0=upper_limit, y1=upper_limit,  # Fixed y position
        line=dict(color="orange", width=2, dash="dash"),  # Line style
        name="Upper Limit"
    )
    fig.add_trace(go.Scatter(
        x=x, y=y, mode='lines+markers', name='Data Points',
        line=dict(color='white', width=1),
        marker=dict(size=6, color='#61dafb')
    ))
    fig.update_layout(
        # title="Graph Visualization",
        # xaxis_title="X-axis",
        # yaxis_title="Y-axis",
        template="plotly_white"
    )
    

    placeholder.plotly_chart(fig, key=f"line_chart_{count}")

def plot_bar_chart(data, placeholder, count, upper_limit=None):
    """Plot a bar chart showing only the last value from the data."""
    if not data:
        # Show placeholder when there's no data
        fig = go.Figure(go.Bar(
            x=["Channel 1"], y=[0], marker=dict(color='#61dafb')
        ))
        fig.update_layout(
            title="Waiting for Data...",
            template="plotly_white",
            yaxis_range=[0, 100],
            margin=dict(l=0, r=0, t=40, b=0)  # No padding
        )
        placeholder.plotly_chart(fig, use_container_width=True)
        return

    # Extract the last value from channel1
    last_value = float(data[-1]["channel1"])
    x_values = ["Last Value"]  # Static x-label for the single bar
    y_values = [last_value]

    fig = go.Figure(go.Bar(
        x=x_values, y=y_values, marker=dict(color='#61dafb')
    ))
    fig.update_layout(
        template="plotly_white",
        yaxis_range=[0, 100],
        margin=dict(l=0, r=0, t=40, b=0),  # No padding
        autosize=True
    )
    
    # Add upper limit line if specified
    if upper_limit is not None:
        fig.add_shape(
            type="line",
            x0=-0.5, x1=0.5,  # Line spans only the visible bar
            y0=upper_limit, y1=upper_limit,  # Fixed y position
            line=dict(color="orange", width=2, dash="dash")  # Line style
        )

    # Plot the chart
    placeholder.plotly_chart(fig, use_container_width=True, key=f"bar_chart_{count}")

def setup_serial_connection(port, baudrate, timeout):
    """Set up the serial connection."""
    return serial.Serial(
        port=port,
        baudrate=baudrate,
        timeout=timeout,
        bytesize=serial.EIGHTBITS,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE
    )

def read_serial_data(ser, temp, placeholder, bar_placeholder, count, start_time):
    """Read and process data from the serial port."""
    
    current_time = time.time()
    time_elapsed = current_time - start_time

    line = {'timestamp': current_time, 'channel1': random.randint(100, 300), 'channel2': random.randint(100, 300)} 
    
    if 4 < time_elapsed < 6:
        if random.choice([True, False]):
            line['channel1'] = random.randint(1000, 1024)
        else:
            line['channel2'] = random.randint(1000, 1024)

        start_time = current_time
        
    if 1:
        try:
            data_point = line
            temp.append(data_point)
            if len(temp) > WINDOW_SIZE:
                temp.pop(0)
                
            if data_point["channel1"] > upper_limit:
                global curr_count
                curr_count += 1

            # Update plots
            plot_line_chart(temp, placeholder, count)
            plot_bar_chart(temp, bar_placeholder, count)

            # Increment count
            count += 1
        except json.JSONDecodeError as e:
            st.error(f"JSON parsing error: {line}. Error: {e}")
    else:
        print(f"Malformed data: {line}")
    return count

def read_continuous_serial(port='COM5', baudrate=9600, timeout=1):
    """Continuously read and plot serial data."""
    global curr_count
    
    try:
        ser = setup_serial_connection(port, baudrate, timeout)
        time.sleep(2)
        ser.reset_input_buffer()

        temp = []
        count = 0
        start_time = time.time()

        # cols = st.columns([5.1,1])
        # with cols[0]:
        st.header("Rehabilitation Module")

        col1, _, col2 = st.columns([1, 0.01, 0.2])
                
        with col1:
            with st.container(border=True):
                a1, a2, a3, a4, a5 = st.columns(5)

                # start_button = a0.button("Start", use_container_width=True)
                count_placeholder = a1.empty()
                repetition_count_placeholder = a2.empty()
                set_count_placeholder = a3.empty()
                timer_placeholder = a4.empty()
                repetition_count_placeholder2 = a5.empty()

            with st.container(border=True):
                placeholder = st.empty()

                # with repetition_count_placeholder.spinner():
                #     while 1: pass

        with col2:
            # st.write("<br>", unsafe_allow_html=True)
            # st.write("<br>", unsafe_allow_html=True)
 
            st.image(LOGO)
            start_button_placeholder = st.empty()
            
            with st.container(border=True):
                bar_placeholder = st.empty()

            st.write("<p style='padding:10px'></p>", unsafe_allow_html=True)
            
        plot_line_chart(temp, placeholder, count)
        plot_bar_chart(temp, bar_placeholder, count)
        
        if start_button_placeholder.button("Start", use_container_width=True):
            while True:
                try:
                    elapsed_time = time.time() - start_time
                    count = read_serial_data(ser, temp, placeholder, bar_placeholder, count, start_time)

                    count_placeholder.metric("Successful Grasp Count", curr_count)
                    repetition_count_placeholder.metric("Repetition Count", curr_count)
                    set_count_placeholder.metric("Set", curr_count)
                    repetition_count_placeholder.metric("Repetition Count", curr_count)
                    timer_placeholder.metric("Timer", f"{abs(100 - int(elapsed_time))} s")
                    repetition_count_placeholder2.metric("Date", f"{date.today()}")
                    
                except serial.SerialException as e:
                    st.error(f"Serial read error: {e}")
                    break
                except Exception as e:
                    st.error(f"Unexpected error: {e}")
                    break
        
        else:
            count_placeholder.metric("Successful Grasp Count", "0")
            repetition_count_placeholder.metric("Today's Target", "100")
            set_count_placeholder.metric("Set", 1)
            repetition_count_placeholder2.metric("Repetition Count", "Nan")
            timer_placeholder.metric("Timer", f"{100} s")
            repetition_count_placeholder2.metric("Timer", "00:00")
            
            

    except serial.SerialException as e:
        st.error(f"Error connecting to serial port: {e}")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()
            st.info("Serial connection closed.")

def about_page():
    """Display information about the Rehabilitation Module application."""
    st.header("About Our Rehabilitation Module")
    st.write("""
    Welcome to the **Hastakriti Rehabilitation Module**, a system designed to assist and monitor rehabilitation exercises with real-time data visualization and interactive feedback.
    """)

    st.subheader("Features")
    st.markdown("""
    - **Real-time Data Tracking**: Continuously monitor and visualize exercise performance.
    - **Interactive Charts**: Includes line and bar charts to display live data.
    - **Repetition Counting**: Tracks successful grasps and repetitions to help users meet their goals.
    - **Customizable Settings**: Configure thresholds, such as upper limits, to adapt to individual needs.
    - **User-Friendly Interface**: Designed for ease of use with clear metrics and intuitive controls.
    """)

    st.subheader("How It Works")
    st.write("""
    1. Connect the device via a serial port.
    2. Monitor your rehabilitation progress through real-time visualizations.
    3. Set goals and track successful repetitions, sets, and overall progress.
    4. Ensure safe and efficient exercises with visual feedback.
    """)

    st.subheader("About Hastakriti")
    st.write("""
    Hastakriti is committed to creating innovative solutions for rehabilitation and healthcare. This module is part of our mission to leverage technology for empowering individuals in their recovery journey.
    """)

def main():
    st.set_page_config(page_title="Hastakriti | Rehab Module", layout="wide")
    tabs = st.tabs(["Home", "About"])
    
    with tabs[0]:
        read_continuous_serial(port='COM5', baudrate=9600)
    with tabs[1]:
        about_page()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\nSerial reading stopped by user.")