careerPresets = {};
careerIds = [];

async function retrieveCareerPresets() 
{
    try {
        const response = await fetch('./data/careers.json');
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
            careerIds.push(preset.id);
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
    select = document.getElementById('careerSelect');
    careerIds.forEach(presetId => {
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

function loadCareerPreset(preset)
{
    document.getElementById('career').value = preset.name;
    
    container = document.getElementById('skills-container');
    
    container.querySelectorAll('.skill-item').forEach(skill => {
        skill.querySelector('input').checked = false;
    });
	
	preset.values.forEach(skillId => {
	    container.querySelector(`.skill-item[data-skill-id="${skillId}"]`).querySelector('input').checked = true;
	});
}

function setCareerPreset(preset)
{
    loadCareerPreset(careerPresets[preset]);
}

document.addEventListener('DOMContentLoaded', () => {
    retrieveCareerPresets();
});