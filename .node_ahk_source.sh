__nodeAhk__runComplete() {
    local latest="${COMP_WORDS[$COMP_CWORD]}"
    local prev="${COMP_WORDS[$COMP_CWORD - 1]}"
    local words="run build"

    local subcommand="${COMP_WORDS[1]}"
    local file_name="*.js"

    [[ "$subcommand" == 'build' ]] && [[ "$prev" == "$subcommand" ]] && file_name="*.ts"

    [[ "$subcommand" =~ (run|build) ]] && words="$(find . -name "$file_name" -type f)"

    COMPREPLY=($(compgen -W "$words" -- $latest))
    return 0
}

complete -F __nodeAhk__runComplete node-ahk

function node_ahk__help() {
    echo '
  Subcommands:

    run     ./path/to/script.js
    build   ./path/to/root.ts [path/to/out.js]
'
}

function node_ahk__run() {
    local file="$1"

    suchibot "$file"
}

function node_ahk__build() {
    local src_file="$1"
    local out="$2"

    [[ -z "$out" ]] && out="$(basename "$src_file")"

    node esbuild.mjs "$src_file" "$out"
}

function node-ahk() {
    local subcommand="$1"
    shift

    [[ -z "$subcommand" ]] && subcommand="-h"

    case "$subcommand" in
        build) node_ahk__build "${@}" ;;
        run) node_ahk__run "${@}" ;;
        --help) node_ahk__help ;;
        -h) node_ahk__help ;;
        *) echo ;;
    esac
}