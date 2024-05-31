import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const sandbox = true;

/** Production Postback URL */
const PRODUCTION_VERIFY_URI = 'https://ipnpb.paypal.com/cgi-bin/webscr';
/** Sandbox Postback URL */
const SANDBOX_VERIFY_URI = 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr';

function getPaypalURI() {
    return sandbox ? SANDBOX_VERIFY_URI : PRODUCTION_VERIFY_URI;
}


export default async function POST(req: VercelRequest, res: VercelResponse) {
    console.log('IPN Notification Event Received');

    if (req.method !== 'POST') {
        console.error('Request method not allowed.');
        return res.status(405).send('Method Not Allowed');
    } else {
        console.log('IPN Notification Event received successfully.');

        const ipnTransactionMessage = req.body;

        // Build the body of the verification post message by prefixing 'cmd=_notify-validate'.
        const verificationBody = `cmd=_notify-validate&${req.body}`;

        console.log(`Verifying IPN: ${verificationBody}`);

        const verifyResponse = await axios({
            method: 'post',
            url: getPaypalURI(),
            data: verificationBody,
        });
        if (verifyResponse.status !== 200) {

            console.log(`Invalid IPN: IPN message for ID: ${ipnTransactionMessage.txn_id} failed with code ${verifyResponse.status}`);
            return res.json({ message: `Invalid IPN: IPN message for ID: ${ipnTransactionMessage.txn_id} failed with code ${verifyResponse.status}` });
        }

        if (verifyResponse.data !== 'VERIFIED') {

            console.error(`Invalid IPN: Message for ID: ${ipnTransactionMessage.txn_id} is invalid (${verifyResponse.data}).`);
            return res.json({ message: `Invalid IPN: Message for ID: ${ipnTransactionMessage.txn_id} is invalid (${verifyResponse.data}).` });
        }

        console.log(`Verified IPN: IPN message for ID: ${ipnTransactionMessage.txn_id} was verified.`);
        console.log(JSON.stringify(ipnTransactionMessage));


        res.status(200).end();
    }
}