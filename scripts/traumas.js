function createTrauma()
{
    const container = document.querySelector('.critical-injuries');
    
    let section = document.createElement('div');
    section.className = 'section removable';
    section.innerHTML = `
        <div class="field bottomline">
            <label>Тяжесть : </label>
            <div class="rank-selector" data-rank="0">
                <div class="rank-dot" data-value="0"></div>
                <div class="rank-dot" data-value="1"></div>
				<div class="rank-dot" data-value="2"></div>
			</div>
		</div>
		<div class="field">
			<label for="desc">Результат : </label>
		</div>
		<div class="field misc-field">
			<textarea placeholder="Введите результат" class="misc-textarea"></textarea>
		</div>
	`;
	
	const selector = section.querySelector('.rank-selector');
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
	
	section.style.opacity = '0';
	section.style.transform = 'translateY(10px)'
	
	container.appendChild(section);
	setTimeout(() => {
        section.style.opacity = '';
        section.style.transform = '';
    }, 10);
    
    return section;
}

document.addEventListener('DOMContentLoaded', () => {
	const container = document.querySelector('.critical-injuries');
	
	const isSectionEmpty = section => {
		return (
			section.querySelector('[data-rank]').dataset.rank == '0' &&
			section.querySelector('textarea').value.trim() === ''
		);
	};
	
	const updateSections = () => {
		const sections = Array.from(container.querySelectorAll('.section'));
		
		sections.forEach(section => {
            section.classList.toggle('filled', !isSectionEmpty(section));
        });
		
		sections.slice(0, -1).forEach(section => {
			if (isSectionEmpty(section) && isSectionEmpty(section.nextElementSibling))
			{
			    section.classList.add('removing');
				setTimeout(() => section.remove(), 300);
			}
		});
		
		const lastSection = container.lastElementChild;
		
		if (lastSection && !isSectionEmpty(lastSection))
		{
		    createTrauma();
		}
	};
	
	container.addEventListener('input', debounce(updateSections, 300));
	container.addEventListener('click', debounce(updateSections, 300));
	
	updateSections();
});

function debounce(func, timeout = 300)
{
	let timer;
	
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => func.apply(this, args), timeout);
	};
}