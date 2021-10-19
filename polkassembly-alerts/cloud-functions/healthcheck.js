import fetch from 'node-fetch'
import { sendmail } from './utils.js'

const polkadot_network = process.env.POLKADOT_NETWORK || "https://polkadot.polkassembly.io/"
const kusama_network = process.env.KUSAMA_NETWORK || "https://kusama.polkassembly.io/"

const ERROR_MAIL_TEXT  = "Kusama or polkadot is down please check"
const ERROR_MAIL_SUBJECT = "Server down"

function networkCheck() {
    if (!kusama_network || !polkadot_network){
        text = "Kusama or polkadot environment variable not found";
        subject = "Environment not set";
        sendmail(text, subject);
        process.exit(0);
    }
}

async function main(){
    networkCheck();
    const [polkadot_healthcheck, kusama_healthcheck] = await Promise.all([await fetch(polkadot_network+'healthcheck'), await fetch(kusama_network+'healthcheck')]);
    if (!polkadot_healthcheck || !kusama_healthcheck){
        sendmail(ERROR_MAIL_TEXT, ERROR_MAIL_SUBJECT);
    }
    else{
        if(polkadot_healthcheck.statusText !== 'OK' || kusama_healthcheck.statusText !== 'OK'){
            sendmail(ERROR_MAIL_TEXT, ERROR_MAIL_SUBJECT);
        }
    }
    console.log("Kusama Status: ", kusama_healthcheck.statusText)
    console.log("Polkadot Status: ", polkadot_healthcheck.statusText)
}

main().catch(e => {console.error("Something went wrong with fetch please check servers"), sendmail(ERROR_MAIL_TEXT, ERROR_MAIL_SUBJECT)});
