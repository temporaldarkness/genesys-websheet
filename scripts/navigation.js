function displaySection(sectionId)
{
	document.querySelectorAll('.document-section').forEach(section => {
		section.classList.remove('active');
	});
	document.querySelectorAll('.nav-item.link').forEach(item => {
		item.classList.remove('active');
	});
	document.getElementById("nav-" + sectionId).classList.add('active');
	document.getElementById(sectionId).classList.add('active');
}

function openLink(url, inNewWindow = false)
{
	if (inNewWindow) {
		const newWindow = window.open(url, '_blank');
		if (newWindow) newWindow.focus();
	} else {
		window.location.href = url;
	}
}

document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('.nav-item.link').forEach(item => {
		item.addEventListener('click', function(){
			displaySection(this.id.split('-')[1]);
		});
	});
	
	document.querySelectorAll('.nav-item.outerlink').forEach(item => {
		item.addEventListener('click', function(){
			const inNewWindow = this.classList.contains('newwindow');
			openLink(this.dataset.link, inNewWindow);
		});
	});
	
	displaySection('index');
});