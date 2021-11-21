let currentSelection = "a11";

function startCellSelection() {
    var element = document.getElementById(currentSelection);
    element.classList.add("selected");
}

// Do this when a cell gets clicked on
function clickResponse(some_id) {
    var clickedID = some_id;
    if (clickedID == currentSelection) {
        return;
    }
    else if (clickedID != "") {
        // First fetch both the original cell and the one clicked on
        var old_item = document.getElementById(currentSelection);
        var new_item = document.getElementById(clickedID);

        // Unselect the old one; select the new one
        old_item.classList.remove("selected");

        currentSelection = clickedID;
        new_item.classList.add("selected");
    }
};

document.onkeydown = function(e) {
    curr_id = currentSelection.split("");
    row = parseInt(curr_id[1]);
    col = parseInt(curr_id[2]);

    switch (e.keyCode) {
        case 37:
            new_col = ((col + 3) % 5) + 1;
            new_id = curr_id[0] + row + new_col
            break;
        case 38:
            new_row = ((row + 3) % 5) + 1;
            new_id = curr_id[0] + new_row + col;
            break;
        case 39:
            new_col = ((col - 1) % 5) + 1;
            new_id = curr_id[0] + row + new_col
            break;
        case 40:
            new_row = ((row - 1) % 5) + 1;
            new_id = curr_id[0] + new_row + col;
            break;
    }

    clickResponse(new_id);
};

window.onload = startCellSelection();
