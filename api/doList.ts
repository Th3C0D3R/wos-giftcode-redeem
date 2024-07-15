import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Md5 } from 'ts-md5'

interface RedeemResponse { text: string, code: number }
interface Data { data: RedeemResponse[] }

export enum CODE {
    TIMEOUT = 40004,
    TIME_ERROR = 40007,
    RECEIVED = 40008,
    SUCCESS = 20000,
    LOGIN_SUCCESS = "success",
}

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

        var r: Data[] = [];
        for (let i = 0; i < ids.length; i++) {
            let playerID = `${ids[i]}`;
            console.log(`${i + 1}/${ids.length}`);
            let p = doRedeem(playerID, code);
            proms.add(p);
        }

        var r: Data[] = await Promise.all(proms) as Data[];

        var success: RedeemResponse[] = [], failed: RedeemResponse[] = [], received: RedeemResponse[] = [];
        var Debugstring = "";
        r.forEach(pr => {
            if (pr === undefined) return;
            var rp: RedeemResponse = pr.data.filter(m => m["id"] === "redeem")[0] ?? pr.data.filter(m => m["id"] === "login")[0];
            if (rp === undefined || rp["code"] === undefined) return;
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


    async function doRedeem(playerID: string, code: string) {
        var msg: object[] = [];
        var log = await login(playerID);
        if (log["msg"]?.toLowerCase() !== CODE.LOGIN_SUCCESS) {

            msg.push({ id: "login", text: `Login ${playerID}: ${log["msg"] ?? "ERROR"}`, code: 5, orgCode: log["code"] });

        } else {

            msg.push({ id: "login", text: `Login ${playerID}: ${log["msg"] ?? "ERROR"}`, code: 3, orgCode: log["code"] });

            var [statusCode, text] = await redeemCode(playerID, code);
            console.debug([statusCode, text]);
            if (statusCode === CODE.TIMEOUT) {
                [statusCode, text] = await redeemCode(playerID, code);
                console.debug([statusCode, text]);
                if (statusCode === CODE.SUCCESS) {
                    msg.push({ id: "redeem", text: `Redeemed ${code} for ${playerID}: ${text}`, "code": statusCode })
                }
                else if (statusCode === CODE.RECEIVED) {
                    msg.push({ id: "redeem", text: `Redeemed ${code} for ${playerID}: ${text}`, "code": statusCode });
                }
                else {
                    msg.push({ id: "redeem", text: `2. Try Redeem ${code} for ${playerID}: ${text}`, "code": statusCode });
                }
            }
            else if (statusCode === CODE.SUCCESS) {
                msg.push({ id: "redeem", text: `Redeemed ${code} for ${playerID}: ${text}`, "code": statusCode });
            }
            else {
                msg.push({ id: "redeem", text: `Redeemed ${code} for ${playerID}: ${text}`, "code": statusCode });
            }
            console.log(`${log["data"]["nickname"]} (${log["data"]["fid"]} | ${log["data"]["kid"]}) | Code: ${statusCode}`);
        }

        return { data: msg };
    }
    async function login(id: string): Promise<string> {
        try {
            var time = Date.now();
            var sig1 = Md5.hashStr(`fid=${id}&time=${time}tB87#kPtkxqOS2`);
            var response = await fetch("https://wos-giftcode-api.centurygame.com/api/player", {
                "credentials": "omit",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-site",
                    "Sec-GPC": "1",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache"
                },
                "referrer": "https://wos-giftcode.centurygame.com/",
                "body": `sign=${sig1}&fid=${id}&time=${time}`,
                "method": "POST",
                "mode": "cors"
            });
            if (response.status !== 200) return "ERROR";
            var resJ = await response.json();
            return resJ ?? "ERROR";
        } catch (error) {
            return error;
        }

    }
    async function redeemCode(id: string, code: string) {
        try {
            var time = Date.now();
            var sig2 = Md5.hashStr(`cdk=${code}&fid=${id}&time=${time}tB87#kPtkxqOS2`);
            var response = await fetch("https://wos-giftcode-api.centurygame.com/api/gift_code", {
                "credentials": "omit",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Sec-GPC": "1",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-site"
                },
                "referrer": "https://wos-giftcode.centurygame.com/",
                "body": `sign=${sig2}&fid=${id}&cdk=${code}&time=${time}`,
                "method": "POST",
                "mode": "cors"
            });
            if (response.status !== 200) return (CODE.TIMEOUT, response.statusText);
            var resJ = await response.json();
            return [resJ["err_code"] ?? "ERROR", resJ["msg"]];
        } catch (error) {
            return (CODE.TIME_ERROR, error);
        }

    }
}

