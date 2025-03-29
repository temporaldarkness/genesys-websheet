careerPresets = {};

async function retrievePresets() 
{
    try {
        const response = await fetch('./data/presets.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
        const data = await response.json();
        data.forEach(preset => {
           careerPresets[preset.id] = {
               'name': preset.name,
               'values': preset.values
            };
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function loadPreset(preset)
{
    container = document.getElementById('skills-container');
    
    container.querySelectorAll('.skill-item').forEach(skill => {
        skill.querySelector('input').checked = false;
    });
    
    document.querySelector('nav').lastElementChild.innerHTML = preset.name;
	
	preset.values.forEach(skillId => {
	    container.querySelector(`.skill-item[data-skill-id="${skillId}"]`).querySelector('input').checked = true;
	});
}

function setCareerPreset(preset)
{
    loadPreset(careerPresets[preset]);
}

document.addEventListener('DOMContentLoaded', retrievePresets());