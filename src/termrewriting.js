var variables = []

function addVariable() {
    var newvariable = document.getElementById( "newvariable" )
    variables.push( newvariable.value )
    newvariable.value = ""
    window.UpdateMath()
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
    var HIDEBOX = function () {box.style.visibility = "hidden"}
    var SHOWBOX = function () {box.style.visibility = "visible"}

    //
    //  Get the element jax when MathJax has produced it.
    //
    QUEUE.Push(function () {
	math = MathJax.Hub.getAllJax("variablesmath")[0];
	box = document.getElementById("variablesbox");
	SHOWBOX(); // box is initially hidden so the braces don't show
    });

    //
    //  The onchange event handler that typesets the math entered
    //  by the user.  Hide the box, then typeset, then show it again
    //  so we don't see a flash as the math is cleared and replaced.
    //
    window.UpdateMath = function () {
	QUEUE.Push(
            HIDEBOX,
            ["resetEquationNumbers",MathJax.InputJax.TeX],
            ["Text",math,"\\displaystyle{"+variables.join()+"}"],
            SHOWBOX
	);
    }
})();
