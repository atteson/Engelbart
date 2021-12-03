
// variables are in the first list
// operators are in the second list

var variables = [];
var operators = [];
var rules = [];

function addVariable(event) {
    if( event.keyCode == 13 ) {
        var newvariable = document.getElementById("newvariable");
        var variable = newvariable.value;

        newvariable.value = "";

        variables.push( variable );

        var variablesmath = document.getElementById("variablesmath");
        MathJax.typesetClear([variablesmath]);
        variablesmath.innerHTML = "$$" + variables.join(",") + "$$";
        MathJax.typeset([variablesmath]);
    }
}

function addOperator(event) {
    if( event.keyCode == 13 ) {
        var newitem = document.getElementById( "newoperator" );
        operators.push( newitem.value );
        newitem.value = "";
        var table = document.getElementById( "operators" );
        var cell = table.insertRow().insertCell();
        cell.innerHTML = "$$" + operators[operators.length-1] + "$$";
        MathJax.typeset( [cell] );
    }
}

function addRule(event) {
    if( event.keyCode == 13 ) {
        var newitem = document.getElementById( "newrule" );
        rules.push( newitem.value );
        newitem.value = "";
        var table = document.getElementById( "rules" );
        var cell = table.insertRow().insertCell();
        cell.innerHTML = "$$" + rules[rules.length-1] + "$$";
        MathJax.typeset( [cell] );
    }
}
