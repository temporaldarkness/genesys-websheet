#!/bin/bash

mkdir -p ./data

format_rgba() {
    local r=$1
    local g=$2
    local b=$3
    local a=$4
    echo "rgba($r, $g, $b, $a)"
}

normalize_hex() {
    local hex="${1/#\#/}"
    if [[ ${#hex} == 3 ]]; then
        hex="${hex:0:1}${hex:0:1}${hex:1:1}${hex:1:1}${hex:2:1}${hex:2:1}"
    fi
    echo "#${hex^^}"
}

process_color() {
    local value="$1"
    
    if [[ $value =~ rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9.]+)\s*\) ]]; then
        echo $(format_rgba "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "${BASH_REMATCH[3]}" "${BASH_REMATCH[4]}")
    elif [[ $value =~ rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\) ]]; then
        echo $(format_rgba "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "${BASH_REMATCH[3]}" "1")
    elif [[ $value =~ ^\#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$ ]]; then
        normalized_hex=$(normalize_hex "$value")
        hex="${normalized_hex/#\#/}"
        
        if [[ ${#hex} != 6 ]]; then
            echo "unknown"
            return
        fi
        
        r=$((16#${hex:0:2}))
        g=$((16#${hex:2:2}))
        b=$((16#${hex:4:2}))
        echo $(format_rgba "$r" "$g" "$b" "1")
    else
        echo "unknown"
    fi
}

json_output="["
files_processed=0

for css_file in ./stylesheets/themes/*.css; do
    [[ ! -f "$css_file" ]] && continue
    
    id=$(basename "$css_file" .css)
    
    if grep -q "light: false" "$css_file"; then
        light="false"
    else
        light="true"
    fi
    
    colors=()
    while IFS= read -r line; do
        if [[ $line =~ ^[[:space:]]*--clr-[^:]+:[[:space:]]*([^;]+) ]]; then
            color_value="${BASH_REMATCH[1]}"
            processed_color=$(process_color "$color_value")
            [[ "$processed_color" != "unknown" ]] && colors+=("\"$processed_color\"")
        fi
    done < <(grep -E '^\s*--clr-' "$css_file")
    
    if [ ${#colors[@]} -gt 0 ]; then
        color_list=$(IFS=,; echo "${colors[*]}")
        json_output+="{\"name\": \"${id^}\", \"id\": \"$id\", \"colors\": [${color_list}], \"light\": $light},"
        files_processed=$((files_processed + 1))
    fi
done

if [ $files_processed -gt 0 ]; then
    json_output="${json_output%,}]"
else
    json_output="[]"
fi

if echo "$json_output" | jq . > ./data/themes.json 2>/dev/null; then
    echo "Файл ./data/themes.json успешно создан"
else
    echo "Ошибка при создании JSON. Проверьте корректность данных"
    echo "Сгенерированный JSON:"
    echo "$json_output"
fi