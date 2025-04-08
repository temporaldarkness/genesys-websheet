archetypePresets = {};
archetypeInfo = {};
archetypeIds = [];

function generateArchetypeHTML() 
{
	const container = document.getElementById('archetypes-container');
	container.innerHTML = '';
	
	archetypeIds.forEach(presetId => {
        let preset = archetypePresets[presetId];
        let infoPreset = archetypeInfo[presetId];
        if (preset.display)
        {
    	    section = document.createElement('div');
    	    section.classList.add('data-segment')
    	    
    	    section.innerHTML = `
    	        <h3 class="section-title">${preset.name}</h3>
                <table class="stylized">
                    <tr>
                        <th>Сила</th>
                        <th>Ловкость</th>
                        <th>Интеллект</th>
                        <th>Смекалка</th>
                        <th>Воля</th>
                        <th>Харизма</th>
                    </tr>
                    <tr>
                        <th>${preset.stats.strength}</th>
                        <th>${preset.stats.agility}</th>
                        <th>${preset.stats.intelligence}</th>
                        <th>${preset.stats.wits}</th>
                        <th>${preset.stats.willpower}</th>
                        <th>${preset.stats.charisma}</th>
                        </tr>
                </table>
                <div class="block-subtitle">Производные показатели</div>
                <div class="section">
                    <div class="field bottomline">
                        <label>Стартовый порог ран : <u>${preset.wounds} + Сила</u></label>
                    </div>
                    <div class="field bottomline">
                        <label>Стартовый порог усталости : <u>${preset.fatigue} + Воля</u></label>
                    </div>
                    <div class="field bottomline">
                        <label>Стартовый опыт : <u>${preset.experience}</u></label>
                    </div>
                </div>
                <div class="block-subtitle">Описание</div>
                <div class="section">
                    ${infoPreset.desc}
                </div>
                <div class="block-subtitle">Стартовые навыки</div>
                <div class="section">
                    <span>
                        ${infoPreset.startingSkills}
                    </span>
                </div>
                <div class="block-subtitle">Особое свойство</div>
                <div class="section">
                    <strong class="block-subtitle">${preset.talent.name} : </strong>
                    ${preset.talent.desc}
                </div>
    	    `;
    	    container.appendChild(section);
        }
	});
}

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
    if (select)
    {
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
    
    if (document.getElementById('archetypes-container'))
        retrieveArchetypeInfo();
}

async function retrieveArchetypeInfo() 
{
    try {
        const response = await fetch('./data/archetypes.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
        const data = await response.json();
        data.forEach(preset => {
           archetypeInfo[preset.id] = {
               'startingSkills': preset.startingSkills,
               'desc': preset.desc
            };
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
    
    generateArchetypeHTML();
}

function loadArchetypePreset(preset)
{
    document.getElementById('archetype').value = preset.name;
    document.getElementById('wounds-max').value = (preset.wounds + preset.stats.strength);
    document.getElementById('wounds-current').value = (preset.wounds + preset.stats.strength);
    document.getElementById('fatigue-max').value = (preset.fatigue + preset.stats.willpower);
    document.getElementById('fatigue-current').value = (preset.fatigue + preset.stats.willpower);
    document.getElementById('strength').value = preset.stats.strength;
    document.getElementById('agility').value = preset.stats.agility;
    document.getElementById('intelligence').value = preset.stats.intelligence;
    document.getElementById('wits').value = preset.stats.wits;
    document.getElementById('willpower').value = preset.stats.willpower;
    document.getElementById('charisma').value = preset.stats.charisma;
    document.getElementById('exp-total').value = preset.experience;
    document.getElementById('exp-available').value = preset.experience;
    document.getElementById('absorption').value = preset.stats.strength;
    document.getElementById('weight-available').value = (preset.stats.strength + 5);
    document.getElementById('text-money').value = '500 единиц';
    
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