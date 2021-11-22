var currentCell = "a00";
var ROWS = 4;
var COLUMNS = 4;
var TABLE_LOC = "table_box";

// Variables to track which cells are currently under selection
var selection_1 = null;
var selection_2 = null;


function startCellSelection() {
    var element = document.getElementById(currentCell);
    element.classList.add("passing");
}

// Applies the 'passing' marker on the cell with the given id, removes from previous cell
function passingMarker(some_id) {
    var clickedID = some_id;
    if (clickedID == currentCell) {
        return;
    }
    else if (clickedID != "") {
        // First fetch both the original cell and the one clicked on
        var old_item = document.getElementById(currentCell);
        var new_item = document.getElementById(clickedID);

        // Unselect the old one; select the new one
        old_item.classList.remove("passing");

        currentCell = clickedID;
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
}

window.onload = onLoadingTasks();
