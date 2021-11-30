const infinity = Number.MAX_SAFE_INTEGER
  
export class SuffixTree {
    constructor() {
        this.bottom = 0;
        this.root = 1;
        this.num_nodes = 1; 
        this.gprime = [];
        this.fprime = [undefined, 0];
        this.t = [];
    }

    new_node() {
        return ++this.num_nodes;
    }

    set_transition( s, k, l, r ) {
        if( !this.gprime.hasOwnProperty( s ) )
            this.gprime[s] = new Map();
        this.gprime[s][this.t[k]] = [k, l, r];
    }

    get_transition( s, t ) {
        if( this.gprime.hasOwnProperty(s) )
            return this.gprime[s][t];
        else if( s == 0 ) {
            return [-t,-t,1];
        } else
            return undefined;
    }

    update( s, k, i) {
        var oldr = this.root;
        var [end_point, r] = this.test_and_split( s, k, i-1, this.t[i] );
        while( !end_point ) {
            var rprime = this.new_node();
            this.set_transition( r, i, infinity, rprime );
            if( oldr != this.root )
                this.fprime[oldr] = r;
            oldr = r;
            [s,k] = this.cannonize( this.fprime[s], k, i-1 );
            [end_point, r] = this.test_and_split( s, k, i-1, this.t[i] );
        }
        if( oldr != r )
            this.fprime[oldr] = s;
        return [s,k]
    }

    test_and_split( s, k, p, t ) {
        if( k <= p ) {
            var [kprime, pprime, sprime] = this.get_transition( s, this.t[k] );
            if( t == this.t[kprime + p - k + 1] )
                return [true, s];
            else {
                var r = this.new_node();
                this.set_transition( s, kprime, kprime + p - k, r );
                this.set_transition( r, kprime + p - k + 1, pprime, sprime );
                return [false, r];
            }
        } else
            if( this.get_transition( s, t ) == undefined )
                return [false, s];
            else
                return [true, s];
    }

    cannonize( s, k, p ) {
        if( p < k )
            return [s,k];
        else {
            var [kprime, pprime, sprime] = this.get_transition( s, this.t[k] );
            while( pprime - kprime  <= p - k ) {
                k = k + pprime - kprime + 1;
                s = sprime;
                if( k <= p )
                    [kprime, pprime, sprime] = this.get_transition( s, this.t[k] );
            }
            return [s,k];
        }
    }

    concat( t ) {
        var s = 1;
        var k = this.t.length;
        var i = k-1;
        t.push( 0 );
        this.t = this.t.concat( t );
        while( this.t[i+1] != 0 ) {
            i += 1;
            [s, k] = this.update( s, k, i );
            [s, k] = this.cannonize( s, k, i );
        }
    }
}


