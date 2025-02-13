const { expect, browser, $ } = require('@wdio/globals');

const url = 'http://localhost:8080';
const screenshotDir = './test/screenshots';

describe('Hello World', () => {
    it('Home Page', async () => {        
        await browser.url(url);

        // Capture screenshot of Home Page
        await browser.saveScreenshot(`${screenshotDir}/home_page.png`);

        // Verify the heading exists
        const heading = $('h1');
        await expect(heading).toHaveText('HelloWorld!');

        // Verify the button is visible
        const startDemoButton = $('a.button--large');
        await expect(startDemoButton).toBeDisplayed();

        // Click the button
        await startDemoButton.click();

        // Wait for navigation to demo.html
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('demo.html'),
            {
                timeout: 5000, // 5 seconds max wait
                timeoutMsg: 'Expected to navigate to demo.html but it did not happen'
            }
        );

        // Capture screenshot after navigation
        await browser.saveScreenshot(`${screenshotDir}/demo_page_navigation.png`);

        // Verify content in demo.html
        const demoHeading = $('h2');
        await expect(demoHeading).toHaveText('this file is demo.html');
    });

    describe('Demo Page', () => {
        it('should display all content and buttons correctly', async () => {
            await browser.url(`${url}/demo.html`);

            // Capture screenshot of Demo Page
            await browser.saveScreenshot(`${screenshotDir}/demo_page.png`);
    
            // Verify headings
            const mainHeading = $('h1');
            await expect(mainHeading).toHaveText('Welcome to Monaca!');
    
            const subHeading = $('h2');
            await expect(subHeading).toHaveText('this file is demo.html');
    
            // Verify platform and version information
            await expect($('#platform')).toBeDisplayed();
            await expect($('#version')).toBeDisplayed();
            await expect($('#uuid')).toBeDisplayed();
            await expect($('#name')).toBeDisplayed();
            await expect($('#width')).toBeDisplayed();
            await expect($('#height')).toBeDisplayed();
            await expect($('#colorDepth')).toBeDisplayed();

            // Capture screenshot of the info section
            await browser.saveScreenshot(`${screenshotDir}/demo_page_info_section.png`);
    
            // Verify buttons exist and are clickable
            const buttons = [
                { selector: 'a.btn.large:nth-of-type(1)', text: 'Get Location' },
                { selector: 'a.btn.large:nth-of-type(2)', text: 'Call 411' },
                { selector: 'a.btn.large:nth-of-type(3)', text: 'Vibrate' },
                { selector: 'a.btn.large:nth-of-type(4)', text: 'Get a Picture' },
                { selector: 'a.btn.large:nth-of-type(5)', text: 'Check Network' }
            ];
    
            for (const btn of buttons) {
                const button = $(btn.selector);
                await expect(button).toBeDisplayed();
                await expect(button).toHaveText(btn.text);
            }

            // Capture screenshot after verifying buttons
            await browser.saveScreenshot(`${screenshotDir}/demo_page_buttons.png`);
    
            // Verify the image container is initially hidden
            const viewport = $('#viewport');
            await expect(viewport).not.toBeDisplayed();
        });
    });
});
