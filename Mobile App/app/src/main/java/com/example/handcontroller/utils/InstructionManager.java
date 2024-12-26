package com.example.handcontroller.utils;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InstructionManager {
    private static InstructionManager instance;
    private Map<String, List<String>> instructionSteps;
    private int currentInstructionIndex;
    private String currentCalibrationState;
    private Context context;

    private InstructionManager(Context context) {
        this.context = context.getApplicationContext();
        instructionSteps = new HashMap<>();
        currentInstructionIndex = 0;
        initDefaultInstructions();
    }

    public static synchronized InstructionManager getInstance(Context context) {
        if (instance == null) {
            instance = new InstructionManager(context);
        }
        return instance;
    }

    private void initDefaultInstructions() {
        // Default instructions
        instructionSteps.put("default", List.of("Follow standard calibration procedure"));
        instructionSteps.put("error", List.of("Calibration failed. Check connection and try again."));
    }

    // Method to update instructions from API response
    public void updateInstructionsFromApiResponse(JSONObject response) {
        try {
            // Parse calibration state and instructions
            if (response.has("calibration_state")) {
                String calibrationState = response.getString("calibration_state");
                currentCalibrationState = calibrationState;
                currentInstructionIndex = 0;

                List<String> steps = new ArrayList<>();
                switch (calibrationState) {
                    case "INITIAL":
                        steps.add("Relax your hand completely");
                        steps.add("Rest your hand on a flat surface");
                        steps.add("Keep your hand in a neutral, relaxed position");
                        break;
                    case "GRIP_CALIBRATION":
                        steps.add("Relax your hand");
                        steps.add("Flex muscle for sensor 0 - fully extend your hand");
                        steps.add("Relax your hand");
                        steps.add("Flex muscle for sensor 1 - fully close your hand into a tight grip");
                        steps.add("Relax your hand");
                        steps.add("Repeat full open and close motions 3 times");
                        break;
                    case "COMPLETED":
                        steps.add("Hand calibration is now complete");
                        steps.add("Your device is ready for use");
                        break;
                    case "FAILED":
                        steps.add("Calibration process encountered an error");
                        steps.add("Please restart the calibration");
                        steps.add("Ensure your hand is clean and dry");
                        steps.add("Check sensor connections");
                        break;
                    default:
                        steps.add("Awaiting calibration instructions");
                }

                // Allow for custom instructions from API if provided
                if (response.has("custom_instructions")) {
                    JSONArray customInstructions = response.getJSONArray("custom_instructions");
                    for (int i = 0; i < customInstructions.length(); i++) {
                        steps.add(customInstructions.getString(i));
                    }
                }

                instructionSteps.put("current", steps);
            }

            // Update error message if provided
            if (response.has("error_message")) {
                instructionSteps.put("error", List.of(response.getString("error_message")));
            }
        } catch (JSONException e) {
            Log.e("InstructionManager", "Error parsing API response", e);
            instructionSteps.put("current", List.of("Error processing instructions"));
        }
    }

    // Get current instruction
    public String getCurrentInstruction() {
        List<String> currentSteps = instructionSteps.get("current");
        if (currentSteps == null || currentSteps.isEmpty()) {
            return getDefaultInstruction();
        }

        if (currentInstructionIndex < currentSteps.size()) {
            return currentSteps.get(currentInstructionIndex);
        }

        return "Calibration instructions completed";
    }

    // Move to next instruction
    public void advanceInstruction() {
        List<String> currentSteps = instructionSteps.get("current");
        if (currentSteps != null && currentInstructionIndex < currentSteps.size() - 1) {
            currentInstructionIndex++;
        }
    }

    // Check if more instructions are available
    public boolean hasMoreInstructions() {
        List<String> currentSteps = instructionSteps.get("current");
        return currentSteps != null && currentInstructionIndex < currentSteps.size() - 1;
    }

    // Reset instruction index
    public void resetInstructions() {
        currentInstructionIndex = 0;
    }

    // Get default instruction
    private String getDefaultInstruction() {
        List<String> defaultSteps = instructionSteps.get("default");
        return defaultSteps != null && !defaultSteps.isEmpty() ? defaultSteps.get(0) : "No instructions available";
    }

    // Get error instruction
    public String getErrorInstruction() {
        List<String> errorSteps = instructionSteps.get("error");
        return errorSteps != null && !errorSteps.isEmpty() ? errorSteps.get(0) : "Unknown error occurred";
    }

    // Get current calibration state
    public String getCurrentCalibrationState() {
        return currentCalibrationState;
    }
}