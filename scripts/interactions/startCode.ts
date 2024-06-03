import { InteractionResponseFlags } from "discord-interactions";
import { returnError } from '../../utils/exceptions'

export const StartCode = async(opt: any)=>{
    const giftcode = opt?.options[0]?.value as string ?? "";
    if(giftcode == ""){
        return returnError("You did not provide a GiftCode")
    }
    var result = await fetch(`https://wgr.vercel.app/api/doList?code=${giftcode}`);
    var redeemResult = await result.text();

    return {
        type:4,
        data:{
            content: redeemResult ?? 'Failed to add IDs', 
            flags: InteractionResponseFlags.EPHEMERAL            
        }
    }
}