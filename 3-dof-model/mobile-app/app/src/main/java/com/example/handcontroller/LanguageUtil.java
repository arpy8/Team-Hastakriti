package com.example.handcontroller;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;

import java.util.Locale;

public class LanguageUtil {

    public static void applySavedLanguage(Context context) {
        SharedPreferences preferences = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE);
        String languageCode = preferences.getString("language", "en"); // Default to English
        Locale locale = new Locale(languageCode);
        Locale.setDefault(locale);

        Resources resources = context.getResources();
        Configuration config = resources.getConfiguration();
        config.setLocale(locale);
        resources.updateConfiguration(config, resources.getDisplayMetrics());
    }
}
