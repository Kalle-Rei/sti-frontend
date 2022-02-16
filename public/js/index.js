//index.js
// var counterTable = 0;
// var counterTr = 0;

// function newTableId() {
//     return "myTable" + counterTable++ + "";
// }

// function getLatestTableId() {
//     console.log("getLatestTableId(): " + "myTable" + (counterTable-1) + "");
//     return "myTable" + (counterTable-1) + "";
// }

// function newTrId() {
//     return "myTr" + counterTr++ + "";
// }

// function getLatestTrId(){
//     console.log("getLatestTrId(): " + "myTr" + (counterTr-1) + "");
//     return "myTr" + (counterTr-1) + "";
// }

// //@TODO: this probably shouldn't create new tables
// function createColumn(){
//     var x = document.createElement("table");
//     x.setAttribute("id", newTableId());
//     document.body.appendChild(x);

//     var y = document.createElement("tr");
//     y.setAttribute("id", newTrId());
//     document.getElementById(getLatestTableId()).appendChild(y);

//     var z = document.createElement("td");
//     var t = document.createTextNode("cell");
//     z.appendChild(t);
//     document.getElementById(getLatestTrId()).appendChild(z);
// }

// function createTableRow(){
//     var table = document.getElementById(getLatestTableId());
//     var row = table.insertRow(0);
//     var cell = row.insertCell(0);
//     cell.innerHTML = "cell";
//     counterTr++;
// }

// //@TODO: something here is decrementing either counterTr or counterTable below their actual values even though it shouldn't
// function deleteTableRow(){
//     document.getElementById(getLatestTableId()).deleteRow(0);
//     if(counterTr > 0) {
//         counterTr--;
//         console.log("deleteTableRow(): counterTr-- == " + counterTr);
//     }
//     else {
//         console.log("deleteTableRow(): counterTr == " + counterTr)
//     }
// }

function age(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/js/data.json");
    xhr.onload = function(){
        var data = JSON.parse(this.response);
        createTable(data);
    }
    xhr.send();
}

function createTable(data){
    var appElement = document.getElementById("app");
    var aTable = document.createElement("table");
    appElement.appendChild(aTable);
    aTable.appendChild(createRow(data[0].name, data[0].points));
    aTable.appendChild(createRow(data[1].name, data[1].points));
    aTable.appendChild(createRow(data[2].name, data[2].points));
    aTable.appendChild(createRow(data[3].name, data[3].points));
}

function createRow(name, points){
    var aRow = document.createElement("tr");
    aRow.appendChild(createCell(name));
    aRow.appendChild(createCell(points));
    return aRow;
}

function createCell(content){
    var aCell = document.createElement("td");
    aCell.innerHTML = content;
    return aCell;
}