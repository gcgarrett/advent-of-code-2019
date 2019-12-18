'use strict';

// require node modules
const fs = require('fs').promises;
const path = require('path');

// assume there's a file "input" in the current directory
const inputFilepath = path.join(__dirname, 'input');

// the fuel requirement for a module isn't just for its mass.
// any fuel you add to launch that module itself requires
// fuel to launch its mass. so calculate the fuel for a mass
// using the formula as before. if the result is less than
// or equal to 0, return 0. otherwise, return the necessary
// fuel for the given mass and then recursively calculate
// the fuel necessary to launch that fuel.
function calculateFuelRequirement(mass) {
    let fuelRequirement = Math.floor(mass / 3) - 2;

    if (fuelRequirement <= 0) {
        return 0;
    }
    else {
        return fuelRequirement + calculateFuelRequirement(fuelRequirement);
    }
}

// read the input file, assuming it is encoded in ASCII
fs.readFile(inputFilepath, { encoding: 'ascii' }).then((input) => {
	// convert the file contents from a string, assuming each module
	// mass is on a new line and is a valid number (we are very trusting
	// of the elves)
	const moduleMasses = input.split('\n').map(Number);

	// for a task like this, where we convert a set of anything into a
	// single value, the Array reduce function is best. take the array
    // of module masses and for each call calculateFuelRequirement and
    // then add the result of that to the total
	const fuelRequirements = moduleMasses.reduce((total, moduleMass) => {
		let moduleTotalFuelRequirement = calculateFuelRequirement(moduleMass);

		return total + moduleTotalFuelRequirement;
	}, 0);

	// after running the fuel requirement calculation for each module,
	// print it out
	console.log(`Total fuel requirements are: ${fuelRequirements}`);
});