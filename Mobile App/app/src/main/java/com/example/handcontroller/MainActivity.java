package com.example.handcontroller;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.Button;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.series.DataPoint;
import com.jjoe64.graphview.series.LineGraphSeries;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {
    private GraphView graphSensor1, graphSensor2;
    private LineGraphSeries<DataPoint> seriesSensor1, seriesSensor2;
    private int x1 = 0, x2 = 0;

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothSocket bluetoothSocket;
    private InputStream inputStream;

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private Runnable graphUpdateRunnable;

    private static final UUID DEVICE_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    private static final int PERMISSION_REQUEST_CODE = 100;

    // Launcher for Bluetooth enable request
    private final ActivityResultLauncher<Intent> bluetoothEnableLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    connectToBluetoothDevice();
                } else {
                    Toast.makeText(this, "Bluetooth must be enabled to connect", Toast.LENGTH_SHORT).show();
                }
            }
    );


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set content view first, then apply language
        setContentView(R.layout.activity_main);

        // Initialize views and setup
        initializeGraphs();
        setupConnectButton();
        setupBottomNavigation();

        // Initialize Bluetooth adapter
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null) {
            Toast.makeText(this, "Bluetooth not supported on this device", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Simulated graph update for debugging
        graphUpdateRunnable = new Runnable() {
            @Override
            public void run() {
                updateGraphSensor1(Math.random() * 10); // Simulated Sensor 1 Data
                updateGraphSensor2(Math.random() * 15); // Simulated Sensor 2 Data
                mainHandler.postDelayed(this, 1000); // Update every second
            }
        };

        mainHandler.post(graphUpdateRunnable);

        // Check and request permissions
        checkAndRequestPermissions();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Apply saved language when activity resumes
        applySavedLanguage();
    }

    private void initializeGraphs() {
        graphSensor1 = findViewById(R.id.graphSensor1);
        graphSensor2 = findViewById(R.id.graphSensor2);

        seriesSensor1 = new LineGraphSeries<>();
        seriesSensor2 = new LineGraphSeries<>();

        graphSensor1.addSeries(seriesSensor1);
        graphSensor2.addSeries(seriesSensor2);

        // Configure graph properties
        graphSensor1.getViewport().setScalable(true);
        graphSensor2.getViewport().setScalable(true);
        graphSensor1.getViewport().setScrollable(true);
        graphSensor2.getViewport().setScrollable(true);
    }

    private void setupConnectButton() {
        Button btnConnect = findViewById(R.id.btnConnect);
        btnConnect.setOnClickListener(view -> attemptBluetoothConnection());
    }

    private void setupBottomNavigation() {
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();

            if (itemId == R.id.home) {
                // Stay on the home page (no action needed)
                return true;
            } else if (itemId == R.id.settings) {
                // Navigate to SettingsActivity
                startActivity(new Intent(MainActivity.this, SettingsActivity.class));
                return true;
            } else {
                return false; // If no valid option is selected
            }
        });
    }

    private void attemptBluetoothConnection() {
        // Check if Bluetooth is enabled
        if (!bluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            bluetoothEnableLauncher.launch(enableBtIntent);
            return;
        }

        // Check permissions before connecting
        if (!hasAllPermissions()) {
            checkAndRequestPermissions();
            return;
        }

        connectToBluetoothDevice();
    }

    private boolean hasAllPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            return ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED &&
                    ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED &&
                    ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH) == PackageManager.PERMISSION_GRANTED &&
                    ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }

    private void checkAndRequestPermissions() {
        if (!hasAllPermissions()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                ActivityCompat.requestPermissions(this,
                        new String[]{
                                Manifest.permission.BLUETOOTH_CONNECT,
                                Manifest.permission.BLUETOOTH_SCAN,
                                Manifest.permission.ACCESS_FINE_LOCATION
                        },
                        PERMISSION_REQUEST_CODE);
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                ActivityCompat.requestPermissions(this,
                        new String[]{
                                Manifest.permission.BLUETOOTH,
                                Manifest.permission.ACCESS_FINE_LOCATION
                        },
                        PERMISSION_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean allPermissionsGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allPermissionsGranted = false;
                    break;
                }
            }

            if (allPermissionsGranted) {
                Toast.makeText(this, "Bluetooth permissions granted", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Some Bluetooth permissions were denied", Toast.LENGTH_LONG).show();
            }
        }
    }

    private void connectToBluetoothDevice() {
        // Verify permissions one more time
        if (!hasAllPermissions()) {
            Toast.makeText(this, "Bluetooth permissions not granted", Toast.LENGTH_SHORT).show();
            return;
        }

        ExecutorService executorService = Executors.newSingleThreadExecutor();
        executorService.execute(() -> {
            try {
                // Get paired devices
                if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }
                Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();

                if (pairedDevices.isEmpty()) {
                    mainHandler.post(() -> Toast.makeText(this, "No paired Bluetooth devices", Toast.LENGTH_SHORT).show());
                    return;
                }

                // Select first paired device (replace with more robust device selection)
                BluetoothDevice device = pairedDevices.iterator().next();

                bluetoothSocket = device.createRfcommSocketToServiceRecord(DEVICE_UUID);
                bluetoothSocket.connect();

                inputStream = bluetoothSocket.getInputStream();

                mainHandler.post(() -> {
                    Toast.makeText(this, "Connected to " + device.getName(), Toast.LENGTH_SHORT).show();
                    // Stop simulated data and start real data processing
                    mainHandler.removeCallbacks(graphUpdateRunnable);
                    startBluetoothDataProcessing();
                });

            } catch (IOException e) {
                mainHandler.post(() -> {
                    Toast.makeText(this, "Connection error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    private void startBluetoothDataProcessing() {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        executorService.execute(() -> {
            byte[] buffer = new byte[1024];
            int bytes;

            while (true) {
                try {
                    if (inputStream != null && (bytes = inputStream.read(buffer)) != -1) {
                        final double sensor1Value = parseFirstSensorValue(buffer, bytes);
                        final double sensor2Value = parseSecondSensorValue(buffer, bytes);

                        mainHandler.post(() -> {
                            updateGraphSensor1(sensor1Value);
                            updateGraphSensor2(sensor2Value);
                        });
                    }
                } catch (IOException e) {
                    mainHandler.post(() -> Toast.makeText(this, "Data reading interrupted", Toast.LENGTH_SHORT).show());
                    break;
                }
            }
        });
    }

    private double parseFirstSensorValue(byte[] buffer, int bytes) {
        // Implement actual parsing logic for sensor 1 value
        // For now, simulate some data
        return Math.random() * 10;
    }

    private double parseSecondSensorValue(byte[] buffer, int bytes) {
        // Implement actual parsing logic for sensor 2 value
        // For now, simulate some data
        return Math.random() * 15;
    }

    private void updateGraphSensor1(double yValue) {
        seriesSensor1.appendData(new DataPoint(x1++, yValue), true, 50);
    }

    private void updateGraphSensor2(double yValue) {
        seriesSensor2.appendData(new DataPoint(x2++, yValue), true, 50);
    }

    private void applySavedLanguage() {
        SharedPreferences preferences = getSharedPreferences("AppPrefs", MODE_PRIVATE);
        String languageCode = preferences.getString("language", "en"); // Default to English
        Locale locale = new Locale(languageCode);
        Locale.setDefault(locale);
        Resources resources = getResources();
        Configuration config = resources.getConfiguration();
        config.setLocale(locale);
        resources.updateConfiguration(config, resources.getDisplayMetrics());
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Clean up Bluetooth resources
        try {
            if (bluetoothSocket != null) {
                bluetoothSocket.close();
            }
            if (inputStream != null) {
                inputStream.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Remove any pending callbacks
        mainHandler.removeCallbacks(graphUpdateRunnable);
    }
}

