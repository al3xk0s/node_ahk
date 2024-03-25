# root_dir="/c/Users/alex/home/projects/node_ahk"
# target

# echo "export NODE_AHK_ROOT=\"$root_dir\"" > ""
# echo "source "\$NODE_AHK_ROOT/source.sh"" > ""
# echo > ""

function install() {    
    local root_dir="$1"
    local target="$HOME/.bashrc"

    [[ ! -e "$root_dir" ]] && echo "Positional root dir required" && return 1

    echo "export NODE_AHK_ROOT=\"$root_dir\"" >> "$target"
    echo "source \"\$NODE_AHK_ROOT/source.sh\"" >> "$target"
    echo >> "$target"
}

install "$@"