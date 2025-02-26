const { expect, browser, $ } = require('@wdio/globals');

const screenshotDir = './test/screenshots';

describe('My Cordova App', () => {
    it('should open the app and verify the home page', async () => {
        // ✅ Activate the app
        await driver.execute('mobile: activateApp', { appId: 'com.example.helloworld' });

        // ✅ Wait for the app to fully load
        await browser.pause(3000);

        // ✅ Get and switch to the WebView context
        const contexts = await browser.getContexts();
        console.log('Available contexts:', contexts);

        if (contexts.length > 1) {
            await browser.switchContext(contexts[1]);
        } else {
            console.warn('No WebView context found, staying in native mode');
        }

        // ✅ Try to locate the <h1> header
        const homeHeader = await $('h1');
        await homeHeader.waitForExist({ timeout: 10000 });

        // ✅ Verify text
        await expect(homeHeader).toHaveText('HelloWorld!');

        // ✅ Verify and click "Start Demo" button
        const demoButton = await $('a.button--large');
        await expect(demoButton).toBeExisting();
        await browser.saveScreenshot(`${screenshotDir}/home_page.png`);

        // Demo page
        await demoButton.click();
        // ✅ Wait for the app to fully load
        await browser.pause(3000);

        await browser.saveScreenshot(`${screenshotDir}/demo_page_navigation.png`);
    });

    it('should test the device info section (Platform & Version)', async () => {
        // Capture screenshot before checking
        await browser.saveScreenshot(`${screenshotDir}/info_section_before.png`);

        const platformSpan = await $('#platform');
        const versionSpan = await $('#version');

        await platformSpan.waitForExist({ timeout: 5000 });
        await versionSpan.waitForExist({ timeout: 5000 });

        const platformText = await platformSpan.getText();
        const versionText = await versionSpan.getText();

        // Adjust these checks to match your actual device/emulator values
        expect(platformText).toContain('Android');
        expect(versionText).toContain('14');

        // Capture screenshot after checking
        await browser.saveScreenshot(`${screenshotDir}/info_section_after.png`);
    });

    it('should trigger the Call plugin', async () => {
        const callButton = await $('=Call 411');
        await callButton.waitForExist({ timeout: 5000 });

        await callButton.click();
        // This attempts to open the dialer
        await browser.pause(1000);

        // Check the app is still running (or that no crash occurred)
        const title = await browser.getTitle();
        expect(title).toContain('Monaca');

        await browser.saveScreenshot(`${screenshotDir}/call_after_click.png`);
    });

    it('should trigger the Vibrate plugin', async () => {
        const vibrateButton = await $('=Vibrate');
        await vibrateButton.waitForExist({ timeout: 5000 });

        await vibrateButton.click();
        // No obvious UI changes; manual verification or logs might be needed
        await browser.pause(1000);

        // Check the app is still running (or that no crash occurred)
        const title = await browser.getTitle();
        expect(title).toContain('Monaca');

        await browser.saveScreenshot(`${screenshotDir}/vibrate_after_click.png`);
    });

    it('should trigger the Network plugin and display a confirm dialog', async () => {
        const networkButton = await $('=Check Network');
        await networkButton.waitForExist({ timeout: 5000 });
        await networkButton.click();
    
        // Give the native dialog some time to appear
        await browser.pause(2000);
    
        // Switch to the native context
        const currentContext = await browser.getContext();
        await browser.switchContext('NATIVE_APP');
    
        // Find the text element in the dialog (IDs can vary by Android version)
        // Typically:
        //  - android:id/alertTitle for the title
        //  - android:id/message    for the message
        //  - android:id/button1    for the "OK" button
        //  - android:id/button2    for the "Cancel" button
        const messageElement = await $('id=android:id/message');
        const dialogText = await messageElement.getText();
        console.log('Dialog text is:', dialogText);
    
        // Verify it contains 'Connection type:'
        expect(dialogText).toContain('Connection type:');
    
        // Tap the OK button (button1 is typically the positive button)
        const okButton = await $('id=android:id/button1');
        await okButton.click();
    
        // Switch back to WebView context
        await browser.switchContext(currentContext);
    
        // Optionally confirm the app is still running
        const title = await browser.getTitle();
        expect(title).toContain('Monaca');
    });
    

    it('should trigger the Location plugin and display permission dialog', async () => {
        const locationButton = await $('=Get Location');
        await locationButton.waitForExist({ timeout: 5000 });
        await locationButton.click();
    
        // --- Switch to native context to handle the permission prompt ---
        const currentContext = await browser.getContext();
        await browser.switchContext('NATIVE_APP');
    
        // Wait for the "Allow while using the app" button to appear.
        const allowButton = await $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');
        await allowButton.waitForExist({ timeout: 5000 });
        expect(await allowButton.isExisting()).toBe(true);  // Test will fail if the element isn't found.
    
        // If found, click the button and capture a screenshot.
        await allowButton.click();
        await browser.saveScreenshot(`${screenshotDir}/location_permission_granted.png`);
        console.log('Location permission granted.');
    
        // Switch back to the original context if needed.
        await browser.switchContext(currentContext);
    });
    
    

    it('should trigger the Picture plugin and show an error alert with message "20"', async () => {
        const picButton = await $('=Get a Picture');
        await picButton.waitForExist({ timeout: 5000 });
        await browser.saveScreenshot(`${screenshotDir}/camera_before_click.png`);
        await picButton.click();
    
        // --- Handle Camera Permission Dialog if needed ---
        const currentContext = await browser.getContext();
        await browser.switchContext('NATIVE_APP');
        const cameraAllowButton = await $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');
        if (await cameraAllowButton.isExisting()) {
            await cameraAllowButton.click();
            await browser.saveScreenshot(`${screenshotDir}/camera_permission_granted.png`);
        } else {
            console.log('Camera permission dialog not found or already granted.');
        }
        // Switch back to the original context so the app can process the click.
        await browser.switchContext(currentContext);
        // --- End Permission Handling ---
    
        // Wait for the error alert to appear (expected to be a native dialog)
        await browser.pause(5000);
    
        // Switch to native context to check for the error alert.
        await browser.switchContext('NATIVE_APP');
        // Wait for the error alert's message element to appear.
        const messageElement = await $('id=android:id/message');
        await messageElement.waitForExist({ timeout: 5000 });
        const alertText = await messageElement.getText();
        expect(alertText).toEqual("20");
    
        // Dismiss the alert using the OK button (usually id "android:id/button1")
        const okButton = await $('id=android:id/button1');
        await okButton.click();
        await browser.saveScreenshot(`${screenshotDir}/camera_error_alert.png`);
    
        // Optionally, switch back to the original context.
        await browser.switchContext(currentContext);
    });
    

});

