var currentCell = "a00";
var ROWS = 4;
var COLUMNS = 4;
var NUM_FACTORS = 6;
var TABLE_LOC = "table_box";

// Used to see if selection has been completed.
var selection_count = 0;
var total_entries = ROWS * COLUMNS;

// Variables to track which cells are currently under selection
var selection_1 = null;

// List of numbers for the game
var numbers = null;
var shown_numbers = null;

// array to show with numbers have been marked...
var mark_indicator = null;

// at each index, holds the index of the coprime that entry was marked with.
var mark_counterpart = null;

// Set of all used prime factors
var chosen_factors = null;

var heading_message = "Select Coprimes!";

// Gets a pool of prime factors to choose from. Saves that in the array chosen_factors.
function getPoolOfFactors() {
    // Get a list of prime numbers less than 200
    let list_of_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    let number_of_options = list_of_primes.length;

    chosen_factors = new Array(NUM_FACTORS);
    let index = null;
    for (let k=0; k<NUM_FACTORS; k++) {
        // 'index' has a higher chance of being a smaller number
        index = Math.floor(Math.pow(Math.random(), 4) * number_of_options);
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
    if (final_exp == 0) {
        final_exp = 1;
    }
    return Math.pow(factor, final_exp);
}


/**
 * This function goes through the given array 'factors' and
 * generates a number by multiplying certain powers of the numbers in that array
 * @param {Array} factors: The array of factors
 * @returns a number
 */
function fetchSomeMultipleOfFactors (factors) {
    var product = 1;
    let temp_val = 0;
    let j = 0;
    while (j<factors.length) {
        if (product > 10 && Math.random() > 0.8){
            break;
        }
        
        temp_val = product * getPower(factors[j]);
        if (temp_val > 1000) {
            break;
        }

        product = temp_val;

        j += 1;
    }
    return product;    
}


/**
 * Given an array excerpt whose entries are all in initial_array, get another array 
 * with all the complements of excerpt.
 * @param {Array} initial_array 
 * @param {Array} excerpt 
 * @param {Array} ret_array : Pointer to an empty array to which we would add the compliments.
 */
function getComplement (initial_array, excerpt, ret_array) {
    if (ret_array.length != 0) {
        console.log("Bad Call to getComplement!");
    }
    for (let w=0; w<initial_array.length; w++) {
        if (excerpt.indexOf(initial_array[w]) == -1) {
            ret_array.push(initial_array[w]);
        }
    }
}


// Function to fill in numbers array with a scramble of coprime pairs
function setUpNumbers() {
    // Fill in the global array chosen_factors
    getPoolOfFactors();

    // Initialize the array of numbers
    numbers = new Array(NUM_FACTORS);
    
    // List all possible subsets of chosen_factors
    let combinations = [];
    let target = Math.floor(NUM_FACTORS/2);
    for (let k=0; k<NUM_FACTORS; k++) {
        if (combinations.length == 0) {
            combinations.push([]);
            combinations.push([chosen_factors[k]]);
        }
        else {
            let initial_len = combinations.length;
            for (j=0; j<initial_len; j++) {
                if (combinations[j].length >= target) {
                    continue;
                }
                if (NUM_FACTORS - k >= target-combinations[j].length) {
                    let clone = [...combinations[j]];
                    combinations.push(clone);
                }
                combinations[j].push(chosen_factors[k]);
            }
        }
    }

    // Now pick an entry in combinations, and then add both that and its compliment to the list of factorizations
    let initial_len = combinations.length;
    // initial_len must be larger than total_entries
    for (let k=0; k<total_entries; k+= 2) {
        let next_index = Math.floor(Math.random() * initial_len);
        let set_of_primes = combinations.splice(next_index, 1)[0];
        initial_len -= 1;
        
        let other_set = [];
        getComplement(chosen_factors, set_of_primes, other_set);

        numbers[k] = fetchSomeMultipleOfFactors(set_of_primes);
        numbers[k + 1] = fetchSomeMultipleOfFactors(other_set);
    }

    return;
}


function randomizeNumbers() {
    let array_length = numbers.length;
    shown_numbers = new Array(array_length);

    let indices = Array.from(Array(array_length), (_, index) => index);
    for (let k=0; k<array_length; k++) {
        let curr_len = indices.length;
        let picked_index = Math.floor(Math.random() * curr_len);

        shown_numbers[indices[picked_index]] = numbers[k];

        indices.splice(picked_index, 1);
    }
    // Set all numbers as unmarked.
    mark_indicator = new Array(array_length).fill(0);
    // Set all the counterpart indices to 0
    mark_counterpart = new Array(array_length).fill(-1);
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


// Executes the above 3 functions
function setUpGame() {
    setUpNumbers();
    randomizeNumbers();
    fillInNumbers();
}


/**
 * This function checks if the given numbers are coprime, given that
 * all the factors in both numbers are in the list 'chosen_factors'
 * @param {number} num1 
 * @param {number} num2 
 */
function areCoprime(num1, num2) {
    let factors_1 = [];
    // Get the factors of num1
    for (let i=0; i<chosen_factors.length; i++) {
        if (num1 % chosen_factors[i] == 0) {
            factors_1.push(chosen_factors[i]);
        }
    }
    // See if any of those factors are also factors of num2
    for (let i=0; i<factors_1.length; i++) {
        if (num2 % factors_1[i] == 0) {
            return false;
        }
    }
    // Otherwise, they are coprime.
    return true;
};


/**
 * Fetches the numeric index corresponding to the given cell id.
 * @param {string} id: Id of the form "aXY", where X, Y are row number, col number
 */
function getIndexFromId(id) {
    let id_ls = id.split("");
    let row = parseInt(id[1]);
    let col = parseInt(id[2]);
    return (row*ROWS) + col;
};


/**
 * This function does the opposite of the one before.
 * @param {number} index: A whole number less than ROWS*COLS 
 */
function getIdFromIndex(index) {
    if (index < 0 || index >= total_entries) {
        console.log("Bad call for getIdFromIndex");
        return;
    }
    let row = Math.floor(index / ROWS);
    let col = index % COLUMNS;
    return ("a" + row) + col;
}


// Applies 'passing' marker on cell with id currentCell. Called during onloading.
function startCellMarking() {
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


// Unselect the current selected entry
function unselect() {
    var selection_marker = "select";
    if (selection_1 != null) {
        item_1 = document.getElementById(selection_1);
        item_1.classList.remove(selection_marker);
        selection_1 = null;
    }
    return;
}


/**
 * This function tags a cell as "marked". Called when a pair of coprimes have been identified. 
 * It changes the background from default to the marked_background class, and sets the corresponding
 * entry in the marked_indicator array to be 1.
 * @param {string} cell_id: Id of the form "aXY", where X, Y are row number, col number 
 * @returns 
 */
function markCell (cell_id) {
    let id_val = getIndexFromId(cell_id);
    // If this cell has already been marked, return
    if (mark_indicator[id_val]) {
        return;
    }
    mark_indicator[id_val] = 1;
    let item = document.getElementById(cell_id);
    item.classList.remove("default_background");
    item.classList.add("marker_background");
    return;
}


/**
 * This function 'unmarks' a cell that has been marked, making it available for 
 * selection.
 * @param {string} cell_id: Id of the form "aXY", where X, Y are row number, col number 
 * @returns 
 */
function unmarkCell (cell_id) {
    let id_val = getIndexFromId(cell_id);
    // If this cell was not marked, return
    if (mark_indicator[id_val] == 0) {
        return;
    }
    mark_indicator[id_val] = 0;
    let item = document.getElementById(cell_id);
    item.classList.remove("marker_background");
    item.classList.add("default_background");
    return;
}


/**
 * Executed with each click on a cell, or when the Enter key has been hit.
 * @param {string} some_id: Id of the form "aXY", where X, Y are row number, col number
 * @returns 
 */
function selectionMarker(some_id) {
    // Set the passing marker here as well.
    passingMarker(some_id);

    let message_bar = document.getElementById("message_bar");

    // If this location has been marked already, do one of two things.
    let i2 = getIndexFromId(some_id);
    if (mark_indicator[i2]) {
        // If selection_1 is null, then unmark this and its counterpart.
        if (selection_1 == null) {
            selection_count -= 2;
            let other_index = mark_counterpart[i2];
            let other_id = getIdFromIndex(other_index);
            mark_counterpart[i2] = -1;
            mark_counterpart[other_index] = -1;
            // Unset the mark_indicator entries. Change the backgound colors accordingly
            unmarkCell(some_id);
            unmarkCell(other_id);
        }
        // Otherwise, do nothing until the selection indicator has been unselected
        else {
            message_bar.innerHTML += "<br>Error: Unselect you current (green) entry before unmarking!";
            setTimeout(function(){
                message_bar.innerHTML = heading_message;
            }, 2000);
        }
        return;
    }

    // If this is only an un-selection, unselect and return
    if (selection_1 == some_id) {
        unselect();
        return;
    }

    var selection_marker = "select";
    var clickedItem = document.getElementById(some_id);

    // If this is the first selection, just mark the cell as selected
    if (selection_1 == null) {
        selection_1 = some_id;
        clickedItem.classList.add(selection_marker);
        return;
    }

    // Otherwise, this is a second selection. See if the numbers are coprime. 
    let i1 = getIndexFromId(selection_1);
    if (areCoprime (shown_numbers[i1], shown_numbers[i2])) {
        markCell(selection_1);
        markCell(some_id);
        mark_counterpart[i1] = i2;
        mark_counterpart[i2] = i1;
        unselect();
        selection_1 = null;
        // If you are done, start a new game
        selection_count += 2;
        if (selection_count == total_entries) {
            selection_count = 0;
            startNewGame();
        }
        return;
    }

    // The numbers are not coprime. Flash an error signal for 1 sec.
    let item1 = document.getElementById(selection_1);
    let item2 = document.getElementById(some_id);
    unselect();
    let _ls = [item1, item2];
    for (let i=0; i<2; i++) {
        _ls[i].classList.remove("default_background");
        _ls[i].classList.add("flash_background");
    }
    setTimeout(function(){
        for (let i=0; i<2; i++) {
            _ls[i].classList.remove("flash_background");
            _ls[i].classList.add("default_background");
        }
    }, 1000);

    return;
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
    // First empty this box of any previously existing table
    div_box.innerHTML = "";
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
            curr_cell.innerHTML += '<div class="content default_background" id=' + cell_id + ' onclick="selectionMarker(this.id)"></div>';
        }
    }
}


// Stuff you do upon onloading...
function startNewGame() {
    createTable();
    startCellMarking();
    setUpGame();
}


window.onload = startNewGame();
