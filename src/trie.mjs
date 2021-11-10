class Trie {
    constructor() {
        this.p = []
        this.member = false
    }

    push( s ) {
        if( s.length == 0 )
            this.member = true
        else {
            let c = s.charCodeAt(0)
            if( !this.p.hasOwnProperty(c) )
                this.p[c] = new Trie()
            this.p[c].push( s.slice(1) )
        }
    }


    ismember( s ) {
        if( s.length == 0 )
            return this.member
        let c = s.charCodeAt(0)
        if( this.p.hasOwnProperty(c) )
            return this.p[c].ismember( s.slice(1) )
        return false
    }

    hasprefix( s ) {
        if( s.length == 0 )
            return this.member
        let c = s.charCodeAt(0)
        if( this.p.hasOwnProperty(c) )
            return this.p[c].hasprefix( s.slice(1) )
        return this.member
    }
}

