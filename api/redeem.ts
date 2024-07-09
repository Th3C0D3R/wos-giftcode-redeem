import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Md5 } from 'ts-md5'

export enum CODE {
  TIMEOUT = 40004,
  TIME_ERROR = 40007,
  RECEIVED = 40008,
  SUCCESS = 20000,
  LOGIN_SUCCESS = "success",
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  var data = req.query;
  if (data["code"] === undefined) return res.json({ message: "NO CODE" });
  if (data["id"] === undefined) return res.json({ message: "NO PLAYERID" });

  var playerID = data["id"].toString();
  var code = data["code"].toString();
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

  return res.json({ message: msg.map(m => m["text"] ?? "").join("<br>") });

  async function login(id: string): Promise<string> {
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
  }

  async function redeemCode(id: string, code: string) {
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
  }
}
