import csv from 'csv-parser';
import { createReadStream, writeFileSync } from 'fs';
import promptSync from 'prompt-sync';

let prompt = promptSync({sigint: true});
let allContracts = new Map();

let network = process.argv[3];
let inputFile = process.argv[2];

createReadStream(inputFile)
    .pipe(csv())
    .on('data', (data) => {
        proc(data);
    })
    .on('end', () => {
        writeToFile();
    });

function proc(data) {
    let emptyTo = (data.To==="");
    let correctMethod = (data.Method==="0x60806040");
    let noError = (data.ErrCode==="");
    if (emptyTo && correctMethod && noError) {
        let address = data.ContractAddress;
        let block = data.Blockno;
        allContracts.set(address, block);
    }
}

function writeToFile() {
    let json = JSON.stringify(Array.from(allContracts.entries()));
    writeFileSync(`output/contracts.${network}.json`, json);
}