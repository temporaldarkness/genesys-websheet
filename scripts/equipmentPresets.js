traitPresets = [];
equipmentPresets = {
    'weapons': [],
    'armor': [],
    'items': []
};

const distanceMeasures = [
    'Вплотную',
    'Короткая',
    'Средняя',
    'Длинная',
    'Экстремальная',
    'Стратегическая'
];

function generateTraitHTML() 
{
	const container = document.getElementById('traits-container');
	container.innerHTML = '';
	
	traitPresets.forEach(preset => {
        if (preset.display)
        {
    	    section = document.createElement('div');
    	    section.classList.add('data-segment');
    	    
    	    section.innerHTML = `
    	        <h3 class="section-title">${preset.name} <input type="checkbox" class="h3-aligned" ${preset.isActive ? 'checked' : ''} disabled><span class="case-sensitive">( ${preset.isActive ? 'Активное' : 'Пассивное'} )</span></h3>
                <div class="section">${preset.description}</div>
    	    `;
    	    container.appendChild(section);
        }
	});
}

function generateWeaponsHTML() 
{
	const container = document.getElementById('weapons-container');
	container.innerHTML = `
		<tr>
			<th>Название оружия</th>
			<th>Вес</th>
			<th>Цена</th>
			<th>Редкость</th>
			<th>Навык</th>
			<th>Урон</th>
			<th>Крит</th>
			<th>Дистанция</th>
			<th>Особенности</th>
        </tr>
	`;
	
	equipmentPresets.weapons.forEach(preset => {
        if (preset.display)
        {
    	    section = document.createElement('tr');
    	    section.classList.add('data-segment');
    	    section.classList.add('case-sensitive');
    	    
    	    attributes = preset.attributes
                .map(attr => `${traitPresets[parseInt(attr.id)].name} ${attr.rank}`)
                .join(', <br>');
            
            let skill = availableSkills.find(item => item.id == preset.skill);
    	    
    	    section.innerHTML = `
    	        <td>${preset.name}</td>
                <td class="centered">${preset.weight}</td>
                <td class="centered">${preset.price}</td>
                <td class="centered">${preset.rarity}</td>
                <td>${skill.name}</td>
                <td class="centered">${preset.damage[0] == '+' ? availableChars[skill.attribute].name : ''} ${preset.damage}</td>
                <td class="centered">${preset.crit}</td>
                <td>${distanceMeasures[preset.distance]}</td>
                <td>${attributes}</td>
    	    `;
    	    container.appendChild(section);
        }
	});
}

function generateArmorHTML() 
{
	const container = document.getElementById('armor-container');
	container.innerHTML = `
		<tr>
			<th>Название брони</th>
			<th>Вес</th>
			<th>Цена</th>
			<th>Редкость</th>
			<th>Поглощение</th>
			<th>Защита</th>
			<th>Особенности</th>
        </tr>
	`;
	
	equipmentPresets.armor.forEach(preset => {
        if (preset.display)
        {
    	    section = document.createElement('tr');
    	    section.classList.add('data-segment');
    	    section.classList.add('case-sensitive');
    	    
    	    section.innerHTML = `
    	        <td>${preset.name}</td>
                <td class="centered">${preset.weight}</td>
                <td class="centered">${preset.price}</td>
                <td class="centered">${preset.rarity}</td>
                <td class="centered">${preset.absorption}</td>
                <td class="centered">${preset.defense}</td>
                <td>${preset.description ?? ''}</td>
    	    `;
    	    container.appendChild(section);
        }
	});
}

function generateItemsHTML() 
{
	const container = document.getElementById('equipment-container');
	container.innerHTML = `
		<tr>
			<th>Название предмета</th>
			<th>Вес</th>
			<th>Цена</th>
			<th>Редкость</th>
			<th>Особенности</th>
        </tr>
	`;
	
	equipmentPresets.items.forEach(preset => {
        if (preset.display)
        {
    	    section = document.createElement('tr');
    	    section.classList.add('data-segment');
    	    section.classList.add('case-sensitive');
    	    
    	    section.innerHTML = `
    	        <td>${preset.name}</td>
                <td class="centered">${preset.weight}</td>
                <td class="centered">${preset.price}</td>
                <td class="centered">${preset.rarity}</td>
                <td>${preset.description ?? ''}</td>
    	    `;
    	    container.appendChild(section);
        }
	});
}

async function retrieveTraitPresets(folder) 
{
    try {
        const response = await fetch(`./data/${folder}/attributes.json`);
        if (!response.ok)
            throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
        const data = await response.json();
		traitPresets = [];
		
        data.forEach(preset => {
            traitPresets[preset.id] = {
                'name': preset.name,
                'description': preset.description,
                'isActive': preset.isActive,
                'id': preset.id,
                'display': preset.display
            };
        });
        
        retrieveEquipmentPresets(folder);
        generateTraitHTML();
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function retrieveEquipmentPresets(folder) 
{
    try {
        const response = await fetch(`./data/${folder}/equipment.json`);
        if (!response.ok)
            throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
        const data = await response.json();
        data.weapons.forEach(preset => {
            equipmentPresets.weapons[preset.id] = {
                'name': preset.name,
                'skill': preset.skill,
                'hands': preset.hands,
                'damage': preset.damage,
                'crit': preset.crit,
                'distance': preset.distance,
                'weight': preset.weight,
                'price': preset.price,
                'rarity': preset.rarity,
                'attributes': preset.attributes,
                'id': preset.id,
                'display': preset.display
            };
        });
        equipmentPresets.weapons.sort(item => item.name);
        
        data.armor.forEach(preset => {
            equipmentPresets.armor[preset.id] = {
                'name': preset.name,
                'defense': preset.defense,
                'absorption': preset.absorption,
                'weight': preset.weight,
                'price': preset.price,
                'rarity': preset.rarity,
                'description': preset.description,
                'id': preset.id,
                'display': preset.display
            };
        });
        equipmentPresets.armor.sort(item => item.name);
        
        data.items.forEach(preset => {
            equipmentPresets.items[preset.id] = {
                'name': preset.name,
                'weight': preset.weight,
                'price': preset.price,
                'rarity': preset.rarity,
                'description': preset.description,
                'id': preset.id,
                'display': preset.display
            };
        });
        equipmentPresets.items.sort(item => item.name);
        
        
        Promise.all([skillDataLoading]).then(() => {
            generateWeaponsHTML();
        });
        generateArmorHTML();
        generateItemsHTML();
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

document.addEventListener('settingLoaded', (e) => {
    retrieveTraitPresets(e.detail.folder);
});