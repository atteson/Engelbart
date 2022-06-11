// variables are in the first list
// operators are in the second list

var variables = [];
var variable_tokens = new Map();
var nonterminals = new Map();
var production_rules = [];
var rules = [];

import { SuffixTree } from "../modules/suffix_tree.js";
import "../submodules/MathJax-src/es5/tex-chtml.js"
var tokenizer = new SuffixTree();

function addVariable(event) {
    if( event.keyCode == 13 ) {
        var newvariable = document.getElementById("newvariable");
        var variable = newvariable.value;

        newvariable.value = "";

        variables.push( variable );
        variable_tokens[tokenizer.push_string( variable )] = variable;
    
        var variablesmath = document.getElementById("variablesmath");
        MathJax.typesetClear([variablesmath]);
        variablesmath.innerHTML = "$$" + variables.join(",") + "$$";
        MathJax.typeset([variablesmath]);}
}

document.getElementById("newvariable").addEventListener("keyup",addVariable);

function addOperator(event) {
    if( event.keyCode == 13 ) {
        var newitem = document.getElementById( "newoperator" );
        var operator = newitem.value;

        newitem.value = "";

        var tokens = [];
        var i = 0;
        var [start, end, string_num] = tokenizer.find_next_string( operator, i );
        while( string_num != 0 ) {
            if( start > i ) {
                var substring = operator.substring( i, start - 1 );
                nonterminals[tokens.push_string( substring )] = substring;

            }
            [start, end, string_num] = tokenizer.find_next_string( operator, i );
            i = end;
        }
        if( end < operator.length ) {
            var substring = operator.substring( end, operator.length - 1);
            tokens.push_string( substring ); 
         }

        var table = document.getElementById( "operators" );
        var cell = table.insertRow().insertCell();
        cell.innerHTML = "$$" + operators[operators.length-1] + "$$";
        MathJax.typeset( [cell] );
    }
}

document.getElementById("newoperator").addEventListener("keyup",addOperator)

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

