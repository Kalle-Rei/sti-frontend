console.log("Initializing game")
setTimeout(age, 3000)

function age(){
    console.log("Aging game")
    setTimeout(age, 3000)
}

var anElement = document.getElementById("app")
anElement.innerHTML = "Hello World"
anElement.outerHTML = "Hello World"