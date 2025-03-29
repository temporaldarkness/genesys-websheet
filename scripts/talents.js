document.addEventListener('DOMContentLoaded', () => {
	const container = document.querySelector('.talents');
	
	const isSectionEmpty = section => {
		return (
			section.querySelector('.talent-name').value.trim() === '' &&
			section.querySelector('.talent-desc').value.trim() === ''
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
		    const section = document.createElement('div');
		    section.className = 'section removable';
		    section.innerHTML = `
		        <div class="field  bottomline">
					<label>Название : </label>
					<input type="text" class="talent-name" placeholder="Введите название">
				</div>
					<div class="field">
					<label>Описание : </label>
				</div>
					<div class="field misc-field">
					<textarea placeholder="Введите описание" class="misc-textarea talent-desc"></textarea>
				</div>
			`;
			
			section.style.opacity = '0';
			section.style.transform = 'translateY(10px)'
			
			container.appendChild(section);
			setTimeout(() => {
                section.style.opacity = '';
                section.style.transform = '';
            }, 10);
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