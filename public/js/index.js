console.log("Initializing game")
setTimeout(age, 3000)

function age(){
    console.log("Aging game")
    setTimeout(age, 3000)
}

var anElement = document.getElementById("app")
var anotherElement = document.createElement("strong")
anElement.innerHTML = "Hello World"
anElement.outerHTML = "Hello World"
anotherElement.innerHTML = "Hello World"