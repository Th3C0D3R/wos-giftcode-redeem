import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios';

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


    if(req.body["payer_email"] == undefined) return;
    if(req.body["mc_currency"] == undefined) return;
    if(req.body["mc_gross"] == undefined) return;
    //if(req.body["mc_gross_1"] == undefined) return;
    if(req.body["payment_date"] == undefined) return;
    //if(req.body["receiver_email"] == undefined) return;
    if(req.body["payment_type"] == undefined) return;
    if(req.body["custom"] == undefined) return;
    if(process.env.WEBHOOK == undefined) return;

    const config = {
        method: 'POST',
        body: JSON.stringify({
            "content": `Payment Type: ${req.body["payment_type"]}\n
            Amount: ${req.body["mc_gross"]}\n
            Currency: ${req.body["mc_currency"]}\n
            Payment Date: ${req.body["payment_date"]}\n
            Custom Message: ${req.body["custom"]}`,
            username: `${(req.body["test_ipn"] == "1" ? "[TEST]" : "")} ${req.body["payer_email"]}`,
        }),
        headers: { 'Content-Type': 'application/json' }
    }
    await axios(process.env.WEBHOOK,config);
}
/*
IPN Notification Event Received
IPN Notification Event received successfully.
[Object: null prototype] {
payment_type: 'instant',
payment_date: '15:17:09 May 30, 2024 PDT',
payment_status: 'Pending',
address_status: 'confirmed',
payer_status: 'verified',
first_name: 'Nico',
last_name: 'Fengler',
payer_email: 'buyer@paypalsandbox.com',
payer_id: 'TESTBUYERID01',
address_name: 'Nico Fengler',
address_country: 'United States',
address_country_code: 'US',
address_zip: '95131',
address_state: 'CA',
address_city: 'San Jose',
address_street: '123 any street',
business: 'seller@paypalsandbox.com',
receiver_email: 'seller@paypalsandbox.com',
receiver_id: 'seller@paypalsandbox.com',
residence_country: 'US',
shipping: '0',
tax: '0',
mc_currency: 'USD',
mc_fee: '0.66',
mc_gross: '12.34',
mc_gross_1: '12.34',
txn_id: '660708165',
notify_version: '2.1',
refund_reason_code: '',
receipt_id: '',
custom: 'xyz123',
invoice: 'abc1234',
test_ipn: '1',
verify_sign: 'AESvYaV-QRSkTAims0-yodcc8NRrAyzHVs9yiEZ.2AZUggw.qPW-y2nR'
}

*/