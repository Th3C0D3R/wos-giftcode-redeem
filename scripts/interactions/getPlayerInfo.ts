import { InteractionResponseFlags } from "discord-interactions";
import { Md5 } from 'ts-md5'

export const getPlayerInfo = async (opt: any) => {
    const id = opt?.options[0]?.value ?? 0;
    var time = Date.now();
    var sig1 = Md5.hashStr(`fid=${id}&time=${time}tB87#kPtkxqOS2`);
    var response = await fetch("https://wos-giftcode-api.centurygame.com/api/player", {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-GPC": "1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://wos-giftcode.centurygame.com/",
        "body": `sign=${sig1}&fid=${id}&time=${time}`,
        "method": "POST",
        "mode": "cors"
    });
    if (response.status == 200) {
        var resJ = await response.json();
        let data = resJ.data;
        console.log(typeof data["fid"]);
        console.log(typeof id);
        if (data["fid"] == id) {
            var resIn = {
                type: 4,
                data: {
                    embeds: {
                        title: "User not found",
                        thumbnail: {
                            url: data["avatar_image"] ?? "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png",
                            height: 256,
                            width: 256
                        },
                        author: {
                            name: "WOS Player Searcher"
                        },
                        color: 39423,
                        description: "I found the player you are searching for:",
                        fields: [
                            {
                                name: "PlayerID",
                                value: id,
                                inline: true,
                            },
                            {
                                name: "Nickname",
                                value: data["nickname"] ?? "-----",
                                inline: true,
                            },
                            {
                                name: "State",
                                value: data["kid"] ?? "-----",
                                inline: true,
                            },
                            {
                                name: "Furnace Level",
                                value: (data["stove_lv"] > 30 ? `FC ${(data["stove_lv"] - 30) % 5}` : data["stove_lv"]) ?? "-----",
                                inline: true,
                            },

                        ]
                    },
                    flags: InteractionResponseFlags.EPHEMERAL
                }
            }
            
            return resIn;
        } 
        var resInNF = {
            type: 4,
            data: {
                embeds: {
                    title: "User not found",
                    thumbnail: {
                        url: "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png",
                        height: 256,
                        width: 256
                    },
                    author: {
                        name: "WOS Player Searcher"
                    },
                    color: 16729600,
                    description: "I did not found any player with this ID",
                    fields: {
                        name: "PlayerID:",
                        value: id
                    }
                },
                flags: InteractionResponseFlags.EPHEMERAL
            }
        }
        console.log(resInNF);
        return resInNF
    }
    console.log(await response.json());
    return {
        type: 4,
        data: {
            embeds: {
                title: "There was a problem!",
                thumbnail: {
                    url: "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png",
                    height: 256,
                    width: 256
                },
                author: {
                    name: "WOS Player Searcher"
                },
                color: 16729600,
                description: "Problem in the execution of the command",
                fields: {
                    name: "Response:",
                    value: JSON.stringify(await response.json())
                }
            },
            flags: InteractionResponseFlags.EPHEMERAL
        }
    }
}