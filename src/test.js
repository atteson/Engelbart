function log(event) {
    if( event.keyCode === 13 ) {
        document.getElementById('math').innerHTML =
            '$$' + event.srcElement.value + '$$'
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,"math"])
    }
}
