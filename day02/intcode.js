'use strict';

// require node modules
const fs = require('fs').promises;
const path = require('path');

// assume there's a file "input" in the current directory
const inputFilepath = path.join(__dirname, 'input');

// reset program to 1202 program alarm state
function reset(program) {
    program[1] = 12;
    program[2] = 2;

    return program;
}

// run the instruction at the given index
function runInstruction(program, instructionIndex) {
    // get the opcode, first input index, second input index, and the index to
    // write the result in
    const [opCode, inputIndexA, inputIndexB, writeIndex] = program.slice(instructionIndex, instructionIndex + 4);

    if (opCode === 1) {
        // if the opcode is 1, then we add the values at the input indices
        program[writeIndex] = program[inputIndexA] + program[inputIndexB];
    }
    else if (opCode === 2) {
        // if the opcode is 2, then we multiply the values at the input indices
        program[writeIndex] = program[inputIndexA] * program[inputIndexB];
    }
    else if (opCode === 99) {
        // if the opcode is 99, then we halt the program
    }
    else {
        // if the opcode is unknown, throw an error
        const err = new Error(`Something went wrong! ${opCode} is an invalid opcode!`);
        throw err;
    }

    return program;
}

// read the input file, assuming it is encoded in ASCII
fs.readFile(inputFilepath, { encoding: 'ascii' }).then((input) => {
    // convert file contents into intcode program
    let program = input.split(',').map(Number);

    // reset the program
    program = reset(program);

    // start with the instruction at index 0
    let instructionIndex = 0;

    // run the program until we encounter an opcode 99
    while (program[instructionIndex] !== 99) {
        // run the next instruction, getting the resulting program state
        program = runInstruction(program, instructionIndex);

        // increase the instruction index by 4
        instructionIndex += 4;
    }

    // print the result at index 0
    console.log(program[0]);
});
