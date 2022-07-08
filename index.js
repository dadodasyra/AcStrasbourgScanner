const { Worker } = require('node:worker_threads');
var errors = [];

console.log("Starting threads");
let base = 600;
_useWorker("./thread.js", 1, base, base+= 30).then(r => console.log("Thread 1 finished"));
_useWorker("./thread.js", 2, base, base+= 30).then(r => console.log("Thread 2 finished"));
_useWorker("./thread.js", 3, base, base+= 30).then(r => console.log("Thread 3 finished"));
console.log(base)


function _useWorker (filepath, threadIndex, base, goal) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(filepath)
        worker.postMessage({ "args": {threadIndex, base, goal}});

        worker.on('online', () => { console.log('Launching threads') })
        worker.on('message', messageFromWorker => {
            if(!messageFromWorker) return;

            if(messageFromWorker.toLowerCase().includes("good")) {
                console.log("%c"+threadIndex+": "+messageFromWorker, "color: green; font-size:50px");
            } else console.log(threadIndex+": "+messageFromWorker);
            return resolve
        })
        worker.on('error', reject)
        worker.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`))
            }
        })
    })
}


process.once('exit', () => {
    console.log('Exiting...');
    console.log(errors)
})