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

        console.log(req.body);

        res.status(200).end();
    }

   

}