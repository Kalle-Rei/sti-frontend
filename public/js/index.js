//index.js

age();

function age() {
  let xhr = new XMLHttpRequest();
  //xhr.open("GET", "/js/data.json");
  //xhr.open("GET", "http://localhost:3001/football");
  //xhr.open("GET", "http://kalle-backend.herokuapp.com/football");
  //xhr.open("GET", "http://kalle-backend.herokuapp.com/hypnosismic")
  xhr.onload = function () {
    let data = JSON.parse(this.response);
    createTable(data);
  };
  xhr.send();
}