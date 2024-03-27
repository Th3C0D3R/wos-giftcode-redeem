import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from "@vercel/postgres";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const idsRow = await sql`SELECT id FROM ids;`;
    const ids = idsRow.rows.map(x => x.id);
    return res.json({ "ids": ids });
}