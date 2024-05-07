import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    return res.json({ message: "WIP" });
    var data = req.query;
    if (data["url"] === undefined) return res.json({ message: "NO URL" });

    var qualityUrl = {};

    var resConvert = await fetch("https://yesdownloader.com/en1/convert/", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Sec-GPC": "1",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://yesdownloader.com/en1/",
        "body": "url={url decoded}&submitForm=",
        "method": "POST",
        "mode": "cors"
    });

    var resText = await resConvert.text();
    //<td>(\d{3,4})<td>[\s\S]+href\=(\/en1\/sdownload\S+)

    var regQ = [...resText.matchAll(new RegExp(/<td>(\d{3,4})<td>/,"gi"))];
    var regU = [...resText.matchAll(new RegExp(/href\=(\/en1\/sdownload\S+)/,"gi"))];



    return res.json({});
}