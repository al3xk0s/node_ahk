function __nodeAhk__getPackage() {
    echo "github:al3xk0s/node_ahk#$1"
}

function __nodeAhk__runComplete() {
    local latest="${COMP_WORDS[$COMP_CWORD]}"
    local prev="${COMP_WORDS[$COMP_CWORD - 1]}"
    local words="run build deploy install"

    local subcommand="${COMP_WORDS[1]}"

    local js_file_name="-name \"*.js\""
    local ts_file_name="-name \"*.ts\""
    local ts_or_js_file_name="$js_file_name -o $ts_file_name"

    local file_name="$js_file_name"

    [[ "$subcommand" == 'build' ]] && [[ "$prev" == "$subcommand" ]] && file_name="$ts_or_js_file_name"

    [[ "$subcommand" =~ (run|build) ]] && words="$(eval "find . $file_name -type f")"

    COMPREPLY=($(compgen -W "$words" -- $latest))
    return 0
}

complete -F __nodeAhk__runComplete node-ahk

function node_ahk__help() {
    echo '
  Subcommands:

    run ./script.js                     ./path/to/script.js
    build ./script.ts|js [outfile]      ./path/to/root.ts [path/to/out.js]
    deploy                              (in node-ahk package dir, to install globaly)
    install [-g | version]              (to link global or github specific version). By default - global.
'
}

function node_ahk__run() {
    local file="$1"

    suchibot "$file"
}

function node_ahk__build() {
    local src_file="$1"
    local out="$2"

    local filename="$(basename "$src_file")"
    filename="${filename%.*}"

    [[ -z "$out" ]] && out="$filename.bundle.js"

    esbuild \
        --minify \
        --bundle \
        --platform=node \
        --external:@suchipi/node-mac-permissions \
        --external:suchibot \
        --external:esbuild \
        --outfile="$out" \
    "$src_file"    
}

function node_ahk__deploy() {
    ( [[ ! -f 'package.json' ]] || [[ ! -f 'tsup.config.ts' ]] ) && \
    echo 'Must be root node_ahk dirrectory' && \
    return 1

    local name=""
    local names=()

    npm pack && \
    names=($(find . -type f -name "node-ahk*.tgz")) && \
    name="${names[0]}" && \
    npm i -g "$name"

    rm -f "$name"

    return 0
}

function node_ahk__install() {
    local flag_or_version="$1"

    if [[ -z "$flag_or_version" ]]; then
        flag_or_version="-g"
    fi

    if [[ "$flag_or_version" == '-g' ]]; then
        npm link suchibot node-ahk
    else
        npm i "$(__nodeAhk__getPackage "$flag_or_version")"
        npm link suchibot
    fi

    return 0
}

function node-ahk() {
    local subcommand="$1"
    shift

    [[ -z "$subcommand" ]] && subcommand="-h"

    case "$subcommand" in
        build) node_ahk__build "${@}" ;;
        run) node_ahk__run "${@}" ;;
        deploy) node_ahk__deploy "${@}" ;;
        install) node_ahk__install "${@}" ;;
        --help) node_ahk__help ;;
        -h) node_ahk__help ;;
        *) echo ;;
    esac
}
