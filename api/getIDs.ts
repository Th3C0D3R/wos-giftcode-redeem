import type { VercelRequest, VercelResponse } from '@vercel/node'
import ids from "../data/ids.json"

export default async function handler(req:VercelRequest, res: VercelResponse){
    return res.json(ids);
}