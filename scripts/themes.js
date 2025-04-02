themePresets = {};
themeIds = [];

themeSelected = 'light';

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
               'id': preset.id
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
        
        let option = document.createElement('option');
        
        option.value = preset.id;
        option.innerHTML = preset.name;
        
        select.appendChild(option);
    });
    
    select.value = themeSelected;
    changeTheme(themeSelected);
    
    select.addEventListener('change', function(){
        themeSelected = this.value;
        localStorage.setItem('theme', themeSelected);
        changeTheme();
    });
}

function changeTheme()
{
    let theme = themePresets[themeSelected];
    document.querySelector('link').href = `./stylesheets/themes/${themeSelected}.css`;
    
    let test = document.getElementById('settings-colortest');
    
    previousColor = "#000000";
    theme.colors.forEach((color, index) => {
        test.children[index].style = `background-color:${color}; border-color:${theme.colors[(theme.colors.length + index-1) % theme.colors.length]};`;
    });
}

function startupThemeSelect()
{
    themeSelected = localStorage.getItem('theme') || 'light';
    document.querySelector('link').href = `./stylesheets/themes/${themeSelected}.css`;
}

startupThemeSelect();
document.addEventListener('DOMContentLoaded', () => {
    retrieveThemes();
});