'use strict';

const sixDigitNumberRegExp = /[0-9]+/;

// read in the range parameters from the commandline
let [,, start, end] = process.argv;

start = Number(start);
end = Number(end);

function isValid(password) {
    if (!(sixDigitNumberRegExp.test(password))) {
        // password is not a six digit number
        return 0;
    }

    const digits = Array.from(password);

    const increasingOrder = digits.sort();

    if ((increasingOrder.join('')) !== password) {
        // the digits are not in increasing order, so this is an invalid
        // password
        return 0;
    }
    

    const adjacentDigits = digits.reduce((adjacents, digit, index, parent) => {
        if (parent[index + 1] === digit) {
            adjacents.push(digit);
        }

        return adjacents;
    }, []);

    if (adjacentDigits.length === 0) {
        // there is no set of two adjacent digits, so this is an invalid
        // password
        return 0;
    }

    return 1;
}

let count = 0;

for (let password = start; password <= end; password++) {
    count += isValid(password.toString());
}

console.log(`Total number of valid passwords in the range ${start} to ${end}: ${count}`);
