
// variables are in the first list
// operators are in the second list
//var items = [[],[],[]]
//var itemnames = ["variable","operator","rule"]
//var itemmaths = []
var itemboxes = []
//var itemcommas = [true,false,false]

var variables = []
var operators = []
var rules = []
var variablesmath
var variablesbox
var newvariable

function addVariable(event) {
    if( event.keyCode == 13 ) {
        var variable = newvariable.value

        newvariable.value = ""

        variables.push( variable )
        window.UpdateVariables()
    }
}

function addOperator(event) {
    if( event.keyCode == 13 ) {
        var newitem = document.getElementById( "newoperator" )
        operators.push( newitem.value )
        newitem.value = ""
        var table = document.getElementById( "operators" )
        var cell = table.insertRow().insertCell()
        cell.innerHTML = "$$" + operators[operators.length-1] + "$$"
        window.BuildMath( cell )
    }
}

function addRule(event) {
    if( event.keyCode == 13 ) {
        var newitem = document.getElementById( "newrule" )
        rules.push( newitem.value )
        newitem.value = ""
        var table = document.getElementById( "rules" )
        var cell = table.insertRow().insertCell()
        cell.innerHTML = "$$" + rules[rules.length-1] + "$$"
        window.BuildMath( cell )
    }
}

//
//  Use a closure to hide the local variables from the
//  global namespace
//
function init() {
    var QUEUE = MathJax.Hub.queue;  // shorthand for the queue

    //
    //  Hide and show the box (so it doesn't flicker as much)
    //
    var HIDEBOX = function (box) {box.style.visibility = "hidden"}
    var SHOWBOX = function (box) {box.style.visibility = "visible"}

    //
    //  Get the element jax when MathJax has produced it.
    //
    QUEUE.Push(function () {
        variablesmath = MathJax.Hub.getAllJax("variablesmath")[0]
        variablesbox = document.getElementById("variablesbox")
        newvariable = document.getElementById( "newvariable" )
        SHOWBOX(variablesbox)
    });

    //
    //  The onchange event handler that typesets the math entered
    //  by the user.  Hide the box, then typeset, then show it again
    //  so we don't see a flash as the math is cleared and replaced.
    //
    window.UpdateVariables = function () {
        QUEUE.Push(
                [HIDEBOX,variablesbox],
                ["resetEquationNumbers",MathJax.InputJax.TeX],
                ["Text",variablesmath,"\\displaystyle{"+variables.join()+"}"],
                [SHOWBOX,variablesbox]
        );
    }
    window.BuildMath = function (cell) {
        QUEUE.Push(
                ["resetEquationNumbers",MathJax.InputJax.TeX],
                ["Typeset",MathJax.Hub,cell],
        );
    }
}

init()

