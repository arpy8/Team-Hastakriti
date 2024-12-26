package com.example.handcontroller;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.example.handcontroller.utils.InstructionManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.button.MaterialButton;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Locale;

public class SettingsActivity extends AppCompatActivity {

    private TextView selectLanguage;
    private MaterialButton autoCalibrateButton;
    private TextView calibrationInstructions;
    private InstructionManager instructionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Apply saved language preference
        applySavedLanguage();

        setContentView(R.layout.activity_settings);

        // Initialize InstructionManager
        instructionManager = InstructionManager.getInstance(this);

        // Initialize views
        selectLanguage = findViewById(R.id.selectLanguage);
        autoCalibrateButton = findViewById(R.id.autocalibrate);
        calibrationInstructions = findViewById(R.id.calibrationInstructions);

        // Set click listener for language selection
        selectLanguage.setOnClickListener(v -> openLanguageMenu(v));

        // Set click listener for calibration
        autoCalibrateButton.setOnClickListener(v -> startCalibration());

        // Bottom navigation setup
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setSelectedItemId(R.id.settings);

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();

            if (itemId == R.id.home) {
                // Navigate to HomeActivity
                startActivity(new Intent(this, MainActivity.class));
                finish(); // Close current activity
                return true;
            } else if (itemId == R.id.settings) {
                // Stay on SettingsActivity
                return true;
            } else {
                return false;
            }
        });
    }

    private void startCalibration() {
        // Hide the calibrate button
        autoCalibrateButton.setVisibility(View.GONE);

        // Simulate API response for initial calibration state
        try {
            JSONObject initialResponse = new JSONObject();
            initialResponse.put("calibration_state", "INITIAL");
            instructionManager.updateInstructionsFromApiResponse(initialResponse);

            // Display first instruction
            updateCalibrationInstructions();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void updateCalibrationInstructions() {
        // Show instructions TextView
        calibrationInstructions.setVisibility(View.VISIBLE);

        // Get current instruction
        String currentInstruction = instructionManager.getCurrentInstruction();
        calibrationInstructions.setText(currentInstruction);

        // Set up listener for moving to next instruction
        calibrationInstructions.setOnClickListener(v -> {
            // Check if more instructions are available
            if (instructionManager.hasMoreInstructions()) {
                // Advance to next instruction
                instructionManager.advanceInstruction();

                // Update UI with new instruction
                String nextInstruction = instructionManager.getCurrentInstruction();
                calibrationInstructions.setText(nextInstruction);
            } else {
                // Calibration completed
                finishCalibration();
            }
        });
    }

    private void finishCalibration() {
        // Try to simulate a completed calibration
        try {
            JSONObject completedResponse = new JSONObject();
            completedResponse.put("calibration_state", "COMPLETED");
            instructionManager.updateInstructionsFromApiResponse(completedResponse);

            // Display final instruction
            calibrationInstructions.setText(instructionManager.getCurrentInstruction());

            // Reset UI after a short delay
            calibrationInstructions.postDelayed(() -> {
                calibrationInstructions.setVisibility(View.GONE);
                autoCalibrateButton.setVisibility(View.VISIBLE);
            }, 2000);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    // Existing language-related methods remain the same...
    private void openLanguageMenu(View v) {
        // Create a custom context menu
        registerForContextMenu(selectLanguage);
        openContextMenu(selectLanguage);
        unregisterForContextMenu(selectLanguage);
    }

    @Override
    public void onCreateContextMenu(@NonNull android.view.ContextMenu menu, @NonNull View v, android.view.ContextMenu.ContextMenuInfo menuInfo) {
        super.onCreateContextMenu(menu, v, menuInfo);

        if (v.getId() == R.id.selectLanguage) {
            menu.setHeaderTitle(getString(R.string.select_language));
            menu.add(0, 1, 0, getString(R.string.english));
            menu.add(0, 2, 1, getString(R.string.hindi));
            menu.add(0, 3, 2, getString(R.string.tamil));
            menu.add(0, 4, 3, getString(R.string.telugu));
            menu.add(0, 5, 4, getString(R.string.malayalam));
        }
    }

    @Override
    public boolean onContextItemSelected(@NonNull MenuItem item) {
        String languageCode = "en"; // Default to English

        switch (item.getItemId()) {
            case 1:
                languageCode = "en"; // English
                break;
            case 2:
                languageCode = "hi"; // Hindi
                break;
            case 3:
                languageCode = "ta"; // Tamil
                break;
            case 4:
                languageCode = "te"; // Telugu
                break;
            case 5:
                languageCode = "ml"; // Malayalam
                break;
            default:
                return super.onContextItemSelected(item);
        }

        changeLanguage(languageCode);
        return true;
    }

    private void changeLanguage(String languageCode) {
        // Save selected language to SharedPreferences
        SharedPreferences preferences = getSharedPreferences("AppPrefs", MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString("language", languageCode);
        editor.apply();

        // Update locale
        Locale locale = new Locale(languageCode);
        Locale.setDefault(locale);
        Resources resources = getResources();
        Configuration config = resources.getConfiguration();
        config.setLocale(locale);
        config.setLayoutDirection(locale);
        resources.updateConfiguration(config, resources.getDisplayMetrics());

        // Restart activity to apply changes
        Intent intent = new Intent(this, SettingsActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finish();
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
}