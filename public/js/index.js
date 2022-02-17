//index.js

age(); 

function age(){
    let xhr = new XMLHttpRequest();
    //xhr.open("GET", "/js/data.json");
    xhr.open("GET", "http://localhost:3001/football")
    xhr.onload = function(){
        let data = JSON.parse(this.response);
        createTable(data);
    }
    xhr.send();
}

function createTable(data){
    let appElement = document.getElementById("app");
    let aTable = document.createElement("table");
    appElement.appendChild(aTable);
    aTable.appendChild(createRow(data[0].name, data[0].points, data[0].logo));
    aTable.appendChild(createRow(data[1].name, data[1].points, data[1].logo));
    aTable.appendChild(createRow(data[2].name, data[2].points, data[2].logo));
    aTable.appendChild(createRow(data[3].name, data[3].points, data[3].logo));
}

function createRow(name, points, url){
    let aRow = document.createElement("tr");
    aRow.appendChild(createImageCell(url));
    aRow.appendChild(createCell(name));
    aRow.appendChild(createCell(points));
    return aRow;
}

function createCell(content){
    let aCell = document.createElement("td");
    aCell.innerHTML = content;
    return aCell;
}

function createImageCell(url){
    let aCell = document.createElement("td");
    let anImage = document.createElement("img");
    anImage.src=url;
    anImage.classList.add("tableLogo");
    aCell.appendChild(anImage);
    return aCell;
}