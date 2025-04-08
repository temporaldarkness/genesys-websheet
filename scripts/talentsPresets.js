talentsPresets = {};

function generateTalentsHTML() 
{
    container = document.getElementById('talents-container')
    
    tiers = [];
    
    talentsPresets.forEach(preset => {
        tierId = Math.floor(preset.id/100)-1;
        tier = tiers[tierId];
        if (!tier)
        {
            tier = document.createElement('div');
            tier.classList.add('wiki-spawnablegrid');
            title = document.createElement('h4');
            title.classList.add('block-title');
            title.innerHTML = `Уровень ${tierId+1}`;
            tiers[tierId] = tier;
            container.appendChild(title);
            container.appendChild(tier);
        }
        
	    section = document.createElement('div');
	    section.classList.add('section');
	    section.classList.add('data-segment');
	    section.innerHTML = `<span style="display:flex;" class="block-subtitle"><strong style="margin-right:auto;">${preset.name}${preset.ranked ? ', Ранговый' : ''}</strong><em>${preset.active ?? 'Пассивный'}</em></span><span>${preset.description}</span>`;
	   
	   tier.appendChild(section);
	});
}

async function retrieveTalentsPresets() 
{
    try {
        const response = await fetch('./data/talents.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
        talentsPresets = await response.json();
        talentsPresets.sort((a, b) => {
            return Math.floor(a.id / 100) - Math.floor(b.id / 100) || a.name > b.name;
        });
        
        generateTalentsHTML();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    retrieveTalentsPresets();
});