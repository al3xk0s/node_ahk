export NODE_AHK_SCRIPTS="dist/scripts"

__nodeAhk__runCompgen() {
    local cur="$1"
    local old="$(pwd)"

    cd "$NODE_AHK_ROOT"
    node.exe compgen.js "$NODE_AHK_SCRIPTS/" "$cur"
    cd "$old"
}

__nodeAhk__runComplete() {
    local cur=${COMP_WORDS[COMP_CWORD]}    
    COMPREPLY=( $(__nodeAhk__runCompgen "$cur") )
}

complete -o nospace -F __nodeAhk__runComplete run-ahk-script

function run-ahk-script() {
    while IFS= read -r line; do
        echo "$line"
    done < <(cd "$NODE_AHK_ROOT" && npx suchibot "$NODE_AHK_ROOT/$NODE_AHK_SCRIPTS/$1")
}
