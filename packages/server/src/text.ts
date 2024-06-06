import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config();

const accountSid = process.env.TWILLIO_SID;
const authToken = process.env.TWILLIO_TOKEN;

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, message: string) {


  const res = await client.messages.create({
    body: message,
    from: '+18779347861',
    to: '+18777804236'
});

  console.log(res)
}