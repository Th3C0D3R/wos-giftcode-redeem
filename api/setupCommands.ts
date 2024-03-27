import type { VercelRequest, VercelResponse } from '@vercel/node'


const discordHeaders = {
    Authorization: `Bot ${process.env.PRIVATE_DISCORD_BOT_TOKEN}`
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const url = `https://discord.com/api/v10/applications/${process.env.PRIVATE_DISCORD_ID}/commands`;
    var addPlayerPayload =
    {
        name: "addplayer",
        type: 1,
        description: 'Add Player(s) to the Redeem-List',
        options: [
            {
                "name": "ids",
                "description": "All PlayerIDs you want to add separated by a ';'",
                "type": 3,
                "required": true,
                "max_length": 6000
            }
        ]
    };
    var getPlayerInfoPayload = {
        name: "playerinfo",
        type: 1,
        description: 'Get all possible data from one player',
        options: [
            {
                "name": "id",
                "description": "the player-id you want the info",
                "type": 4,
                "required": true
            }
        ]
    }

    var results = await Promise.all(
        [
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": discordHeaders.Authorization
                },
                body: JSON.stringify(addPlayerPayload), // body data type must match "Content-Type" header
            }),
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": discordHeaders.Authorization
                },
                body: JSON.stringify(getPlayerInfoPayload), // body data type must match "Content-Type" header
            })
        ]);
    return res.json(results.map(async r => await r.json()));
}