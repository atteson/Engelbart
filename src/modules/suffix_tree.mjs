class SuffixTreeNode {
    constructor() {
        this.children = []
        this.left = 0
        this.right = 0
        this.suffix_link = 0
    }

    add_child( a, node ) {
        node = new SuffixTreeNode()
        this.children[a] = node
        node.suffix_link
    }
}

class SuffixTreeImplicitNode {
    constructor( v, alpha ) {
        this.v = v
        this.alpha = alpha
    }

    has_child(t, a) {
        if( this.alpha == this.v.right ) 
            return this.v.children.hasOwnProperty(a)
        else
            return t.s[this.alpha] == a
    }

    set_to_child(u, a) {
        if( u.alpha == u.v.right ) {
            this.v = u.v.children[a]
            this.alpha = u.v.left
        } else {
            this.alpha = u.alpha + 1
        }
    }

    at_root()
        return this.v != 0

    set_to_suffix(t)
        this.v = t.suffix_links[this.v]
}

class SuffixTree {
    constructor() {
        this.nodes = [new SuffixTreeNode()]
        this.v = new SuffixTreeImplicitNode( this.nodes[0], 0 )
        this.alpha = 0
        this.s = []
        this.u = new SuffixTreeImplicitNode( this.nodes[0], 0 ) // scratch space
    }

    push( s ) {
        this.s.concat(s)
        if() this.v == 0 ) {
            // this is the first non-root node we're inserting into the tree
            n = length(this.nodes)
            node = new SuffixTreeNode()
            node.right = 1
            this.nodes[n] = node
            this.v.children[s[0]] = node
            this.suffix_links[n] = node
        }
        for(let i = 1; i < length(a); i++) {
            a = s[i]
            if( this.v.has_child( this, a ) ) {
                this.v.set_to_child( this.v, a )
            } else {
                this.u.assign( this.v )
                while( !this.u.has_child( this, a ) ) {
                    this.add_child( this.u, a )    
                    if( !this.u.at_root() )
                        break
                    else
                        this.u.set_to_suffix(this)
                }
            }
        }
    }

    find( a ) {

    }
}

