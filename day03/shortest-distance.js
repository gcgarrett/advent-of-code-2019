'use strict';

// require node modules
const fs = require('fs').promises;
const path = require('path');

// assume there's a file "input" in the current directory
const inputFilepath = path.join(__dirname, 'input');

// initialize a map where the key is a coordinate set `x,y`
// and the value is itself a map, where the key is the
// path name and the value is the total distance it took
// that path to get to that coordinate; we need to store
// distances in this way because a path might cross itself
// and we need to only count intersections between the
// input paths 
const points = {};

// this approach is memory intensive: every coordinate visited
// gets saved in the 'points' map. this most likely would not
// be performant for large sets.
function mapPath(pathName, path, x = 0, y = 0, totalDistance = 0) {
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

        totalDistance++;

        if (points[coordinates] && !(points[coordinates][pathName])) {
            points[coordinates][pathName] = totalDistance;
        }
        else {
            points[coordinates] = Object.assign({ [pathName]: totalDistance }, points[coordinates]);
        }
    }

    return mapPath(pathName, path.slice(1), x, y, totalDistance);
}

// read the input file, assuming it is encoded in ASCII
fs.readFile(inputFilepath, { encoding: 'ascii' }).then((input) => {
    const paths = input.split('\n');

    // map out the paths
    paths.forEach((path, index) => {
        return mapPath(`path${(index + 1)}`, path.split(','));
    });

    // find the intersections; an intersection is now marked by having
    // multiple path visits in the visited object
    const intersections = Object.entries(points).filter(([, visited]) => {
        return (Object.keys(visited).length > 1);
    });

    // calculate the total distance at the intersection
    const distances = intersections.map(([,visited]) => {
        // take the distances for all of the visited paths and sum them
        return Object.values(visited).reduce((total, distance) => {
            return total + distance;
        }, 0);
    });

    // print out the shortest distance
    console.log(Math.min(...distances));
});
