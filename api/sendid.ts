import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from "@vercel/postgres";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    var data = req.query;
    if (data["id"] === undefined && data["ids"] === undefined) return res.json({ status: 500, data: "NO PLAYER ID" });
    
    if (data["ids"] !== undefined) {
        var ids = JSON.parse(data["ids"] as string);
        for (let i = 0; i < ids.length; i++) {
            await sql`INSERT INTO ids (id)
            SELECT ${ids[i]}
            FROM ids
            WHERE NOT EXISTS (
                SELECT 1
                FROM ids
                WHERE id = ${ids[i]}
            );`;
        }
       
        return res.json({ status: 200, data: `IDs added` });
    } else {
        var idToAdd = data["id"] as string;
        const idsRow = await sql`SELECT id FROM ids WHERE id = ${idToAdd};`;
        if (idsRow.rowCount > 0) return res.json({ status: 302, data: `ID ${idToAdd} already added` });

        var result = await sql`INSERT INTO ids VALUES (${idToAdd}); `;
        if (result.rowCount >= 0) return res.json({ status: 200, data: `ID ${idToAdd} added` });
    }
    return res.json({ status: 500, data: `Failed to add` });
}