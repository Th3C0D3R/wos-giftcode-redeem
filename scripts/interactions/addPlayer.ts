import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";

export const AddPlayer = async(opt: any)=>{
    const idsString = opt?.options[0]?.value as string ?? "";
    const ids = idsString.split(";") ?? [];

    var result = await fetch("https://wgr.vercel.app/api/sendid?ids=" + JSON.stringify(ids));
    result = await result.json();

    return {
        type:4,
        data:{
            content: result["data"] ?? 'Failed to add IDs', 
            flags: InteractionResponseFlags.EPHEMERAL            
        }
    }
}