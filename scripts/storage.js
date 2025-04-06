const appVersion = 0.5;

const indexIDs = [
	'charname', 
	'archetype', 
	'career', 
	'player', 
	'absorption',
	'wounds-max', 'wounds-current',
	'fatigue-max', 'fatigue-current',
	'defense-melee', 'defense-ranged',
	'strength',
	'agility',
	'intelligence',
	'wits',
	'willpower',
	'charisma'
]

const skillsIDs = [
	'exp-available',
	'exp-total'
]

const equipmentIDs = [
	'text-armor',
	'text-equipment',
	'text-money',
	'weight-total',
	'weight-available'
]

const diceRollerIDs = [
	'dice-webhook'
]

const bioIDs = [
	'gender',
	'age',
	'height',
	'constitution',
	'hair',
	'eyes',
	'description-misc',
	'benefit',
	'loss',
	'wish',
	'fear'
]

function sanitize(input)
{
    const forbiddenChars = /[\\/:*?"<>|]/g;

    let sanitized = input.replace(forbiddenChars, '');
    sanitized = sanitized.trim();

    return sanitized;
}

function downloadData()
{
	const filename = document.getElementById('downloadinput-name').textContent ?? 'data.json';
	const data = collectData();
	const json = JSON.stringify(data, null, 2);
	
	const blob = new Blob([json], {type:'application/json'});
	const url = URL.createObjectURL(blob);
	
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function collectData()
{
	const data = {
	    'designation': {
	        'ttrpg': 'Genesys',
	        'list_creator': 'temporaldarkness',
	        'version': appVersion
	    },
		'index': collectIndex(),
		'skills': collectSkills(),
		'equipment': collectEquipment(),
		'talents': collectTalents(),
		'pyramid': collectPyramid(),
		'bio': collectBio(),
		'notes': collectNotes(),
		'diceRoller': collectDiceRoller(),
	};
	
	return data;
}

function collectIndex()
{
	let data = {};
	
	indexIDs.forEach(field => {
		data[field] = document.getElementById(field).value;
	});
	
	data.careerSelected = document.getElementById('careerSelect').value;
	data.archetypeSelected = document.getElementById('archetypeSelect').value;
	
	const injuries = document.getElementById('injuries').querySelectorAll('.section.filled')
	
	data['injuries'] = [];
	injuries.forEach(section => {
		data['injuries'].push({
			'rank': section.querySelector('.rank-selector').dataset.rank,
			'misc': section.querySelector('.misc-textarea').value
		});
	});
	
	return data;
}

function collectSkills()
{
	let data = {};
	
	skillsIDs.forEach(field => {
		data[field] = document.getElementById(field).value;
	});
	
	data['skills'] = [];
	const skills = document.getElementById('skills-container')
								.querySelectorAll('.skill-item');
	skills.forEach(skill => {
		data['skills'].push({
			'id': skill.dataset.skillId,
			'set': skill.querySelector('input').checked,
			'rank': skill.querySelector('.rank-selector').dataset.rank
		});
	});
	
	return data;
}

function collectEquipment()
{
	let data = {};
	
	equipmentIDs.forEach(field => {
		data[field] = document.getElementById(field).value;
	});
	
	const weaponRows = document.getElementById('weapons-table')
								.querySelectorAll('.weapon-row.filled');
	
	data['weapons'] = [];
	weaponRows.forEach(row => {
		data['weapons'].push({
			'name': row.querySelector('.name').firstElementChild.value,
			'skill': row.querySelector('.skill').firstElementChild.value,
			'damage': row.querySelector('.damage').firstElementChild.value,
			'crit': row.querySelector('.crit').firstElementChild.value,
			'range': row.querySelector('.range').firstElementChild.value,
			'special': row.querySelector('.special').firstElementChild.value,
		});
	});
	
	return data;
}

function collectTalents()
{
	let data = [];
	
	const talents = document.getElementById('talents').querySelectorAll('.section.filled');
	
	
	talents.forEach(section => {
	    info = {
			'name': section.querySelector('input').value,
			'misc': section.querySelector('textarea').value,
		};
		
		if (section.dataset.source)
	        info['source'] = section.dataset.source;
	        
		data.push(info);
	});
	
	return data;
}

function collectPyramid()
{
	let data = {};
	
	const levels = document.querySelectorAll('.level');
	
	inc = 1;
	levels.forEach(level => {
		data['level-' + inc] = [];
		
		talents = level.querySelectorAll('.section.filled');
		
		talents.forEach(section => {
			data['level-' + inc].push({
				'name': section.querySelector('.talent-name').value,
				'set': section.querySelector('.talent-active').checked,
				'desc': section.querySelector('.talent-desc').value
			});
		});
		inc++;
	});
	
	return data;
}

function collectBio()
{
	let data = {};
	
	bioIDs.forEach(field => {
		data[field] = document.getElementById(field).value;
	});
	
	data['character-image'] = document.getElementById('character-image').src;
	
	specifics = document.querySelectorAll('.motivation-large-input');
	data['specific'] = {
		'benefit': specifics[0].value,
		'loss': specifics[1].value,
		'wish': specifics[2].value,
		'fear': specifics[3].value
	};
	
	return data;
}

function collectNotes()
{
	let data = [];
	
	const container = document.getElementById('notesContainer');
	
	notes = container.querySelectorAll('.section.filled');
	notes.forEach(note => {
		data.push(note.firstElementChild.value);
	})
	
	return data;
}

function collectDiceRoller()
{
    let data = {};
    
    diceRollerIDs.forEach(field => {
		data[field] = document.getElementById(field).value;
	});
    
    return data;
}

function loadData(data)
{
    aknowledgeData(data);
}

function aknowledgeData(data)
{
	setIndex(data['index']);
	setSkills(data['skills']);
	setEquipment(data['equipment']);
	setTalents(data['talents']);
	setPyramid(data['pyramid']);
	setBio(data['bio']);
	setNotes(data['notes']);
	setDiceRoller(data['diceRoller']);
}

function setIndex(data)
{
	document.getElementById('downloadinput-name').innerHTML = `${sanitize(data.charname) ?? 'data'}.json`;
	
	indexIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
	
	document.getElementById('careerSelect').value = data.careerSelected;
	document.getElementById('archetypeSelect').value = data.archetypeSelected;
	
	document.getElementById('injuries').replaceChildren();
	
	data['injuries'].forEach(msg => {
	    trauma = createTrauma();
	    trauma.querySelector('.misc-textarea').value = msg['misc'];
		trauma.classList.add('filled');
	    
	    let selector = trauma.querySelector('.rank-selector');
	    
	    selector.dataset.rank = msg['rank'];
	    selector.dispatchEvent(new CustomEvent('update', {
			detail: {},
			bubbles: true
		}));
	});
	
	createTrauma();
}

function setSkills(data)
{
	skillsIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
	
	container = document.getElementById('skills-container');
	
	data['skills'].forEach(msg => {
	    skill = container.querySelector(`.skill-item[data-skill-id="${msg.id}"]`);
	    skill.querySelector('input').checked = msg.set;
	    
	    selector = skill.querySelector('.rank-selector');
		selector.dataset.rank = msg.rank;
		selector.dispatchEvent(new CustomEvent('update', {
			detail: {},
			bubbles: true
		}));
	    
	});
	
	return data;
}

function setEquipment(data)
{
	equipmentIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
	
	document.getElementById('weapons-table').replaceChildren(document.querySelector('#weapons-table .weapon-header'));
	
	data['weapons'].forEach(msg => {
	    weapon = createWeapon();
		weapon.classList.add('filled');
	    weapon.querySelector('.name').firstElementChild.value = msg['name'];
	    weapon.querySelector('.skill').firstElementChild.value = msg['skill'];
	    weapon.querySelector('.damage').firstElementChild.value = msg['damage'];
	    weapon.querySelector('.crit').firstElementChild.value = msg['crit'];
	    weapon.querySelector('.range').firstElementChild.value = msg['range'];
	    weapon.querySelector('.special').firstElementChild.value = msg['special'];
	    
	});
	
	createWeapon();
}

function setTalents(data)
{
	document.querySelector('.talents').replaceChildren();
	
	data.forEach(msg => {
	    talent = createTalent();
		talent.classList.add('filled');
	    talent.querySelector('input').value = msg['name'];
	    talent.querySelector('textarea').value = msg['misc'];
	    if (msg['source'])
	        talent.dataset.source = msg['source'];
	});
	
	createTalent();
}

function setPyramid(data)
{
	const levels = document.querySelectorAll('.level');
	
	inc = 1;
	levels.forEach(level => {
	    level.replaceChildren();
	    
	    data['level-' + inc].forEach(msg => {
	        talent = createPyramidTalent(inc);
    	    talent.classList.add('filled');
	        talent.querySelector('.talent-name').value = msg['name'];
	        talent.querySelector('.talent-active').checked = msg['set'];
	        talent.querySelector('.talent-desc').value = msg['desc'];
	    });
	    
	    createPyramidTalent(inc);
	    inc++;
	});
}

function setBio(data)
{
	bioIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
	
	document.getElementById('character-image').src = data['character-image'];
	
	specifics = document.querySelectorAll('.motivation-large-input');
	specifics[0].value = data['specific']['benefit'];
	specifics[1].value = data['specific']['loss'];
	specifics[2].value = data['specific']['wish'];
	specifics[3].value = data['specific']['fear'];
}

function setNotes(data)
{
	document.getElementById('notesContainer').replaceChildren();
	
	data.forEach(msg => {
	    note = createNote();
    	note.classList.add('filled');
	    note.firstElementChild.value = msg;
	});
	
	createNote();
}

function setDiceRoller(data)
{
    diceRollerIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
}

document.addEventListener('DOMContentLoaded', function(e) 
{
	const fileInput = document.getElementById('uploadinput');
	const fileName = document.getElementById('uploadinput-name');
	
	fileInput.addEventListener('change', function(e)
	{
		const file = event.target.files[0];
		
		if (!file)
			return;
		
		if (!file.name.endsWith('.json'))
		{
			alert('Выбранный файл не является листом!');
			return;
		}
		
		if (file.size > 2 * 1024 * 1024 * 1024) 
		{
			alert('Файл слишком большой. Максимальный размер: 2GB.');
			return;
		}
		fileName.innerHTML = file.name ?? "...";
		
		const reader = new FileReader();
	    
    	reader.onload = function(e) 
    	{
    		try 
    		{
    			const data = JSON.parse(e.target.result);
    			
    			loadData(data);
    		}
    		catch (error)
    		{
    			console.log('Ошибка парсинга JSON: ' + error.message);
    		}
    	};
    	
    	reader.onerror = function()
    	{
    		console.log('Ошибка чтения файла');
    	};
    	
    	reader.readAsText(file);
	});
	
	document.getElementById('charname').addEventListener('input', (e) => {
	    document.getElementById('downloadinput-name').innerHTML = `${sanitize(e.target.value) ?? 'data'}.json`;
	});
})