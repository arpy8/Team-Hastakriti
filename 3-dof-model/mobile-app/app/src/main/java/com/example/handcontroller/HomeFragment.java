package com.example.handcontroller;

import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.series.DataPoint;
import com.jjoe64.graphview.series.LineGraphSeries;

public class HomeFragment extends Fragment {

    private GraphView graphSensor1;
    private GraphView graphSensor2;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the new layout
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // Initialize graph views
        graphSensor1 = view.findViewById(R.id.graphSensor1);
        graphSensor2 = view.findViewById(R.id.graphSensor2);

        // Setup graphs
        setupGraphs();

        return view;
    }

    private void setupGraphs() {
        // Example data for Sensor 1
        LineGraphSeries<DataPoint> series1 = new LineGraphSeries<>(new DataPoint[] {
                new DataPoint(0, 1),
                new DataPoint(1, 5),
                new DataPoint(2, 3),
                new DataPoint(3, 2),
                new DataPoint(4, 6)
        });

        // Customize Sensor 1 graph
        series1.setColor(getResources().getColor(R.color.graph_line_color));
        series1.setThickness(8);
        graphSensor1.addSeries(series1);

        // Configure Sensor 1 graph properties
        graphSensor1.getViewport().setScalable(true);
        graphSensor1.getViewport().setScrollable(true);
        graphSensor1.getViewport().setXAxisBoundsManual(true);
        graphSensor1.getViewport().setMinX(0);
        graphSensor1.getViewport().setMaxX(5);

        // Example data for Sensor 2
        LineGraphSeries<DataPoint> series2 = new LineGraphSeries<>(new DataPoint[] {
                new DataPoint(0, 4),
                new DataPoint(1, 2),
                new DataPoint(2, 6),
                new DataPoint(3, 5),
                new DataPoint(4, 3)
        });

        // Customize Sensor 2 graph
        series2.setColor(getResources().getColor(R.color.graph_line_color_alt));
        series2.setThickness(8);
        graphSensor2.addSeries(series2);

        // Configure Sensor 2 graph properties
        graphSensor2.getViewport().setScalable(true);
        graphSensor2.getViewport().setScrollable(true);
        graphSensor2.getViewport().setXAxisBoundsManual(true);
        graphSensor2.getViewport().setMinX(0);
        graphSensor2.getViewport().setMaxX(5);
    }
}