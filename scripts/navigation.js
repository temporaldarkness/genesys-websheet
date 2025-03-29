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

document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('.nav-item.link').forEach(item => {
		item.addEventListener('click', function(){
			displaySection(this.id.split('-')[1]);
		});
	});
	
	displaySection('index');
});