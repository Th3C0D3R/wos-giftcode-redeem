import type { VercelRequest, VercelResponse } from '@vercel/node'

interface RedeemResponse { text: string, code: number }
interface Data { data: RedeemResponse[] }

export default function handler(req: VercelRequest, res: VercelResponse) {
    var data = req.query;
    var debug = false
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
        var ids = [...new Set(resp["ids"])];
        var code = data["code"].toString();
        for (let i = 0; i < ids.length; i++) {
            let playerID = `${ids[i]}`;
            let p = fetchPlayerRedeems<RedeemResponse>(`https://wgr.vercel.app/api/redeem?id=${playerID}&code=${code}&useList=1`);
            proms.add(p);
        }
        var r:Data[]  = await Promise.all(proms) as Data[];
        var success: RedeemResponse[] = [], failed: RedeemResponse[] = [], received: RedeemResponse[] = [];
        var Debugstring = "";
        r.forEach(pr=> {
            var rp: RedeemResponse[] = []
            rp = pr.data.filter(m=>m["id"] === "redeem");
            if(debug){
                Debugstring += `${JSON.stringify(rp)} ==> ${rp["code"]} ${typeof rp["code"]}<br>`;
            }
            if (isType<RedeemResponse>(rp)) {
                switch (rp["code"]) {
                    case 1:
                    case 2:
                        success.push(rp);
                        break;
                    case 4:
                        received.push(rp);
                        break;
                    case 3:
                    case 5:
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
            throw new Error(`Network response was not ok for ${url}`);
        } catch (error) {
            console.error(error);
            throw new Error(`Error fetching from ${url}`);
        }
    }

}