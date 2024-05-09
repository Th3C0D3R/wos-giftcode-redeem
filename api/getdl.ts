import type { VercelRequest, VercelResponse } from '@vercel/node'
import puppeteer, { Browser } from 'puppeteer-core';
import edgeChromium from 'chrome-aws-lambda';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    return res.json({ message: "WIP" });

    var data = req.query;
    var isP = false;

    if (data["url"] === undefined) return res.json({ message: "NO URL" });
    if (data["p"] !== undefined) isP = true;

    const url = data["url"].toString();
    const urlBase = isP ? "https://yesdownloader.com/" : "https://www.downloader.wiki/";

    var path = await edgeChromium.executablePath || "C:\\\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    let browser = await puppeteer.launch({
        executablePath: path,
        headless: true,
        ignoreDefaultArgs: ['--disable-extensions']
    });
    var [page] = await browser.pages();

    await page.goto(`${urlBase}`);

    await page.focus("#ytUrl");
    await page.keyboard.type(url);
    await page.waitForTimeout(250);
    await page.click("#convertForm > button");

    try {
        await page.waitForSelector("#dtable tbody tr td a[href*=\"sdownload\"]");
    } catch (error) {
        browser.close();
        return res.json({message: "ERROR - Page not loaded correctly!"});
    }

    let list = await page.evaluate((sel) => {
        let elements = Array.from(document.querySelectorAll(sel));
        let links = elements.map(element => {
            return element.href
        })
        return links;
    }, '#dtable tbody tr td a[href*=\"sdownload\"]');

    if (list.length > 0) {
        var content = await page.goto(list[list.length - 1]);
        var text = await content.text();
        const regS = [...text.matchAll(new RegExp(/<script>[\n](.+)<\/script>/, "g"))];
        var script = regS[0][1];

        var indexofEnd = script.indexOf("function mJHlA()");
        var rest = script.substring(0, indexofEnd);

        console.log(eval(rest));
        browser.close();
        return;
    }
    browser.close();
    return null;

    return res.json({});
}