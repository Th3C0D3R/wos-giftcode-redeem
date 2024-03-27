import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from "@vercel/postgres";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    var data = req.query;
    if (data["id"] === undefined) return res.json({ status: 500, data: "NO PLAYER ID" });

    var ids = await sql`SELECT * FROM ids`;
    console.log(ids)
    return res.json({ status: 200, data: "IDs added" });
    ids["ids"] = ids["ids"].concat([data["id"]]);
    ids["ids"].sort(function (a: number, b: number) {
        return a - b;
    });

    ids["ids"] = [...new Set(ids["ids"])];


    return res.json({ status: 200, data: "IDs added" });
}