function createNote()
{
	const container = document.getElementById('notesContainer');
    let section = document.createElement('div');
    section.className = 'section removable';
	section.innerHTML = `
	    <textarea class="misc-textarea" placeholder="Введите ваши заметки..."></textarea>
	`;
		
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
	const container = document.getElementById('notesContainer');
	
	const isSectionEmpty = section => {
		return (section.querySelector('textarea').value.trim() === '');
	};
	
	const updateSections = () => {
		const sections = Array.from(container.querySelectorAll('.section'));
		
		sections.forEach(section => {
            section.classList.toggle('filled', !isSectionEmpty(section));
        });
		
		sections.slice(0, -1).forEach(section => {
			if (isSectionEmpty(section) && section !== container.lastElementChild)
			{
			    section.classList.add('removing');
				setTimeout(() => section.remove(), 300);
			}
		});
		
		const lastSection = container.lastElementChild;
		
		if (lastSection && !isSectionEmpty(lastSection))
		{
		    createNote();
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