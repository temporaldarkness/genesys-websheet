document.addEventListener('DOMContentLoaded', function(e) 
{
	const imageInput = document.getElementById('character-image-input')
	const imageOutput = document.getElementById('character-image')
	
	imageInput.addEventListener('change', function(e)
	{
		const file = event.target.files[0];
		
		if (!file)
			return;
		
		if (!file.type.startsWith('image/'))
		{
			alert('Выбранный файл не является изображением');
			return;
		}
		
		if (file.size > 2 * 1024 * 1024 * 1024) 
		{
			alert('Файл слишком большой. Максимальный размер: 2GB.');
			return;
		}
		
		const imageUrl = URL.createObjectURL(file);
		imageOutput.src = imageUrl;
		imageOutput.style.display = 'block';
	});
})