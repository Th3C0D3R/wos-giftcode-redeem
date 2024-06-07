import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse){
    var data = req.query;
    console.log(1);
    if (data["code"] === undefined) return res.json({ message: "NO CODE" });
    if (data["app"] === undefined) return res.json({ message: "NO application_id" });
    if (data["token"] === undefined) return res.json({ message: "NO token" });
    console.log(2);
    const giftcode = data["code"] ?? "";
    const appID = data["app"] ?? "";
    const token = data["token"] ?? "";
    var result = await fetch(`https://wgr.vercel.app/api/doList?code=${giftcode}`);
    console.log(3);
    var redeemResult = await result.text();
    console.log(4);
    await fetch(`https://discord.com/api/v10/webhooks/${appID}/${token}/messages/@original`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: redeemResult.replace("<br>","\n")
        })
    });
    console.log(5);
    return res.status(200).end();
}