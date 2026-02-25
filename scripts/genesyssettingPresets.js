genesyssettingPresets = {};
genesyssettingInfo = {};
genesyssettingIds = [];

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
		
		select.addEventListener('change', function(){
			setGenesyssettingPreset(parseInt(this.value));
		});
	}
}

function loadGenesyssettingPreset(preset)
{
	document.getElementById('genesyssetting').value = preset.name;
	
	// Здесь будет соответствующая логика.
}


function setGenesyssettingPreset(preset)
{
	loadGenesyssettingPreset(genesyssettingPresets[preset]);
}

document.addEventListener('DOMContentLoaded', () => {
	retrieveGenesyssettingPresets();
});