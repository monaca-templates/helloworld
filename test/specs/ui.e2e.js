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
});

