// variables are in the first list
// operators are in the second list

var variables = new Map();
var connectors = new Map();
var production_rules = [];
var associativities = [];
var rules = [];

import { SuffixTree } from "../modules/suffix_tree.js";
import "../submodules/MathJax-src/es5/tex-chtml.js"
var tokenizer = new SuffixTree( 255 );

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

document.getElementById("newvariable").addEventListener("keyup",addVariable);

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
    }
}

document.getElementById("operator").addEventListener("keyup",addOperator)

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

