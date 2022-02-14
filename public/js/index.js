// console.log("Initializing game")
// setTimeout(age, 3000)

// function age(){
//     console.log("Aging game")
//     setTimeout(age, 3000)
// }

var anElement = document.createElement("strong")
anElement.innerHTML = "Hello World"

var app = document.getElementById("app")
app.appendChild(anElement)

var ettElement = document.getElementById("app")
ettElement.innerHTML = "<button onclick='buttonClick()'>Click me</button>"

function buttonClick(){
    ettElement.outerHTML = "<strong>Kalle</strong>"
}