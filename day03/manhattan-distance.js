'use strict';

// require node modules
const fs = require('fs').promises;
const path = require('path');

// assume there's a file "input" in the current directory
const inputFilepath = path.join(__dirname, 'input');

// initialize a map where the key is a coordinate set `x,y`
// and the value is either the path number that has visted
// those coordinates or 'x' if more than one path has visited
// it
const points = {};

// this approach is memory intensive: every coordinate visited
// gets saved in the 'points' map. this most likely would not
// be performant for large sets.
function mapPath(pathNumber, path, x = 0, y = 0) {
    if (path.length === 0) {
        return;
    }

    // get the next step
    const [step] = path;

    // direction is either U(p), R(ight), D(own), or L(eft)
    // distance is a number after the direction letter
    let [,direction,distance] = /(U|R|D|L)([0-9]+)/.exec(step);

    // convert distance to a number
    distance = Number(distance);

    for (let i = 1; i <= distance; i++) {
        switch (direction) {
            // if direction is up, increase the y coordinate
            case 'U':
                y++;
                break;
            // if direction is right, increase the x coordinate
            case 'R':
                x++;
                break;
            // if direction is down, decrease the y coordinate
            case 'D':
                y--;
                break;
            // if direction is left, decrease the x coordinate
            case 'L':
                x--;
                break;
        }

        const coordinates = `${x},${y}`;

        if (points[coordinates] && (points[coordinates] !== pathNumber)) {
            console.log(`Coordinates ${coordinates} crossed by another path!`);
            // if the coordinates were visited by another path, then
            // mark it with an 'x'
            points[coordinates] = 'x';
        }
        else {
            // if the coordinates have not been visited yet, then
            // mark it with the path number
            points[coordinates] = pathNumber;
        }
    }

    return mapPath(pathNumber, path.slice(1), x, y);
}

// read the input file, assuming it is encoded in ASCII
fs.readFile(inputFilepath, { encoding: 'ascii' }).then((input) => {
    const paths = input.split('\n');

    // map out the paths
    paths.forEach((path, index) => {
        mapPath((index + 1), path.split(','));
    });

    // find the intersections (marked by 'x')
    const intersections = Object.entries(points).filter(([, visited]) => {
        return (visited === 'x');
    });

    // calculate the Manhattan distance at the intersections
    const distances = intersections.map(([coordinates]) => {
        const [x, y] = coordinates.split(',').map(Number);

        // add the absolute values of the x and y coordinates
        return Math.abs(x) + Math.abs(y);
    });

    // print out the shortest distance
    console.log(Math.min(...distances));
});
