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

// build a array of orbits, starting with the given object
// and work our way backwards to the Center of Mass (COM).
// we are only storing the parent objects, as our initial
// objects (SAN and YOU) represent Santa and ourselves, not
// planets.
function getOrbits(object, orbits = []) {
    // COM has no parent, so return the array of orbits
    if (object === 'COM') {
        return orbits;
    }

    // find the parent-child orbit where the given object
    // is the child, and then split the string on the )
    // character to get the parent object
    const [parentOrbit] = orbitsRaw.find((orbit) => {
        return orbit.endsWith(object);
    }).split(')');

    // push the parent object onto the array of orbits
    orbits.push(parentOrbit);

    // find parent object parent
    return getOrbits(parentOrbit, orbits);
}

// read the input file, assuming it is encoded in ASCII
fs.readFile(input, { encoding: 'ascii' }).then((body) => {
    // convert file body into an array of orbits
    orbitsRaw = body.split('\n');

    // get the list of orbits from Santa to COM
    const santaOrbits = getOrbits('SAN');
    // get the list of orbits from ourselves to COM
    const youOrbits = getOrbits('YOU');

    // reverse the list of orbits
    const santaFromCom = santaOrbits.reverse();
    const youFromCom = youOrbits.reverse();

    // now we want to find the object where Santa and ourselves
    // diverge

    let i = 0;

    // while the objects are equal (starting from COM), check
    // the next object in the orbit list
    while (santaFromCom[i] === youFromCom[i]) {
        ++i;
    }

    // we found where our path diverged from Santa's, so calculate
    // our distance and Santa's distance from that point
    const transfersToSharedObject = youFromCom.length - i;
    const transfersToSantaFromSharedObject = santaFromCom.length - i;

    // now add those values together to get the minimum orbital transfers
    const minimumOrbitalTransfers = transfersToSharedObject + transfersToSantaFromSharedObject;

    console.log(`Minimum orbital transfers is ${minimumOrbitalTransfers}`);
});
