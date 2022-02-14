// console.log("Initializing game")
// setTimeout(age, 3000)

// function age(){
//     console.log("Aging game")
//     setTimeout(age, 3000)
// }

// var anElement = document.createElement("strong")
// anElement.innerHTML = "Hello World"

// var app = document.getElementById("app")
// app.appendChild(anElement)

// var ettElement = document.getElementById("app")
// ettElement.innerHTML = "<button onclick='buttonClick()'>Click me</button>"

// function buttonClick(){
//     ettElement.outerHTML = "<strong>Kalle</strong>"
// }

// var tableTest = document.getElementById("myTable")
// var tableTest2 = document.getElementById("myTable")
// tableTest.innerHTML = "<button onclick='insertTableRow()'>Add row</button>"
// tableTest2.innerHTML = "<button onclick='deleteTableRow()'>Delete row</button>"

function insertTableRow(){
    var table = document.getElementById("myTable")
    var row = table.insertRow(0)
    var cell = row.insertCell(0)
    cell.innerHTML = "NEW CELL"
}

function deleteTableRow(){
    document.getElementById("myTable").deleteRow(0)
}

function makeTable(){
    var x = document.createElement("table")
    x.setAttribute("id", "myTable")
    document.body.appendChild(x)

    var y = document.createElement("tr")
    y.setAttribute("id", "myTr")
    document.getElementById("myTable").appendChild(y)

    var z = document.createElement("td")
    var t = document.createElement("cell")
    z.appendChild(t)
    document.getElementById("myTr").appendChild(z)
}