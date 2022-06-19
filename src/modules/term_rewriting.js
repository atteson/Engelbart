// variables are in the first list
// operators are in the second list

var variables = new Map();
var connectors = new Map();
var production_rules = [];
var associativities = [];
var rules = [];
var active_element = undefined;

import { SuffixTree } from "../modules/suffix_tree.js";
import "../submodules/MathJax-src/es5/tex-chtml.js"
var tokenizer = new SuffixTree( 255 );

function addKeyListener( element, key, listener ) {
    if( !element.hasOwnProperty("keyListeners")){
        element.keyListeners = new Map();
    }
    element.keyListeners.set( key, listener );
}

function objectMapHas( object, key1, key2 ) {
    return object.hasOwnProperty( key1 ) && object[key1].has( key2 );
}

function checkAndRunKeyListener( element, key ) {
    if( objectMapHas( element, "keyListeners", key ) ) {
        element.keyListeners.get( key )();
        return true;
    }
    return false;
}

var focusTagSet = new Set(["INPUT"]);

function activate( from, to ) {
    if( focusTagSet.has( from.tagName )) {
        from.blur();
    } else {
        from.classList.remove("red");
    }
    if( focusTagSet.has( to.tagName )) {
        to.focus();
    } else {
        to.classList.add("red");
    }
    active_element = to;
}

function addNeighbor( object, key, neighbor ) {
    if( !object.hasOwnProperty( "neighbors" ) ) {
        object.neighbors = new Map();
    }
    object.neighbors.set( key, neighbor );
}

function keyListener( event ) {
    var key = event.keyCode;
    if( objectMapHas( active_element, "keyListeners", key ) ) {
        active_element.keyListeners.get( key )();
    } else if( key >= 37 && key <= 40 && objectMapHas( active_element, "neighbors", key )) {
        activate( active_element, active_element.neighbors.get( key ) );
    }
}

document.addEventListener("keyup",keyListener);

function focus(event) {
    if( active_element !== undefined ) {
        active_element.classList.remove("red");
    }
    active_element = event.target;
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
    var neighbor = l == 2 ? newitem : table.children[l-2];

    addNeighbor( neighbor, 40, row );
    addNeighbor( row, 38, neighbor );       

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
