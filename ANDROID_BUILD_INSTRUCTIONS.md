# How to Build Your Android APK

I have set up your project with **Capacitor** to turn your React app into an Android app.

## Prerequisites

You need to have **Android Studio** installed on your computer. If you don't have it, download it from [developer.android.com/studio](https://developer.android.com/studio).

## Steps to Build APK

1.  **Sync your code**:
    Whenever you make changes to your React code, run:

    ```bash
    npm run build
    npm run android:sync
    ```

2.  **Open in Android Studio**:
    Run the following command to open your project in Android Studio:

    ```bash
    npm run android:open
    ```

3.  **Build the APK**:
    - Once Android Studio opens, wait for Gradle to sync (you'll see progress bars at the bottom).
    - Go to the menu bar: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    - Wait for the build to finish.
    - A notification will appear: "APK(s) generated successfully". Click **locate** to find your `.apk` file.

## Running on a Device

- Connect your Android phone via USB.
- Enable **Developer Options** and **USB Debugging** on your phone.
- In Android Studio, click the green **Play** button (Run 'app') to install and run the app directly on your phone.
