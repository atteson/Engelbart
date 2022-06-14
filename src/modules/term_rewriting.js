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

        var table = document.getElementById( "operators" );
        var row = table.insertRow();

        var operatorcell = row.insertCell();
        operatorcell.innerHTML = "$$" + operator + "$$";
        MathJax.typeset( [operatorcell] );
        
        var associativitycell = row.insertCell();
        var associativity = document.getElementById("associativity").value;
        associativitycell.innerHTML = associativity;
        associativities.push( associativity );
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

