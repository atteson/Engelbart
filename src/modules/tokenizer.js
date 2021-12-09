export class Tokenizer {
    constructor( s ) {
        this.string = s;
        this.position = 0;
    }

    is_alpha( c ) {
        return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
    }
    next_token() {
        switch( this.string.charCodeAt(this.position) ) {
            case 47:
                while( this.string.char)
        }
    }
}