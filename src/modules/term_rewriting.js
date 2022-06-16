// variables are in the first list
// operators are in the second list

var variables = new Map();
var connectors = new Map();
var production_rules = [];
var associativities = [];
var rules = [];
var active_element;

import { SuffixTree } from "../modules/suffix_tree.js";
import "../submodules/MathJax-src/es5/tex-chtml.js"
var tokenizer = new SuffixTree( 255 );

function addKeyListener( element, key, listener ) {
    if( !element.hasOwnProperty("keyListeners")){
        element.keyListeners = new Map();
    }
    element.keyListeners.set( key, listener );
}

function checkAndRunKeyListener( element, key ) {
    if( element.hasOwnProperty( "keyListeners" ) && element.keyListeners.has( key ) ) {
        element.keyListeners.get( key )();
        return true;
    }
    return false;
}

function keyListener( event ) {
    if( !checkAndRunKeyListener( event.target, event.keyCode ) && active_element !== undefined ) {
        checkAndRunKeyListener( active_element, event.keyCode );
    }
}

document.addEventListener("keyup",keyListener);

var focusTagSet = new Set(["INPUT"]);

function activateFunction( from, to ) {
    return () => {
        if( focusTagSet.has( from.tagName )) {
            from.blur();
        } else {
            from.classList.remove("red");
            active_element = undefined;
        }
        if( focusTagSet.has( to.tagName )) {
            to.focus();
        } else {
            to.classList.add("red");
            active_element = to;
        }
    }
}

function focus(event) {
    if( active_element !== undefined ) {
        active_element.classList.remove("red");
        active_element = undefined;
    }
}

document.addEventListener("focusin",focus);

function addVariable() {
    var newvariable = document.getElementById("newvariable");
    var variable = newvariable.value;

    newvariable.value = "";

    variables.set( tokenizer.push_string( variable ), variable );

    var variablesmath = document.getElementById("variablesmath");
    MathJax.typesetClear([variablesmath]);
    variablesmath.innerHTML = "$$" + Array.from(variables.values()).join(",") + "$$";
    MathJax.typeset([variablesmath]);
}

addKeyListener(document.getElementById("newvariable"),13,addVariable);

function addOperator() {
    var newitem = document.getElementById( "operator" );
    var operator = newitem.value;

    newitem.value = "";

    var tokens = [];
    var i = 0;
    var [start, end, token] = tokenizer.find_next_string( operator, i );
    while( token != 0 ) {
        tokens.push(token);
        if( start > i ) {
            var substring = operator.substring( i, start - 1 );
            token = tokenizer.push_string( substring );
            connectors.set( token, substring );
            tokens.push(token);
        }
        i = end;
        [start, end, token] = tokenizer.find_next_string( operator, i );
    }
    if( end < operator.length ) {
        var substring = operator.substring( end, operator.length - 1);
        token = tokenizer.push_string( substring ); 
        connectors.set( token, substring );
        tokens.push( token );
        }

        production_rules.push( tokens );

    var table = document.getElementById( "operators" ).getElementsByTagName("tbody")[0];
    var row = document.createElement("tr");
    table.appendChild(row);
    var l = table.children.length;
    var neighbor = l == 2 ? newitem : table.children[l-1];

    addKeyListener( neighbor, 40, activateFunction( neighbor, row ));
    addKeyListener( row, 38, activateFunction( row, neighbor ));       

    row.setAttribute("class","outline");

    var operatorcell = document.createElement("td");
    row.appendChild(operatorcell);
    operatorcell.innerHTML = "$$" + operator + "$$";
    MathJax.typeset( [operatorcell] );

    var associativitycell = document.createElement("td");
    row.appendChild(associativitycell);
    associativitycell.innerHTML=`
        <select>
        <option value="left">left</option>
        <option value="right">right</option>
        </select>
    `;
    associativitycell.setAttribute("align","right");
}

addKeyListener(document.getElementById("operator"),13,addOperator);
