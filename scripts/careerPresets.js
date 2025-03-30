careerPresets = {};
ids = [];

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
               'values': preset.values,
               'display': preset.display,
               'id': preset.id
            };
            ids.push(preset.id);
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
    select = document.getElementById('careerSelect');
    ids.forEach(presetId => {
       let preset = careerPresets[presetId];
       if (preset.display)
       {
           let option = document.createElement('option');
           
           option.value = preset.id;
           option.innerHTML = preset.name;
           
           select.appendChild(option);
       }
    });
    
    select.addEventListener('change', function(){
        setCareerPreset(parseInt(this.value));
    });
}

function loadPreset(preset)
{
    document.getElementById('career').value = preset.name;
    
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