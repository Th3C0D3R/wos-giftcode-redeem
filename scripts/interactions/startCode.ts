import { returnInteraction } from '../../utils/exceptions'

export const StartCode = async (opt: any, app_id: any, token: any) => {
    const giftcode = opt?.options[0]?.value as string ?? "";
    if (giftcode == "") {
        return returnInteraction("You did not provide a GiftCode")
    }
    var result = await fetch(`https://wgr.vercel.app/api/doList?code=${giftcode}`);
    var redeemResult = await result.text();
    console.log(app_id,token);
    await fetch(process.env.WEBHOOK_PRIV as string, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: redeemResult
        })
    });
}