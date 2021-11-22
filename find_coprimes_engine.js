var currentCell = "a00";
var ROWS = 4;
var COLUMNS = 4;
var TABLE_LOC = "table_box";

// Variables to track which cells are currently under selection
var selection_1 = null;
var selection_2 = null;

// List of numbers for the game
var numbers = null;
var no_of_factors = null;
var shown_numbers = null;
var shown_index_from_original = null;
var original_index_from_shown = null;

// Set of all used prime factors
var chosen_factors = null;


// Gets a pool of prime factors to choose from. Saves that in the array chosen_factors.
function getPoolOfFactors() {
    // Get a list of prime numbers less than 200
    let list_of_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    let number_of_options = list_of_primes.length;

    let number_of_factors = ROWS*COLUMNS;
    chosen_factors = new Array(number_of_factors);
    let index = null;
    for (let k=0; k<number_of_factors; k++) {
        // 'index' has a higher chance of being a smaller number
        index = Math.floor(Math.pow(Math.random(), 1.5) * number_of_options);
        number_of_options -= 1;

        // Add the chosen entry to the array
        chosen_factors[k] = list_of_primes[index];

        // Remove that entry from the list.
        list_of_primes.splice(index, 1);
    }
    return;
}


/**
 * This function takes a certain power of a number and returns the result.
 * The power is between [1, 5] inclusive and is likely to be larger if the given number is smaller.
 * @param {number} factor: A number a power of which we will return
 */
function getPower(factor) {
    let max_exp = 5;
    if (factor > 30) {
        max_exp = 1;
    }
    else if (factor > 10) {
        max_exp = 2;
    }
    else if (factor > 6) {
        max_exp = 3;
    }
    else if (factor > 4) {
        max_exp = 4;
    }
    
    let final_exp = Math.ceil(Math.random() * max_exp);
    return Math.pow(factor, final_exp);
}


/**
 * This function goes through the global array 'chosen_factors' and 
 * generates a number by multiplying certain powers of the numbers in that array
 * starting from start_index and up until start_index + num_factors (with a loop around)
 * @param {*} start_index: the index in the chosen_factors array from which to start
 * @param {*} num_factors: The number of subsequent entries in the array to multiply
 * @param {*} length_of_array: length of the chosen_factors array
 * @returns a number
 */
function fetchANumber(start_index, num_factors, length_of_array) {
    var product = 1;
    let temp_val = 0;
    let j = 0;
    while (j<num_factors) {
        if (product > 30 && Math.random() > 0.8){
            break;
        }
        
        temp_val = product * getPower(chosen_factors[(start_index + j) % length_of_array]);
        if (temp_val > 999) {
            break;
        }

        product = temp_val;

        j += 1;
    }
    no_of_factors[start_index] = j;
    return product;
}


// Function to fill in numbers array with a scramble of coprime pairs
function setUpNumbers() {
    // Fill in the global array chosen_factors
    getPoolOfFactors();

    let total_factors = chosen_factors.length;
    let number_of_pairs = Math.floor(total_factors / 2);

    // Initialize the array of numbers
    let size_of_final_array = ROWS * COLUMNS;
    numbers = new Array(size_of_final_array);
    no_of_factors = new Array(size_of_final_array);
    
    for (let w=0; w<size_of_final_array; w++) {
        numbers[w] = fetchANumber(w, number_of_pairs, total_factors);
    }
    return;
}


function randomizeNumbers() {
    let array_length = numbers.length;
    shown_numbers = new Array(array_length);
    shown_index_from_original = new Array(array_length);
    original_index_from_shown = new Array(array_length);

    let indices = Array.from(Array(array_length), (_, index) => index);
    for (let k=0; k<array_length; k++) {
        let curr_len = indices.length;
        let picked_index = Math.floor(Math.random() * curr_len);

        shown_index_from_original[k] = indices[picked_index];
        original_index_from_shown[indices[picked_index]] = k;

        shown_numbers[indices[picked_index]] = numbers[k];

        indices.splice(picked_index, 1);
    }
    return;
}


