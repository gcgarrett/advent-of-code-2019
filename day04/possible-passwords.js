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
    
    // build a map to count how many instances of a digit occurs in the password
    const adjacentDigitsMap = digits.reduce((adjacentsMap, digit) => {
        adjacentsMap[digit] = (adjacentsMap[digit] || 0) + 1;

        return adjacentsMap;
    }, {});

    // filter out those digits that occur only once
    const adjacentDigitsCounts = Object.values(adjacentDigitsMap).filter((adjacentDigitCount) => {
        return (adjacentDigitCount > 1);
    });

    if (!(adjacentDigitsCounts.includes(2))) {
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
