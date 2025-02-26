# Test

## Local

- `wdio.config.local.js`

    ```json
    {
        "capabilities": [{
            "platformName": "Android",
            "appium:deviceName": "test", // Ensure this matches your emulator AVD name
            "appium:platformVersion": "14.0",
            "appium:automationName": "UiAutomator2",
            "appium:app": "./platforms/android/app/build/outputs/apk/debug/app-debug.apk",
            "appium:appWaitActivity": "MainActivity",
            "appium:chromedriverExecutable": "./chromedriver-mac-arm64-local",  // Points to the downloaded binary
            "webSocketUrl": true,
            "unhandledPromptBehavior": "ignore"
        }]
    }
    ```

- Change or create the Emulator device name `test` to match your running emulator.

- Download the supported [chromedriver](https://chromedriver.storage.googleapis.com/index.html) for your local PC.

- Set up and start the emulator:

    ```bash
    avdmanager create avd -n test -k "system-images;android-34;google_apis;arm64-v8a"
    emulator -list-avds
    emulator -avd test
    adb devices
    ```

- Start the Appium Server:

    ```bash
    npx appium
    ```

- Run the test:

    Once the Appium server and emulator are started, run the test:

    ```bash
    npx wdio run ./wdio.conf.local.js
    ```
