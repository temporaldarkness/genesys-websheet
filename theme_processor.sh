#!/bin/bash

mkdir -p ./data

rgb_to_hex() {
    printf '#%02X%02X%02X' "$1" "$2" "$3"
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
    
    if [[ $value =~ rgba\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*,.*?\) ]]; then
        echo $(rgb_to_hex "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "${BASH_REMATCH[3]}")
    elif [[ $value =~ rgb\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\) ]]; then
        echo $(rgb_to_hex "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "${BASH_REMATCH[3]}")
    elif [[ $value =~ ^\#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$ ]]; then
        normalize_hex "$value"
    else
        echo "unknown"
    fi
}

json_output="["
files_processed=0

for css_file in ./stylesheets/themes/*.css; do
    [[ ! -f "$css_file" ]] && continue
    
    id=$(basename "$css_file" .css)
    
    default="false"
    [[ "$id" == "light" ]] && default="true"
    
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
        json_output+="{\"name\": \"${id^}\", \"id\": \"$id\", \"default\": $default, \"colors\": [${color_list}]},"
        files_processed=$((files_processed + 1))
    fi
done

if [ $files_processed -gt 0 ]; then
    json_output="${json_output%,}]"
else
    json_output="[]"
fi

if echo "$json_output" | jq . > ./data/raw_themes.json 2>/dev/null; then
    echo "Файл ./data/raw_themes.json успешно создан"
else
    echo "Ошибка при создании JSON. Проверьте корректность данных"
    echo "Сгенерированный JSON:"
    echo "$json_output"
fi