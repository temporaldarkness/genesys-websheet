archetypePresets = {};
archetypeIds = [];

async function retrieveArchetypePresets() 
{
    try {
        const response = await fetch('./data/archetypes.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
        const data = await response.json();
        data.forEach(preset => {
           archetypePresets[preset.id] = {
               'name': preset.name,
               'stats': preset.stats,
               'wounds': preset.wounds,
               'fatigue': preset.fatigue,
               'experience': preset.experience,
               'display': preset.display,
               'id': preset.id,
               'talent': preset.talent
            };
            archetypeIds.push(preset.id);
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
    select = document.getElementById('archetypeSelect');
    archetypeIds.forEach(presetId => {
       let preset = archetypePresets[presetId];
       if (preset.display)
       {
           let option = document.createElement('option');
           
           option.value = preset.id;
           option.innerHTML = preset.name;
           
           select.appendChild(option);
       }
    });
    
    select.addEventListener('change', function(){
        setArchetypePreset(parseInt(this.value));
    });
}

function loadArchetypePreset(preset)
{
    document.getElementById('archetype').value = preset.name;
    document.getElementById('wounds-max').value = preset.wounds;
    document.getElementById('wounds-current').value = preset.wounds;
    document.getElementById('fatigue-max').value = preset.fatigue;
    document.getElementById('fatigue-current').value = preset.fatigue;
    document.getElementById('strength').value = preset.stats.strength;
    document.getElementById('agility').value = preset.stats.agility;
    document.getElementById('intelligence').value = preset.stats.intelligence;
    document.getElementById('wits').value = preset.stats.wits;
    document.getElementById('willpower').value = preset.stats.willpower;
    document.getElementById('charisma').value = preset.stats.charisma;
    document.getElementById('exp-total').value = preset.experience;
    document.getElementById('exp-available').value = preset.experience;
    document.getElementById('absorption').value = preset.stats.strength;
    
    container = document.querySelector('.talents');
    talent = container.querySelector('[data-source="archetype"]');
    if (!talent)
    {
        talent = container.lastElementChild;
        createTalent();
    }
    talent.classList.add('filled');
    talent.querySelector('.talent-name').value = preset.talent.name;
    talent.querySelector('.talent-desc').value = preset.talent.desc;
    talent.dataset.source = "archetype";
}


function setArchetypePreset(preset)
{
    loadArchetypePreset(archetypePresets[preset]);
}

document.addEventListener('DOMContentLoaded', () => {
    retrieveArchetypePresets();
});