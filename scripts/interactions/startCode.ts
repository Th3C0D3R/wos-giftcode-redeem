import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse){
    var data = req.query;
    if (data["code"] === undefined) return res.json({ message: "NO CODE" });
    if (data["app"] === undefined) return res.json({ message: "NO application_id" });
    if (data["token"] === undefined) return res.json({ message: "NO token" });
    const giftcode = data["code"] ?? "";
    const appID = data["app"] ?? "";
    const token = data["token"] ?? "";
    var result = await fetch(`https://wgr.vercel.app/api/doList?code=${giftcode}`);
    var redeemResult = await result.text();
    await fetch(`https://discord.com/api/v10/webhooks/${appID}/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: redeemResult
        })
    });
}
export const StartCode = async (opt: any) => {
    
}