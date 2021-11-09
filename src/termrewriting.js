
// variables are in the first list
// operators are in the second list
var items = [[],[],[]]
var itemnames = ["variable","operator","rule"]
var itemmaths = []
var itemboxes = []
var itemcommas = [true,false,false]

function addItem(event, i) {
    if( event.keyCode == 13 ) {
        var newitem = document.getElementById( "new" + itemnames[i] )
        items[i].push( newitem.value )
        newitem.value = ""
        if( itemcommas[i] ) {
            window.UpdateMath( i )
        } else {
            var table = document.getElementById( itemnames[i] + "s" )
            var cell = table.insertRow().insertCell()
            cell.innerHTML = "$$" + items[i][items[i].length-1] + "$$"
            window.BuildMath( i, cell )
        }
    }
}

function addCell(event, i) {
    if( event.keyCode == 13 ) {
	var newitem = document.getElementById( "new" + itemnames[i] )
	items[i].push( newitem.value )
	newitem.value = ""
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
    var HIDEBOX = function (i) {itemboxes[i].style.visibility = "hidden"}
    var SHOWBOX = function (i) {itemboxes[i].style.visibility = "visible"}

    //
    //  Get the element jax when MathJax has produced it.
    //
    QUEUE.Push(function () {
        for( i=0; i < itemnames.length; i++ ) {
            if( itemcommas[i] ) {
                itemmaths.push( MathJax.Hub.getAllJax(itemnames[i] + "smath")[0] );
                itemboxes.push( document.getElementById(itemnames[i] + "sbox") );
                SHOWBOX(i); // box is initially hidden so the braces don't show
            } else {
                itemmaths.push( null )
                itemboxes.push( null )
            }
        }
    });

    //
    //  The onchange event handler that typesets the math entered
    //  by the user.  Hide the box, then typeset, then show it again
    //  so we don't see a flash as the math is cleared and replaced.
    //
    window.UpdateMath = function (i) {
        QUEUE.Push(
                [HIDEBOX,i],
                ["resetEquationNumbers",MathJax.InputJax.TeX],
                ["Text",itemmaths[i],"\\displaystyle{"+items[i].join()+"}"],
                [SHOWBOX,i]
        );
    }
    window.BuildMath = function (i, cell) {
        QUEUE.Push(
                ["resetEquationNumbers",MathJax.InputJax.TeX],
                ["Typeset",MathJax.Hub,cell],
        );
    }
}

init()

