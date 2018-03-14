
// variables are in the first list
// operators are in the second list
var items = [[],[]]
var itemnames = ["variable","operator"]
var itemmaths = []
var itemboxes = []

function addItem(i) {
    var newitem = document.getElementById( "new" + itemnames[i] )
    items[i].push( newitem.value )
    newitem.value = ""
    window.UpdateMath( i )
}

//
//  Use a closure to hide the local variables from the
//  global namespace
//
(function () {
    var QUEUE = MathJax.Hub.queue;  // shorthand for the queue
    var math = null, box = null;    // the element jax for the math output, and the box it's in

    //
    //  Hide and show the box (so it doesn't flicker as much)
    //
    var HIDEBOX = function (i) {itemboxes[i].style.visibility = "hidden"}
    var SHOWBOX = function (i) {itemboxes[i].style.visibility = "visible"}

    //
    //  Get the element jax when MathJax has produced it.
    //
    QUEUE.Push(function () {
	for( i in [1,2] ) {
	    itemmaths[i] = MathJax.Hub.getAllJax(itemnames[i] + "smath")[0];
	    itemboxes[i] = document.getElementById(itemnames[i] + "sbox");
	    SHOWBOX(i); // box is initially hidden so the braces don't show
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
})();
