let currentSelection = "11";

function startCellSelection() {
    var element = document.getElementById(currentSelection);
    element.classList.add("selected");
}

window.onload = startCellSelection();

// Do this when a cell gets clicked on
function clickResponse(some_id){
    var clickedID = some_id;
    console.log(clickedID);
    if (clickedID == currentSelection) {
        continue;
    }
    else if (clickedID != "") {
        // First fetch both the original cell and the one clicked on
        var old_item = document.getElementById(currentSelection);
        var new_item = document.getElementById(clickedID);

        // Unselect the old one; select the new one
        old_item.classList.remove(selected);
        new_item.classList.add(selected);
    }
}
