motivationPresets = {
    'wish': [],
    'fear': [],
    'benefit': [],
    'loss': []
};

function generateMotivationHTML() 
{
	Object.entries(motivationPresets).forEach(([category, data]) => {
	    let container = document.getElementById(`${category}-container`);
	    
	    data.forEach(preset => {
            section = document.createElement('div');
        	section.classList.add('section');
        	section.classList.add('data-segment');
        	
        	section.innerHTML = `
                <strong class="centered">${preset.name}</strong>
        	        ${preset.description}
        	`;
        	container.appendChild(section);
    	});
	});
}

async function retrieveMotivationPresets() 
{
    try {
        const response = await fetch('./data/motivations.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки пресетов: ${response.status}`);
		
        motivationPresets = await response.json();
        Object.values(motivationPresets).forEach(arr => arr.sort(item => item.name));
        
        generateMotivationHTML();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    retrieveMotivationPresets();
});