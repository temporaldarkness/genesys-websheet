availableDice = {}

async function retrieveDice()
{
    try {
        const response = await fetch('./data/dice.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки костей: ${response.status}`);
		
        const data = await response.json();
        data.forEach(dice => {
           availableDice[dice.id] = {
               'name': dice.name,
               'values': dice.values
            };
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function cryptoRandom(n = 1, max = 9, min = 0)
{
    buffer = new Uint32Array(n);
    window.crypto.getRandomValues(buffer);
    
    result = [];
    
    buffer.forEach(num => {
        num = num % (max-min+1);
        num += min;
        result.push(num);
    });
    
    return result;
}

function roll(diceId, n = 1)
{
    dice = availableDice[diceId].values;
    sides = dice.length;
    choice = cryptoRandom(n, dice.length-1);
    
    result = [];
    choice.forEach(r => {
        result.push(dice[r]);
    })
    
    return result;
}

document.addEventListener('DOMContentLoaded', retrieveDice());