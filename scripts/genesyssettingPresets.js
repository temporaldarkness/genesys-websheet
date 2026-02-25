genesyssettingPresets = {};
genesyssettingInfo = {};
genesyssettingIds = [];

genesyssettingSelected = 'Fantasy';

async function retrieveGenesyssettingPresets() 
{
	try {
		const response = await fetch('./data/genesyssettings.json');
		if (!response.ok)
			throw new Error(`Ошибка загрузки сеттингов: ${response.status}`);
		
		const data = await response.json();
		data.forEach(preset => {
			genesyssettingPresets[preset.id] = {
				'name': preset.name,
				'display': preset.display,
				'id': preset.id,
				'folder': preset.folder,
			};
			genesyssettingIds.push(preset.id);
		});
		
	} catch (error) {
		console.error('Ошибка:', error);
	}
	if (!genesyssettingPresets[genesyssettingSelected])
		genesyssettingSelected = 'Fantasy';
	
	const select = document.getElementById('genesyssettingSelect');
	if (select)
	{
		genesyssettingIds.forEach(presetId => {
			let preset = genesyssettingPresets[presetId];
			if (preset.display)
			{
				let option = document.createElement('option');
				
				option.value = preset.id;
				option.innerHTML = preset.name;
				
				select.appendChild(option);
			}
		});
		
		select.value = genesyssettingSelected;
		
		setGenesyssettingPreset(genesyssettingSelected);
		
		select.addEventListener('change', function(){
			const warning = confirm('Изменение выбранного для персонажа сеттинга приведёт к сбросу всех несохранённых данных и полей. Продолжить?');
			if (warning) {
				updateGenesyssettingFromSelect(select)
			} else {
				this.value = genesyssettingSelected;
			}
		});
	} else {
		setGenesyssettingPreset(genesyssettingSelected);
	}
}

function updateGenesyssettingFromSelect(select) {
	genesyssettingSelected = select.value;
	localStorage.setItem('genesyssetting', genesyssettingSelected);
	setGenesyssettingPreset(genesyssettingSelected);
}

function loadGenesyssettingPreset(preset)
{
	document.dispatchEvent(new CustomEvent('settingLoaded', {
		detail: { preset: preset, folder: preset.folder },
		bubbles: true
	}));
	document.getElementById('genesyssetting').value = preset.name;
}


function setGenesyssettingPreset(preset)
{
	loadGenesyssettingPreset(genesyssettingPresets[preset]);
}

async function genesyssettingSetup()
{
    genesyssettingSelected = localStorage.getItem('genesyssetting') || genesyssettingSelected;
}

genesyssettingSetup();

document.addEventListener('DOMContentLoaded', () => {
	retrieveGenesyssettingPresets();
});