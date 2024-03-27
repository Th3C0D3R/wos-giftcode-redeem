import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    var data = req.query;
    var url = "";
    var avatarurl = "https://cdn.discordapp.com/avatars/1217410093562335303/4d74c2f07d26efcf4559f980ab8f3f71.webp"
    if (data["id"] === undefined) return res.json({ status: 500, data: "NO PLAYER ID" });
    if (process.env.WEBHOOK === undefined) return res.json({ status: 500, data: "NO TARGET" });
    url = process.env.WEBHOOK;

    const reqData = {
        username: "PlayerIDHook",
        avatar_url: avatarurl,
        content: data["id"]
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqData)
    });

    if (response["readyState"] == 4 && (response.status == 200 || response.status == 204)) {
        const resData = await response.text() ?? "Successful transmitted";
        return res.json({ status: 200, data: resData });
    } else {
        const resData = await response.text() ?? "UNKNOWN";
        return res.json({ status: 500, data: resData });
    }

}