function fillInNumbers() {
    let cell_id = null;
    for (let i=0; i<ROWS; i++) {
        for (let j=0; j<COLUMNS; j++) {
            cell_id = ("a" + i) + j;
            let item = document.getElementById(cell_id);
            let index = i*ROWS + j;
            item.innerHTML += shown_numbers[index];
        }
    }
}


// Performs the above 3 functions as well
function setUpGame() {
    setUpNumbers();
    randomizeNumbers();
    fillInNumbers();
}


// Applies 'passing' marker on cell with id currentCell. Called during onloading.
function startCellSelection() {
    var element = document.getElementById(currentCell);
    element.classList.add("passing");
};


// Applies the 'passing' marker on the cell with the given id, removes from previous cell
function passingMarker(some_id) {
    if (some_id == currentCell) {
        return;
    }
    else if (some_id != "") {
        // First fetch both the original cell and the one clicked on
        var old_item = document.getElementById(currentCell);
        var new_item = document.getElementById(some_id);

        // Unselect the old one; select the new one
        old_item.classList.remove("passing");

        currentCell = some_id;
        new_item.classList.add("passing");
    }
};


// Unselect all current selections
function unselect() {
    var selection_marker = "select";
    if (selection_1 != null) {
        item_1 = document.getElementById(selection_1);
        item_1.classList.remove(selection_marker);
        selection_1 = null;
    }
    if (selection_2 != null) {
        item_2 = document.getElementById(selection_2);
        item_2.classList.remove(selection_marker);
        selection_2 = null;
    }
    return;
}


// Applies the 'select' marker on a cell that has just been selected
function selectionMarker(some_id) {
    // TODO: Modify function. 2nd selection must do something.

    // If this is only an un-selection, unselect and return
    if (selection_1 == some_id || selection_2 == some_id) {
        unselect();
        return;
    }

    var selection_marker = "select";
    var clickedItem = document.getElementById(some_id);

    if (selection_1 == null) {
        selection_1 = some_id;
    }
    else if (selection_2 == null) {
        selection_2 = some_id;
    }
    else if (selection_1 != null && selection_2 != null) {
        // unselect the last selection. (shouldn't happen)
        unselect();
        selection_1 = some_id;
    }

    // Mark the selected entry
    clickedItem.classList.add(selection_marker);
};


document.onkeydown = function(e) {
    let curr_id = currentCell.split("");
    let row = parseInt(curr_id[1]);
    let col = parseInt(curr_id[2]);

    switch (e.keyCode) {
        case 37:
            new_col = (col + COLUMNS - 1) % COLUMNS;
            new_id = curr_id[0] + row + new_col
            break;
        case 38:
            new_row = (row + ROWS - 1) % ROWS;
            new_id = curr_id[0] + new_row + col;
            break;
        case 39:
            new_col = (col + COLUMNS + 1) % COLUMNS;
            new_id = curr_id[0] + row + new_col
            break;
        case 40:
            new_row = (row + ROWS + 1) % ROWS;
            new_id = curr_id[0] + new_row + col;
            break;
        // If the key is enter, select the current cell and return
        case 13:
            selectionMarker(currentCell);
            return;
    }

    passingMarker(new_id);
};


// Function to build the table
function createTable() {
    var div_box = document.getElementById(TABLE_LOC);
    var table_id = "my_table";
    div_box.innerHTML += "<table class=\"center\" id= \"" + table_id + "\">\n</table>";
    
    // Get the table and insert the rows and cols
    var my_table = document.getElementById(table_id);
    my_table.classList.add("center");
    for (let i=0; i<ROWS; i++) {
        var curr_row = my_table.insertRow(i);
        for (let j=0; j<COLUMNS; j++) {
            var curr_cell = curr_row.insertCell(j);
            var cell_id = ("a" + i) + j;
            curr_cell.innerHTML += '<div class="content" id=' + cell_id + ' onclick="selectionMarker(this.id)"></div>';
        }
    }
}


// Stuff you do upon onloading...
function onLoadingTasks() {
    createTable();
    startCellSelection();
    setUpGame();
}


window.onload = onLoadingTasks();
