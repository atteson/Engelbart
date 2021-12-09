
export class NFA {
    constructor( regex ) {
        this.num_nodes = 0;
        this.transitions = [];
        var current_node = this.add_node();
        
        var stack = [];
        var start_expression = current_node;

        for( i = 0; i < regex.length; i++ ) {
            switch( regex[i] ) {
                case '(':
                    var node = this.add_node();
                    stack.push( node );
                    this.add_transition( "", current_node, node );
                    start_expression = current_node = node;
                    break;
                case ')':
                    start_expression = stack.pop();
                    break;
                case '|':
                    this.add_transition( "", , i );
                    current = i+1;
                    break;
                case '*':
                    this.add_transition( "", current, last );
                    break;
                default:
                    this.add_node();
                    this.add_transition( regex[i], last, i );
                    last = current;
                    current = i;
            }
        }
    }

    add_node() {
        this.transitions[this.num_nodes] = new Map();
        return this.num_nodes++;
    }

    add_transition( c, i, j ) {
        this.transitions[i][c] = j;
    }
}