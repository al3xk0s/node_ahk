__NODE_AHK__ROOT="dist/scripts/"

__nodeAhk__runCompgen() {
    local cur="$1"

    node.exe compgen.js "$__NODE_AHK__ROOT" "$cur"
}

__nodeAhk__runComplete() {
    local cur=${COMP_WORDS[COMP_CWORD]}    
    COMPREPLY=( $(__nodeAhk__runCompgen "$cur") )
}

complete -o nospace -F __nodeAhk__runComplete run-script

function run-script() {   
    npx suchibot "$__NODE_AHK__ROOT$1"
}
