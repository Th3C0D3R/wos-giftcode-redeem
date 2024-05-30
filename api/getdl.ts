import type { VercelRequest, VercelResponse } from '@vercel/node'
import Chromium from 'chrome-aws-lambda'
import playwright, { chromium } from 'playwright-core'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    //return res.json({ message: "WIP" });

    var data = req.query;
    var isP = false;

    if (data["url"] === undefined) return res.json({ message: "NO URL" });
    if (data["p"] !== undefined) isP = true;

    const url = data["url"].toString();
    const urlBase = isP ? "https://yesdownloader.com/" : "https://www.downloader.wiki/";

    var path = await Chromium.executablePath;
    console.log(path);

    let browser = await playwright.chromium.launch({
        args: [...Chromium.args,
            "--no-sandbox"
        ],
        executablePath: path,
        headless: true,
        ignoreDefaultArgs: ['--disable-extensions']
    });
    var page = await browser.newPage();

    await page.goto(`${urlBase}`);

    await page.focus("#ytUrl");
    await page.keyboard.type(url);
    await page.waitForTimeout(250);
    await page.click("#convertForm > button");

    try {
        await page.waitForSelector("#dtable tbody tr td a[href*=\"sdownload\"]");
    } catch (error) {
        browser.close();
        return res.json({ message: "ERROR - Page not loaded correctly!" });
    }

    let list = await page.evaluate((sel) => {
        let elements: any = Array.from(document.querySelectorAll(sel));
        let links = elements.map((element: HTMLAnchorElement) => {
            return element.href
        })
        return links;
    }, '#dtable tbody tr td a[href*=\"sdownload\"]');

    if (list.length > 0) {
        var content = await page.goto(list[list.length - 1]);
        if (content !== null && content !== undefined) {
            var text = await content.text();
            const regS = [...text.matchAll(new RegExp(/<script>[\n](.+)<\/script>/, "g"))];
            var script = regS[0][1];
    
            var indexofEnd = script.indexOf("function mJHlA()");
            var rest = script.substring(0, indexofEnd);
    
            var dlUrl = eval(rest);
            browser.close();
            return res.json({ url: dlUrl });
        }
        
        browser.close();
        return res.json({ message: "ERROR - last Downloadpage not loaded correctly!" });
    }
    browser.close();
    return res.json({});
}