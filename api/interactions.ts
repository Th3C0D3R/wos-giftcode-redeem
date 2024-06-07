import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
    InteractionType,
    InteractionResponseType,
    verifyKey
} from 'discord-interactions'
import { ValidationException, UnhandledData,returnInteraction, returnAckn, sleep } from '../utils/utils'
import { IncomingHttpHeaders } from 'http'
import { AddPlayer } from '../scripts/interactions/addPlayer'
import { getPlayerInfo } from '../scripts/interactions/getPlayerInfo'

const verifySig = async (body: any, header: IncomingHttpHeaders) => {
    const sig = header["x-signature-ed25519"] as string;
    const timestamp = header["x-signature-timestamp"] as string;
    const isValid = verifyKey(JSON.stringify(body), sig, timestamp, process.env.PRIVATE_DISCORD_PUBLIC_KEY!)
    if (!isValid) {
        throw new ValidationException("Invalid request signature", 401);
    }
}

const handleResponse = async (body: any) => {
    const { type, data, member, application_id, token } = body;

    if (type === InteractionType.PING) {
        return { type: InteractionResponseType.PONG };
    }
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;
        switch (name) {
            case "addplayer":
                return await AddPlayer(data);
            case "playerinfo":
                return await getPlayerInfo(data);
            case "startcode":
                if (member?.user?.id !== '741313602379841661') {
                    console.log(`Unauthorized trigger of "startCode" with ID: ${member?.user?.id}`);
                    return returnInteraction(`You have no permission to execute the interaction!`);
                }
                var giftcode = data?.options[0]?.value as string ?? "";
                //console.log(`\nhttps://wgr.vercel.app/api/startCode?code=${giftcode}&app=${application_id}&token=${token}\n`);
                fetch(`https://wgr.vercel.app/api/startCode?code=${giftcode}&app=${application_id}&token=${token}`);
                await sleep(2500);
                return returnAckn(`The process has started...\nA message will send as soon as the process has finished`);
            default:
                throw new UnhandledData("Unhandled Data", 401);
        }
    }
}

export default async function POST(req: VercelRequest, res: VercelResponse) {
    try {
        await verifySig(req.body, req.headers);
        var resJSON = await handleResponse(req.body);
        res.json(resJSON);
    } catch (e: any) {
        console.error("Error found: ", e?.message);
        if (e.errorType === "Validation" || e.errorType === "UnhandledData") {
            res.status = e.status;
            return res.json({ message: e.message });
        }

    }
}