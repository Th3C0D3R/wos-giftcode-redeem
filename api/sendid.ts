import type { VercelRequest, VercelResponse } from '@vercel/node'
import fs from "fs";
import path from "path";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    var data = req.query;
    if (data["id"] === undefined) return res.json({ status: 500, data: "NO PLAYER ID" });

    var idFile: string = path.join(process.cwd(), "data", 'ids.json');
    var ids: Array<number> = JSON.parse(fs.readFileSync(idFile, { encoding: "utf-8" })) ?? [];

    ids["ids"] = ids["ids"].concat([data["id"]]);
    ids["ids"].sort(function (a: number, b: number) {
        return a - b;
    });

    ids["ids"] = [...new Set(ids["ids"])];

    fs.writeFileSync(idFile, JSON.stringify(ids, null, 4));

    return res.json({ status: 200, data: "IDs added" });
}