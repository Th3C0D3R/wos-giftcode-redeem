import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    return res.json({ message: "WIP" });
    const getHighestQualityURL = (arrQ, arrU) => {
        return arrU[arrQ.indexOf(Math.max(...arrQ).toString())];
    };
    var data = req.query;
    var isP = false;
    if (data["url"] === undefined) return res.json({ message: "NO URL" });
    if (data["p"] !== undefined) isP = true;
    const urlBase = isP ? "https://yesdownloader.com/" : "https://www.downloader.wiki/";
    const convertRoute = isP ? "en1/convert/" : "convert/";
    const ref = isP ? `${urlBase}en1/` : `${urlBase}?err=dmFyOmVycl9lbnRlcl91cmw`;
    const durl = isP ? `url=${encodeURI(data["url"].toString())}&submitForm=` : `from=all&url=${encodeURI(data["url"].toString())}`;
    const regExU = isP ? /href\="\/(en1\/sdownload\/\S+)"/ : /href\="\/(sdownload\/\S+)"/

    var resConvert = await fetch(`${urlBase}${convertRoute}`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Sec-GPC": "1",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1"
        },
        "referrer": `${ref}`,
        "body": durl,
        "method": "POST",
        "mode": "cors"
    });
    
    var resText = await resConvert.text();

    const regQ = [...resText.matchAll(new RegExp(/<td>(\d{3,4})<\/td>/, "gi"))].map(a => a["1"]);
    const regU = [...resText.matchAll(new RegExp(regExU, "gi"))].map(a => a["1"]);

    var urlOfHighest = getHighestQualityURL(regQ, regU);

    var resDL = await fetch(`https://yesdownloader.com/en1/sdownload/qcnAaMraZk9LRbane_ZJZ9iGaronOwn4FnmftUBj_MI/`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Sec-GPC": "1",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1"
        },
        "method": "GET",
        "mode": "cors"
    });
    

    console.log(resDL.redirected);

    var dlText = await resDL.text();

    const regS = [...dlText.matchAll(new RegExp(/<script>[\n](.+)<\/script>/, "g"))];
    var script = regS[0][1];

    var indexofEnd = script.indexOf("function mJHlA()");
    var rest = script.substring(0, indexofEnd);

    var x = eval(rest);

    console.log(x);

    return res.json({});
}