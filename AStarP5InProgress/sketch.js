function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    // Calculate euclidian distance using p5
    var d = dist(a.i, a.j, b.i, b.j);
    return d;
}

// Class to describe a cell in the grid
function Cell(i, j) {
    this.i = i;
    this.j = j;

    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.previous = undefined;

    this.addNeighbours = function(grid) {
        if (this.i < cols - 1) {
            this.neighbours.push(grid[this.i + 1][this.j]);
        }

        if (this.i > 0) {
            this.neighbours.push(grid[this.i - 1][this.j]);
        }

        if (this.j < cols - 1) {
            this.neighbours.push(grid[this.i][this.j + 1]);
        }

        if (this.j > 0) {
            this.neighbours.push(grid[this.i][this.j - 1]);
        }
    }

    this.show = function(col) {
        fill(col);
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }
}

var cols, rows;
cols = 10;
rows = 10;

// To solve scaling issues
var w, h;

var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;

var path = [];

function setup() {
    console.log("Volt's demonstration of the A* pathfinding algorithm in p5.js");

    createCanvas(600, 600);

    w = width / cols;
    h = height / rows;

    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    openSet.push(start);

    console.log(grid)
}

// Display cells in the openSet as green
function showOpenSet() {
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }
}

// Display cells in the closedSet as red
function showClosedSet() {
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }
}

// Display cells in the closedSet as blue
function showPath() {
    for (var i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
    }
}

function draw() {
    if (openSet.length > 0) {
        // Continue the algorithm

        var lowestIndex = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        var current = openSet[lowestIndex];

        if (current === end) {
            // Finding and obtaining the path
            // Draw the similarity between this and backtracking through a singly linked list 
            var temp = current;
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }

            console.log("DONE!");
        }

        // openSet.remove(current); doesnt actually exist. Making a new function to remove an element from the array instead
        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbours = current.neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];

            if (!closedSet.includes(neighbour)) {
                // The amount of steps to get to a node is the number of steps it took to reach current + 1
                var tempGScore = current.g + 1;

                // Check if we reach the same G score by a more efficient path through another node in the openSet
                if (openSet.includes(neighbour)) {
                    if (tempGScore < neighbour.g) {
                        neighbour.g = tempGScore;
                    }
                } else {
                    neighbour.g = tempGScore;
                    openSet.push(neighbour);
                }

                // Calculate using heuristic function the best path
                // Making an educated guess on how long it will take to get from neighbour to the end
                // The heuristic we use will be the normal euclidian heuristic
                neighbour.h = heuristic(neighbour, end);

                // Calculate the score of the node using f(x) = g(x) + h(x)
                neighbour.f = neighbour.g + neighbour.h;

                // Tracing back the optimal path
                neighbour.previous = current;
            }
        }

    } else {
        // No solution
    }

    background(255);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(255);
        }
    }

    showClosedSet();
    showOpenSet();
    showPath();
}