questionnaireQuestions = [];

function generateQuestionnaireHTML()
{
    const container = document.getElementById('questionnaire');
    
    questionnaireQuestions.forEach((category, cindex) => {
       category.checked = 0;
       
       categorySection = document.createElement('div');
       categorySection.classList.add('vertical-flex');
       
       categoryLabel = document.createElement('h3');
       categoryLabel.innerHTML = category.name;
       categoryLabel.classList.add('section-title');
       
       categoryContents = document.createElement('div');
       categoryContents.classList.add('vertical-flex');
       categoryContents.classList.add('wiki-vcenteredbox');
       
       category.questions.forEach((question, index) => {
          questionSection = document.createElement('div');
          questionSection.classList.add('field');
          
          checkmarkElement = document.createElement('input');
          checkmarkElement.type = 'checkbox';
          checkmarkElement.id = `questionnaire-${category.name}-${index}`;
          
          checkmarkElement.addEventListener('change', () => 
          {
            questionnaireUpdate()
          });
          
          labelElement = document.createElement('label');
          labelElement.innerHTML = question;
          labelElement.htmlFor = `questionnaire-${category.name}-${index}`;
          
          questionSection.appendChild(checkmarkElement);
          questionSection.appendChild(labelElement);
          categoryContents.appendChild(questionSection);
       });
        
        if ((cindex%4) < 2)
        {
            categorySection.appendChild(categoryLabel);
            categorySection.appendChild(categoryContents);
        }
        else
        {
            categorySection.appendChild(categoryContents);
            categoryLabel.classList.add('h3-line-switched');
            categorySection.appendChild(categoryLabel);
        }
        
        container.appendChild(categorySection);
    });
}

async function retrieveQuestionnaire()
{
    try {
        const response = await fetch('./data/questionnaire.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки тем: ${response.status}`);
		
        const data = await response.json();
        
        questionnaireQuestions = data;
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
    
    if (document.getElementById('questionnaire'))
        generateQuestionnaireHTML();
}

function questionnaireUpdate()
{
    const container = document.getElementById('questionnaire');
    
    let totals = [];
    
    questionnaireQuestions.forEach((category, index) => {
        categoryElement = container.children[index];
        
        category.checked = Array.from(categoryElement.querySelectorAll('input[type=checkbox]')).filter(checkbox => checkbox.checked).length;
        totals.push([index, category.checked]);
    });
    
    totals.sort((a, b) => b[1] - a[1]);
       
    document.getElementById('questionnaire-count').innerHTML = totals.reduce((acc, curr) => acc + curr[1], 0);
    document.getElementById('questionnaire-res1').innerHTML = questionnaireQuestions[totals[0][0]].name;
    document.getElementById('questionnaire-res2').innerHTML = questionnaireQuestions[totals[1][0]].name;
}

document.addEventListener('DOMContentLoaded', () => {
   retrieveQuestionnaire(); 
});