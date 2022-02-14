//index.js
function createTableRow(){
    var table = document.getElementById("myTable")
    var row = table.insertRow(0)
    var cell = row.insertCell(0)
    cell.innerHTML = "cell"
}

function deleteTableRow(){
    document.getElementById("myTable").deleteRow(0)
}

function createColumn(){
    var x = document.createElement("table")
    x.setAttribute("id", "myTable")
    document.body.appendChild(x)

    var y = document.createElement("tr")
    y.setAttribute("id", "myTr")
    document.getElementById("myTable").appendChild(y)

    var z = document.createElement("td")
    var t = document.createTextNode("cell")
    z.appendChild(t)
    document.getElementById("myTr").appendChild(z)
}