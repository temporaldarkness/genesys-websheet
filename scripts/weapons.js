document.addEventListener('DOMContentLoaded', () => {
	const table = document.querySelector('.weapons-table');
	
	const isRowFilled = row => {
		return Array.from(row.querySelectorAll('textarea'))
			.some(textarea => textarea.value.trim() !== '');
	};
	
	const updateTable = () => {
		const rows = Array.from(table.querySelectorAll('.weapon-row'));
		
		rows.forEach(row => {
            row.classList.toggle('filled', isRowFilled(row));
        });
		
		rows.slice(0, -1).forEach(row => {
			if (!isRowFilled(row) && !isRowFilled(row.nextElementSibling))
			{
			    row.classList.add('removing');
				setTimeout(() => row.remove(), 300);
			}
		});
		
		const lastRow = table.lastElementChild;
		
		if (lastRow && isRowFilled(lastRow))
		{
		    const row = document.createElement('div');
		    row.className = 'weapon-row removable';
		    row.innerHTML = `
		        <div class="weapon-cell name">
					<textarea class="misc-textarea noresize"></textarea>
				</div>
				<div class="weapon-cell skill">
					<textarea class="misc-textarea noresize"></textarea>
				</div>
				<div class="weapon-cell damage">
					<textarea class="misc-textarea noresize"></textarea>
				</div>
				<div class="weapon-cell crit">
					<textarea class="misc-textarea noresize"></textarea>
				</div>
				<div class="weapon-cell range">
					<textarea class="misc-textarea noresize"></textarea>
				</div>
				<div class="weapon-cell special">
					<textarea class="misc-textarea"></textarea>
				</div>
			`;
			
			row.style.opacity = '0';
			row.style.transform = 'translateY(10px)'
			
			table.appendChild(row);
			setTimeout(() => {
                row.style.opacity = '';
                row.style.transform = '';
            }, 10);
		}
	};
	
	table.addEventListener('input', debounce(updateTable, 300));
	table.addEventListener('click', debounce(updateTable, 300));
	
	updateTable();
});

function debounce(func, timeout = 300)
{
	let timer;
	
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => func.apply(this, args), timeout);
	};
}