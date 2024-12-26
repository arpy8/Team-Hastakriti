plugins {
    id("com.android.application")
}

android {
    namespace = "com.example.handcontroller"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.handcontroller"
        minSdk = 23
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

configurations.all {
    exclude(group = "com.android.support", module = "support-core-utils")
    exclude(group = "com.android.support", module = "support-compat")
}

dependencies {
    // AndroidX Core
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.core:core:1.13.0")
    implementation("androidx.activity:activity:1.8.2")
    implementation("com.google.android.material:material:1.11.0")
    implementation ("androidx.constraintlayout:constraintlayout:2.1.3")
    implementation ("androidx.cardview:cardview:1.0.0")
    // Bluetooth and Graphs
    implementation("com.jjoe64:graphview:4.2.2")

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}