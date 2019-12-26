'use strict';

// require node modules
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// assume there's a file "input" in the current directory
const input = path.join(__dirname, 'input');

// create a readline interface to take input from the user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// the callback for readline.question does not follow the
// (error, ...) convention, so we can't use the node util
// promisify function. So return a new promise that only
// resolves with the value read from the commandline. Also
// resume and pause.
function questionAsync() {
    rl.resume();

    return new Promise((resolve, reject) => {
        rl.question('Input: ', (value) => {
            rl.pause();

            resolve(value);
        });
    });
}

// Opcodes
//
// 01 - add parameter 1 to parameter 2, writing to index at parameter 3
// 02 - multiply parameter 1 by parameter 2, writing to index at parameter 3
// 03 - read single integer as input, writing it to index at parameter 1
// 04 - write value of index at parameter 1
// 99 - halt the program (no parameters)

// Parameter modes
// * Stored in the same value as the opcode
// * In reverse order of parameters
// * Example: 1002
//     02 is the opcode
//      0 is the mode for the first parameter
//      1 is the mode for the second parameter
//      0 is the mode for the third parameter (omitted)
// * Write parameters will always be in position mode
//
// 0 - position mode: parameter is a position, so use value stored there or
//     write value to that position
// 1 - immediate mode: parameter is a value

async function run(program, index) {
    const instruction = program[index];

    const opcode = instruction % 100;
    const paramMode1 = Math.floor(instruction / 100) % 10;
    const paramMode2 = Math.floor(instruction / 1000) % 10;
    const paramMode3 = Math.floor(instruction / 10000) % 10;

    if (opcode === 99) {
        // halt the program
        return program.length;
    }
    else if (opcode === 1) {
        let read1 = program[index + 1];
        let read2 = program[index + 2];
        let write = program[index + 3];

        if (paramMode1 === 0) {
            read1 = program[read1];
        }
        
        if (paramMode2 === 0) {
            read2 = program[read2];
        }

        program[write] = read1 + read2;

        return index + 4;
    }
    else if (opcode === 2) {
        let read1 = program[index + 1];
        let read2 = program[index + 2];
        let write = program[index + 3];

        if (paramMode1 === 0) {
            read1 = program[read1];
        }
        
        if (paramMode2 === 0) {
            read2 = program[read2];
        }

        program[write] = read1 * read2;

        return index + 4;
    }
    else if (opcode === 3) {
        const write = program[index + 1];

        let value = await questionAsync();

        // convert value to a number
        value = Number(value);

        program[write] = value;

        return index + 2;
    }
    else if (opcode === 4) {
        let read = program[index + 1];

        if (paramMode1 === 0) {
            read = program[read];
        }

        console.log(`Log: ${read}`);

        return index + 2;
    }
    else {
        throw new Error(`Invalid opcode ${opcode}`);
    }
}

// read the input file, assuming it is encoded in ASCII
fs.readFile(input, { encoding: 'ascii' }).then(async (body) => {
    // convert file body into an array of values and convert those values
    // into numbers
    const program = body.split(',').map(Number);

    // start with the instruction at index 0
    let index = 0;

    while (index < program.length) {
        index = await run(program, index);
    }

    // close the streams
    rl.close();
});
