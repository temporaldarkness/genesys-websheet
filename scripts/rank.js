document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('.rank-selector').forEach(container => {
		const dots = container.querySelectorAll('.rank-dot');
		let currentRank = parseInt(container.dataset.rank);
		dots.forEach((d, index) => {
		const isActive = index < currentRank;
			d.classList.toggle('active', isActive);
		});
		container.dataset.rank = currentRank;
		
		container.addEventListener('click', function(e) {
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
		
		container.addEventListener('update', function(e) {
			dots.forEach((d, index) => {
			const isActive = index < e.currentTarget.dataset.rank;
				d.classList.toggle('active', isActive);
			});
		});
	}
)});