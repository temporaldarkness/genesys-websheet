themePresets = {};
themeIds = [];

themeSelected = 'Monochrome';

async function fileExists(url)
{
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

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
               'light': preset.light
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
    let lightIndicator = '☀︎';
    let darkIndicator = '☾';
    themeIds.forEach(presetId => {
        let preset = themePresets[presetId];
        
        let option = document.createElement('option');
        
        option.value = preset.id;
        option.innerHTML = `${preset.light ? lightIndicator : darkIndicator} ${preset.name}`;
        
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

async function swapThemeStyles()
{
    let link = `./stylesheets/themes/${themeSelected}.css`;
    if (await fileExists(link))
    {
        oldStyle = document.querySelector('[data-thematic]');
        oldStyle.removeAttribute('data-thematic');
        
        newStyle = document.createElement('link');
        newStyle.rel = 'stylesheet';
        newStyle.href = link;
        newStyle.dataset.thematic = 'mainTheme';
        document.querySelector('head').appendChild(newStyle);
        setTimeout(() => oldStyle.remove(), 300);
    }
}

function changeTheme()
{
    swapThemeStyles();
    let theme = themePresets[themeSelected] || themePresets['Monochrome'];
    
    let test = document.getElementById('settings-colortest');
    
    previousColor = "#000000";
    theme.colors.forEach((color, index) => {
        test.children[index].style = `background-color:${color}; border-color:${theme.colors[(theme.colors.length + index-1) % theme.colors.length]};`;
    });
}

async function themeSetup()
{
    themeSelected = localStorage.getItem('theme') || themeSelected;
    let link = `./stylesheets/themes/${themeSelected}.css`;
    document.querySelector('[data-thematic]').href = link;
    
    newStyle = document.createElement('link');
    newStyle.rel = 'stylesheet';
    newStyle.href = './stylesheets/colorTransition.css';
    document.querySelector('head').appendChild(newStyle);
}



themeSetup();

document.addEventListener('DOMContentLoaded', () => {
    retrieveThemes();
});