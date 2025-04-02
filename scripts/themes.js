themePresets = {};
themeIds = [];

async function retrieveThemes() 
{
    try {
        const response = await fetch('./data/themes.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки тем: ${response.status}`);
		
        const data = await response.json();
        data.forEach(preset => {
           themePresets[preset.id] = {
               'name': preset.name,
               'colors': preset.colors,
               'id': preset.id,
               'default': !!preset.default
            };
            themeIds.push(preset.id);
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
    
    themeIds.sort(theme => {
        return themePresets[theme].name;
    });
    
    select = document.getElementById('themeSelect');
    themeIds.forEach(presetId => {
        let preset = themePresets[presetId];
        
        if (!preset.default)
        {
            let option = document.createElement('option');
           
            option.value = preset.id;
            option.innerHTML = preset.name;
            
            select.appendChild(option);
        }
    });
    
    setTheme('light');
    
    select.addEventListener('change', function(){
        setTheme(this.value);
    });
}

function setTheme(uid)
{
    let theme = themePresets[uid];
    document.querySelector('link').href = `./stylesheets/themes/${uid}.css`;
    
    let test = document.getElementById('settings-colortest');
    
    previousColor = "#000000";
    theme.colors.forEach((color, index) => {
        test.children[index].style = `background-color:${color}; border-color:${theme.colors[(theme.colors.length + index-1) % theme.colors.length]};`;
    });
}

document.addEventListener('DOMContentLoaded', retrieveThemes());