'use strict';

// require node modules
const fs = require('fs').promises;
const path = require('path');

// assume there's a file "input" in the current directory
const input = path.join(__dirname, 'input');

// orbits input, where each value is a string representing
// an orbit: AAA)BBB
//   AAA is an object being orbited by another object BBB
let orbitsRaw = [];

// store orbits in an array, where each value is an array
// of objects, with index representing distance from COM
const orbits = [];

function getOrbits(object, distance) {
    // check that the distance has been initialized as an
    // array
    if (!Array.isArray(orbits[distance])) {
        orbits[distance] = [];
    }

    // push this object into the array for that distance
    orbits[distance].push(object);

    // now find all objects orbiting this one
    const objectOrbits = orbitsRaw.filter((orbit) => {
        return orbit.startsWith(object);
    }).map((orbit) => {
        const [, orbitingObject] = orbit.split(')');

        return orbitingObject;
    });

    // if there are no child orbits for this object, return
    if (objectOrbits.length === 0) {
        return;
    }

    // continue finding child orbits
    objectOrbits.forEach((orbitingObject) => {
        getOrbits(orbitingObject, distance + 1);
    });
}

// read the input file, assuming it is encoded in ASCII
fs.readFile(input, { encoding: 'ascii' }).then((body) => {
    // convert file body into an array of orbits
    orbitsRaw = body.split('\n');

    getOrbits('COM', 0);

    // we've built the array of orbits, now calculate the checksum
    const orbitCountChecksum = orbits.reduce((count, objects, distance) => {
        // if distance is 0, that's the Center of Mass (COM), which does
        // not figure into the calculation
        if (distance !== 0) {
            // otherwise, add the number of objects at this distance,
            // multiplied by the distance to get direct and indirect
            // orbits
            count += (objects.length * distance);
        }
        
        return count;
    }, 0);

    console.log(`Orbit Count Checksum: ${orbitCountChecksum}`);
});
