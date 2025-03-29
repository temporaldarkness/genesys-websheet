function generateHTML(data) 
{
	const container = document.querySelector('.skills-container');
	container.innerHTML = '';
	
	data.forEach(data => {
		if (data.display)
		{
			category = document.createElement('div');
			category.classList.add('skill-category');
			
			header = document.createElement('div');
			header.classList.add('skill-header', 'bottomline');
			
			header.innerHTML = `
				<span>${data.category}</span>
				<span>Карьерный?</span>
				<span>Ранг</span>
			`;
			category.appendChild(header);
			
			grid = document.createElement('div');
			grid.classList.add('skills-grid');
			
			data.skills.forEach(skill => {
				if (skill.display)
				{
					const item = document.createElement('div');
					item.classList.add('skill-item');
					
					item.innerHTML = `
						<span class="skill-name">${skill.name} (${skill.attribute})</span>
						<input type="checkbox">
					`;
					
					selector = document.createElement('div');
					selector.classList.add('rank-selector');
					selector.dataset.rank = '0';
					selector.innerHTML = `
						<div class="rank-dot" data-value="0"></div>
						<div class="rank-dot" data-value="1"></div>
						<div class="rank-dot" data-value="2"></div>
						<div class="rank-dot" data-value="3"></div>
						<div class="rank-dot" data-value="4"></div>
					`
					item.appendChild(selector);
					grid.appendChild(item);
					
					const dots = selector.querySelectorAll('.rank-dot');
					
					selector.addEventListener('click', function(e) {
						const dot = e.target.closest('.rank-dot');
						if (!dot)
							return;
						
						currentRank = parseInt(dot.dataset.value) + 1;
						if (e.currentTarget.dataset.rank == currentRank)
							currentRank = 0;
						
						dots.forEach((d, index) => {
						const isActive = index < currentRank;
							d.classList.toggle('active', isActive);
						});
						e.currentTarget.dataset.rank = currentRank;
					});
					
					selector.addEventListener('update', function(e) {
            			dots.forEach((d, index) => {
            			const isActive = index < e.currentTarget.dataset.rank;
            				d.classList.toggle('active', isActive);
            			});
            		});
				}
			});
			category.appendChild(grid);
			container.appendChild(category);
		}
	});
}

async function loadSkillsData() 
{
    try {
        const response = await fetch('./data/skills.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
		
        const data = await response.json();
        generateHTML(data);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadSkillsData());