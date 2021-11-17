const infinity = -1
  
export class SuffixTree {
    constructor() {
        this.bottom = 0
        this.root = 1
        this.num_nodes = 1 
        this.gprime = []
        this.fprime = [undefined, 0]
        this.t = ""
    }

    new_node() {
        return ++this.num_nodes
    }

    set_transition( s, k, l, r ) {
        if( !this.gprime.hasOwnProperty( s ) )
            this.gprime[s] = new Map()
        this.gprime[s][this.t[k]] = [k, l, r]
    }

    get_transition( s, t ) {
        if( this.gprime.hasOwnProperty(s) )
            return this.gprime[s][t]
        else if( s == 0 ) {
            this.t[-t] = t
            return [-t,-t,1]
        } else
            return undefined
    }

    update( s, k, i) {
        var oldr = this.root
        var [end_point, r] = this.test_and_split( s, k, i-1, this.t[i] )
        while( !end_point ) {
            var rprime = this.new_node()
            this.set_transition( r, i, infinity, rprime )
            if( oldr != this.root )
                this.fprime[oldr] = r
            oldr = r
            [s,k] = this.cannonize( this.fprime[s], k, i-1 )
            [end_point, r] = this.test_and_split( s, k, i-1, this.t[i] )
        }
        if( oldr != r )
            this.fprime[oldr] = s
        return [s,k]
    }

    test_and_split( s, k, p, t ) {
        if( k <= p ) {
            [sprime, kprime, pprime] = this.get_transition( s, t )
            if( t == this.t[kprime + p - k + 1] )
                return [true, s]
            else {
                r = this.new_node()
                this.set_transition( s, kprime, kprime + p - k, r )
                this.set_transition( r, kprime + p - k + 1, pprime, sprime )
                return [false, r]
            }
        } else
            if( this.get_transition( s, t ) == undefined )
                return [false, s]
            else
                return [true, s]
    }

    cannonize( s, k, p ) {
        if( p < k )
            return [s,k]
        else {
            [kprime, pprime, sprime] = this.get_transition( s, this.t[k] )
            while( pprime - kprime <= p - k ) {
                k = k + pprime - kprime + 1
                s = sprime
                if( k <= p )
                    [kprime, pprime, sprime] = this.get_transition( s, this.t[k] )
            }
            return [s,k]
        }
    }

    push( t ) {
        var s = 1
        var k = this.t.length
        var i = k-1
        this.t += t + '\0'
        while( this.t[i+1] != '\0' ) {
            i += 1
            [s, k] = this.update( s, k, i )
            [s, k] = this.cannonize( s, i, k )
        }
    }
}


