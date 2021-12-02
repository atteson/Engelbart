const infinity = Number.MAX_SAFE_INTEGER
  
export class SuffixTree {
    constructor() {
        this.bottom = 0;
        this.root = 1;
        this.num_nodes = 1; 
        this.gprime = [];
        this.fprime = [undefined, 0];
        this.t = [];
        this.final = [];
        this.token_lengths = [];
        this.final_states = [];
        this.string_lengths = [];
    }

    add_token( length ) {
        var token = this.token_lengths.length;
        this.token_lengths[token] = length;
        return token;
    }

    new_node() {
        return ++this.num_nodes;
    }

    set_transition( s, k, l, r ) {
        if( !this.gprime.hasOwnProperty( s ) ) {
            this.gprime[s] = new Map();
        }
        this.gprime[s][this.t[k]] = [k, l, r];
    }

    get_transition( s, t ) {
        if( this.gprime.hasOwnProperty(s) ) {
            return this.gprime[s][t];
        } else if( s == 0 ) {
            return [-t,-t,1];
        } else {
            return undefined;
        }
    }

    update( s, k, i ) {
        var oldr = this.root;
        var [end_point, r] = this.test_and_split( s, k, i-1, this.t[i] );
        while( !end_point ) {
            var rprime = this.new_node();
            this.set_transition( r, i, infinity, rprime );
            if( oldr != this.root ) {
                this.fprime[oldr] = r;
            }
            oldr = r;
            [s,k] = this.cannonize( this.fprime[s], k, i-1 );
            [end_point, r] = this.test_and_split( s, k, i-1, this.t[i] );
        }
        if( oldr != r ) {
            this.fprime[oldr] = s;
        }
        return [s, k]
    }

    test_and_split( s, k, p, t ) {
        if( k <= p ) {
            var [kprime, pprime, sprime] = this.get_transition( s, this.t[k] );
            if( t == this.t[kprime + p - k + 1] ) {
                return [true, s];
            } else {
                var r = this.new_node();
                this.set_transition( s, kprime, kprime + p - k, r );
                this.set_transition( r, kprime + p - k + 1, pprime, sprime );
                return [false, r];
            }
        } else {
            if( this.get_transition( s, t ) == undefined ) {
                return [false, s];
            } else {
                return [true, s];
            }
        }
    }

    cannonize( s, k, p ) {
        if( p < k )
            return [s,k];
        else {
            var [kprime, pprime, sprime] = this.get_transition( s, this.t[k] );
            while( pprime - kprime  <= p - k ) {
                k = k + pprime - kprime + 1;
                s = sprime;
                if( k <= p ) {
                    [kprime, pprime, sprime] = this.get_transition( s, this.t[k] );
                }
            }
            return [s,k];
        }
    }

    push( t ) {
        var s = this.root;
        var k = this.t.length;
        var i = k-1;

        // process tokens
        for( var j = 0; j < t.length; j++ ) {
            if( this.token_lengths.hasOwnProperty( t[j] ) ) {
                if( this.token_lengths[t[j]] != 1 ) {
                    alert( "Invalid token!" );
                }
            } else {
                this.token_lengths[t[j]] = 1;
            }
        }
        var string_num = this.add_token( t.length );
        this.string_lengths[string_num] = t.length;
        t.push( string_num );

        // append to the tree
        this.t = this.t.concat( t );
        while( i < this.t.length-1 ) {
            i += 1;
            [s, k] = this.update( s, k, i );
            [s, k] = this.cannonize( s, k, i );
        }

        s = this.root;
        k = this.t.length - t.length;
        i = k-1;
        var r, p;
        [k, p, r] = this.get_transition( s, this.t[i+1] );
        while( p < infinity ) {
            s = r;
            i += p - k + 1;
            [k, p, r] = this.get_transition( s, this.t[i+1] );
        }
        if( this.t[k] != string_num ) {
            this.set_transition( s, k, this.t.length-2, r );
            var rprime = this.new_node();
            this.set_transition( r, this.t.length-1, infinity, rprime );
        }
        this.final_states[r] = string_num;
    }

    find_next( t, start = 0 ) {
        var s = this.root;
        var i = start;
        outer: while( i < t.length ) {
            var [k, p, sprime] = this.get_transition( s, t[i] );
            var iprime = i;
            var kprime = k;
            while( kprime <= p ) {
                if( p == infinity || this.t[kprime] != t[iprime] ) {
                    if( s == this.root ) {
                        i++;
                    } else {
                        s = this.fprime[s];
                    }
                    continue outer;
                }
                kprime++;
                iprime++;
            }
            s = sprime;
            i += p - k + 1;
            if( this.final_states.hasOwnProperty(s) ) {
                var string_num = this.final_states[s];
                return [i-this.string_lengths[string_num], i, string_num];
            }
        }
        return [i, i, 0];
    }
}
