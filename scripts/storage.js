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
	'text-money'
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

function downloadData()
{
	const data = collectData();
	const json = JSON.stringify(data, null, 2);
	
	const blob = new Blob([json], {type:'application/json'});
	const url = URL.createObjectURL(blob);
	
	const a = document.createElement('a');
	a.href = url;
	a.download = 'form-data.json';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function collectData()
{
	const data = {
		'index': collectIndex(),
		'skills': collectSkills(),
		'equipment': collectEquipment(),
		'talents': collectTalents(),
		'pyramid': collectPyramid(),
		'bio': collectBio(),
		'notes': collectNotes()
	};
	
	return data;
}

function collectIndex()
{
	let data = {};
	
	indexIDs.forEach(field => {
		data[field] = document.getElementById(field).value;
	});
	
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
	
	const categories = document.getElementById('skills-container')
								.querySelectorAll('.skill-category');
	
	data['categories'] = [];
	categories.forEach(category => {
		catData = {};
		
		catData['name'] = category.querySelector('.skill-header').firstElementChild.innerHTML;
		catData['skillList'] = [];
		
		skills = category.querySelectorAll('.skill-item');
		skills.forEach(skill => {
			catData['skillList'].push({
				'name': skill.querySelector('.skill-name').innerHTML,
				'set': skill.querySelector('input').checked,
				'rank': skill.querySelector('.rank-selector').dataset.rank
			});
		});
		
		data['categories'].push(catData);
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
		data.push({
			'name': section.querySelector('input').value,
			'misc': section.querySelector('textarea').value
		});
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

function uploadData()
{
	const inp = document.getElementById('uploadinput');
	
	if (inp.files.length == 0)
		return;
	
	const file = inp.files[0];
	
	const reader = new FileReader();
	
	reader.onload = function(e) 
	{
		try 
		{
			const data = JSON.parse(e.target.result);
			
			aknowledgeData(data);
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
}

function setIndex(data)
{
	indexIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
}

function setSkills(data)
{
	skillsIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
	
	const categories = document.getElementById('skills-container')
								.querySelectorAll('.skill-category');
	categories.forEach(category => {
		
		data['categories'].forEach(catData => {
			if (catData['name'] == category.querySelector('.skill-header').firstElementChild.innerHTML)
			{
				skills = category.querySelectorAll('.skill-item');
				skills.forEach(skill => {
					nm = skill.querySelector('.skill-name').innerHTML;
					archived = catData['skillList'].find(item => item.name == nm);
					
					if (archived)
					{
						skill.querySelector('input').checked = archived.set;
						
						selector = skill.querySelector('.rank-selector');
						selector.dataset.rank = archived.rank;
						
						selector.dispatchEvent(new CustomEvent('update', {
							detail: {},
							bubbles: true
						}))
					}
				});
			}
		});
	});
	
	return data;
}

function setEquipment(data)
{
	equipmentIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
}

function setTalents(data)
{
	
}

function setPyramid(data)
{
	
}

function setBio(data)
{
	bioIDs.forEach(field => {
		document.getElementById(field).value = data[field];
	});
	
	specifics = document.querySelectorAll('.motivation-large-input');
	specifics[0].value = data['specific']['benefit'];
	specifics[1].value = data['specific']['loss'];
	specifics[2].value = data['specific']['wish'];
	specifics[3].value = data['specific']['fear'];
}

function setNotes(data)
{
	
}