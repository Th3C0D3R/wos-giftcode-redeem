import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from "@vercel/postgres";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    var data = req.query;
    if (data["id"] === undefined) return res.json({ status: 500, data: "NO PLAYER ID" });
    var idToAdd = data["id"] as string;
    const idsRow = await sql`SELECT id FROM ids WHERE id = ${idToAdd};`;
    if(idsRow.rowCount > 0) return res.json({ status: 200, data: `ID ${idToAdd} already added` });

    var result = await sql`INSERT INTO ids VALUES (${idToAdd}); `
    if(result.rowCount >= 0) return res.json({ status: 200, data: `ID ${idToAdd} added` });
    return res.json({ status: 500, data: `SQL failed to add ID ${idToAdd}` });
}