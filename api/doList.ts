import type { VercelRequest, VercelResponse } from '@vercel/node'
import { CODE } from './redeem'

interface RedeemResponse { text: string, code: number }
interface Data { data: RedeemResponse[] }

export default function handler(req: VercelRequest, res: VercelResponse) {
    var data = req.query;
    var debug = false
    if (data === undefined) return res.json({ message: "NO DATA" });
    if (data["debug"] !== undefined) debug = true;
    if (data["code"] === undefined) return res.json({ message: "NO CODE" });
    const myPromise = new Promise(async (resolve, reject) => {
        var resp = await fetch("https://wgr.vercel.app/api/getIDs");
        var proms = new Set();
        resp = await resp.json();
        if (resp["ids"] === undefined) {
            reject("NO IDS FOUND");
            return;
        }
        var ids = Array.from(new Set(resp["ids"]));
        var code = data["code"].toString();


        for (let i = 0; i < ids.length; i++) {
            let playerID = `${ids[i]}`;
            console.log(`${i + 1}/${ids.length}`);
            let p = fetchPlayerRedeems<RedeemResponse>(`https://wgr.vercel.app/api/redeem?id=${playerID}&code=${code}&useList=1`);
            proms.add(p);
        }
        var r: Data[] = await Promise.all(proms) as Data[];


        var success: RedeemResponse[] = [], failed: RedeemResponse[] = [], received: RedeemResponse[] = [];
        var Debugstring = "";
        r.forEach(pr => {
            if(pr === undefined) return;
            var rp: RedeemResponse = pr.data.filter(m => m["id"] === "redeem")[0] ?? pr.data.filter(m => m["id"] === "login")[0];
            if (debug) {
                Debugstring += `${JSON.stringify(rp)} ==> ${rp["code"]} ${typeof rp["code"]}<br>`;
            }
            if (isType<RedeemResponse>(rp)) {
                switch (rp["code"]) {
                    case CODE.SUCCESS:
                        success.push(rp);
                        break;
                    case CODE.RECEIVED:
                        received.push(rp);
                        break;
                    case CODE.TIMEOUT:
                    case CODE.TIME_ERROR:
                    default:
                        failed.push(rp);
                        break;
                }
            }
        });
        resolve(`'${data["code"]}' redeemed for ${ids.length} Players results in:<br><br>${success.length} Successfull<br>${received.length} Already received<br>${failed.length} Failed redemptions${debug ? (`<br><br>${Debugstring}`) : ""}`);
    });
    myPromise.then(d => {
        return res.send(d)
    }, rej => {
        return res.json({ message: rej })
    });
    const isType = <Type>(thing: any): thing is Type => true;
    const fetchPlayerRedeems = async <T>(url: string): Promise<T> => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            console.log(url, response.status);
            return JSON.parse(JSON.stringify({data:[{text:"error", code: CODE.TIMEOUT}]}));
        } catch (error) {
            console.error(`Error fetching from ${url}`);
            console.error(error);
            return JSON.parse(JSON.stringify({data:[{text:"error", code: CODE.TIMEOUT}]}));
        }
    }

}
