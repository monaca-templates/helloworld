const { expect, browser, $ } = require('@wdio/globals')

describe('Hello World', () => {
    it('Home Page', async () => {
        await browser.url(`http://localhost:8080/`)

        await expect($('h1')).toHaveText('HelloWorld!')
    })
})

