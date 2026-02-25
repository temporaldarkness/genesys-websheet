genesyssettingPresets = {};
genesyssettingInfo = {};
genesyssettingIds = [];

genesyssettingSelected = 'Broken Arcadia';

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
	select = document.getElementById('genesyssettingSelect');
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
			genesyssettingSelected = this.value;
			localStorage.setItem('genesyssetting', genesyssettingSelected);
			setGenesyssettingPreset(genesyssettingSelected);
		});
	}
}

function loadGenesyssettingPreset(preset)
{
	document.getElementById('genesyssetting').value = preset.name;
	
	document.dispatchEvent(new CustomEvent('settingLoaded', {
		detail: { preset: preset, folder: preset.folder },
		bubbles: true
	}));
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