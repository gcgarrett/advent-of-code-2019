'use strict';

// require node modules
const fs = require('fs').promises;
const path = require('path');

// assume there's a file "input" in the current directory
const inputFilepath = path.join(__dirname, 'input');

// read the input file, assuming it is encoded in ASCII
fs.readFile(inputFilepath, { encoding: 'ascii' }).then((input) => {
	// convert the file contents from a string, assuming each module
	// mass is on a new line and is a valid number (we are very trusting
	// of the elves)
	const moduleMasses = input.split('\n').map(Number);

	// for a task like this, where we convert a set of anything into a
	// single value, the Array reduce function is best. take the array
	// of module masses and for each do the following calculation to
	// determine its fuel requirement:
	//   1. divide the mass by 3
	//   2. round down
	//   3. subtrace 2
	// and then add the result of that to the total
	const fuelRequirements = moduleMasses.reduce((total, moduleMass) => {
		let moduleFuelRequirement = Math.floor(moduleMass / 3) - 2;

		if (moduleFuelRequirement < 0) {
			moduleFuelRequirement = 0;
		}

		return total + moduleFuelRequirement;
	}, 0);

	// after running the fuel requirement calculation for each module,
	// print it out
	console.log(`Total fuel requirements are: ${fuelRequirements}`);
});
