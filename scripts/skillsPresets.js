skillCategoryPresets = [];

function generateSkillsHTML(categories) 
{
	const container = document.getElementById('skills-container');
	
	container.innerHTML = '';
	
	skillCategoryPresets.forEach(category => {
		if (category.contents.length === 0)
			return;
		
		categorySection = document.createElement('div');
		categorySection.classList.add('data-segment');
		
		categoryHeader = document.createElement('h4');
		categoryHeader.classList.add('section-title');
		categoryHeader.innerHTML = category.name;
		categorySection.appendChild(categoryHeader);
		
		categoryContents = document.createElement('div');
		categoryContents.classList.add('wiki-spawnablegrid');
		
		category.contents.forEach(skill => {
			skillSection = document.createElement('div');
			skillSection.classList.add('data-segment');
			
			skillHeader = document.createElement('h4');
			skillHeader.classList.add('block-subtitle');
			skillHeader.innerHTML = skill.name;
			skillSection.appendChild(skillHeader);
			
			cases = "";
			
			if ((skill.useCases && skill.useCases.length > 0) || (skill.misuseCases && skill.misuseCases.length > 0))
			{
			    
			    if (skill.useCases && skill.useCases.length > 0)
    			{
    				cases += "<strong>Используйте этот навык, если...</strong>\n<ul class='no-margin'>\n";
    				skill.useCases.forEach(use => {
    					cases += `<li>${use}</li>\n`;
    				});
    				cases += "</ul>\n"
    			}
    			
    			if (skill.misuseCases && skill.misuseCases.length > 0)
    			{
    				cases += "<strong>Не используйте этот навык, если...</strong>\n<ul class='no-margin'>\n";
    				skill.misuseCases.forEach(misuse => {
    					cases += `<li>${misuse}</li>\n`;
    				});
    				cases += "</ul>\n"
    			}
			}
			
			skillContents = document.createElement('div');
			skillContents.classList.add('section');
			skillContents.innerHTML = `
				<p>
				    ${skill.description}
				    <br>
				    <br>
				    ${cases}
				</p>
			`;
			
			skillSection.appendChild(skillContents);
			categoryContents.appendChild(skillSection)
		});
		
		categorySection.appendChild(categoryContents);
		container.appendChild(categorySection)
	});
}

async function retrieveSkillsPresets() 
{
	try {
		const response = await fetch('./data/skills.json');
		
		if (!response.ok)
			throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
		const data = await response.json();
		
		skillCategoryPresets = data.skills.reduce((acc, skill) => {
			const categoryLocalId = skill['category'];
			const categoryId = data.categories[categoryLocalId].id;
			
			if (!acc[categoryId])
				acc.push({
					'name': data.categories[categoryLocalId].name,
					'description': data.categories[categoryLocalId].description,
					'contents': [],
					'categoryId': categoryId
				});
			
			if (skill.display)
			{
				acc[acc.length-1].contents.push({
					'name': skill.name,
					'display': skill.display,
					'attribute': skill.attribute,
					'category': skill.category,
					'description': skill.description,
					'useCases': skill.useCases,
					'misuseCases': skill.misuseCases
				});
			}
			return acc;
		}, []);
	} catch (error) {
		console.error('Ошибка:', error);
	}
	if (document.getElementById('skills-container'))
		generateSkillsHTML();
}

document.addEventListener('DOMContentLoaded', () => {
	retrieveSkillsPresets();
});