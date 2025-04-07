careerPresets = {};
careerInfo = {};
careerIds = [];

function generateCareerHTML() 
{
	const container = document.getElementById('careers-container');
	container.innerHTML = '';
	
	careerIds.forEach(presetId => {
        let preset = careerPresets[presetId];
        let infoPreset = careerInfo[presetId];
        if (preset.display)
        {
    	    section = document.createElement('div');
    	    section.classList.add('data-segment');
    	    
    	    list = '';
    	    preset.values.forEach(val => {
    	        list += `<li>${availableSkills.find(item => item.id == val).name}</li>\n`;
    	    });
    	    
    	    
    	    section.innerHTML = `
    	        <h3 class="section-title">${preset.name}</h3>
                <div class="block-subtitle">Описание</div>
                <div class="section">${infoPreset.desc}</div>
                <div class="block-subtitle">Карьерные навыки</div>
                <div class="section">
                    <ul>${list}</ul>
                    <div class="wiki-note">
                        Перед распределением очков опыта ${preset.name} может выбрать четыре разных карьерных навыка и повысить каждый из них на 1 ранг.
                    </div>
                </div>
    	    `;
    	    container.appendChild(section);
        }
	});
}

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
    if (select)
    {
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
    
    if (document.getElementById('careers-container'))
        retrieveCareerInfo();
}

async function retrieveCareerInfo() 
{
    try {
        const response = await fetch('./data/careers.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
        const data = await response.json();
        data.forEach(preset => {
           careerInfo[preset.id] = {
               'desc': preset.desc
            };
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
    
    generateCareerHTML();
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