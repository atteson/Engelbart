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

function addEventListener( element, event, listener ) {
    element.addEventListener(event, listener);
    if( !element.hasOwnProperty("eventListeners")){
        element.eventListeners = new Map();
    }
    element.eventListeners.set( event, listener );
}

function select(event) {
    if( !(event.path[0].hasOwnProperty("eventListeners") && event.path[0].eventListeners.has("keyup")) &&
     active_element != undefined ) {
        switch(event.keyCode) {
            case 40:
                active_element.classList.remove("red");
                var parent = active_element.parentNode;
                var i = 0;
                while(parent.children[i] != active_element) {
                    i++;
                }
                if( i+1 < parent.children.length ) {
                    active_element = parent.children[i+1];
                    active_element.classList.add("red");
                }
                break;
            case 38:
                active_element.classList.remove("red");
                var parent = active_element.parentNode;
                var i = 0;
                while(parent.children[i] != active_element){
                    i++;
                }
                if( i > 1 ) {
                    active_element = parent.children[i-1];
                    active_element.classList.add("red");
                } else {
                    document.getElementById("operator").focus();
                }
                break;
        }
    }
}

addEventListener(document,"keyup",select);

function focus(event) {
    if( active_element !== undefined ) {
        active_element.classList.remove("red");
        active_element = undefined;
    }
}

addEventListener(document,"focusin",focus);

function addVariable(event) {
    if( event.keyCode == 13 ) {
        var newvariable = document.getElementById("newvariable");
        var variable = newvariable.value;

        newvariable.value = "";

        variables.set( tokenizer.push_string( variable ), variable );
    
        var variablesmath = document.getElementById("variablesmath");
        MathJax.typesetClear([variablesmath]);
        variablesmath.innerHTML = "$$" + Array.from(variables.values()).join(",") + "$$";
        MathJax.typeset([variablesmath]);}
}

addEventListener(document.getElementById("newvariable"),"keyup",addVariable);

function addOperator(event) {
    if( event.keyCode == 13 ) {
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
    } else if (event.keyCode== 40) {
        var operator = document.getElementById("operator");
        operator.blur();
        var rows = document.getElementById("operators").getElementsByTagName("tr");
        if( rows.length > 1) {
            rows[1].classList.add("red");
            active_element = rows[1];
        }
    }
}

addEventListener(document.getElementById("operator"),"keyup",addOperator);

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

