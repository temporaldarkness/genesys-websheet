availableSides = {}

availableDice = {}

async function retrieveDice()
{
    try {
        const response = await fetch('./data/dice.json');
        if (!response.ok)
            throw new Error(`Ошибка загрузки костей: ${response.status}`);
		
        const data = await response.json();
        data.dice.forEach(dice => {
           availableDice[dice.id] = {
               name: dice.name,
               values: dice.values
            };
        });
        data.sides.forEach(side => {
           availableSides[side.id] = {
               name: side.name,
               image: side.image,
               glyph: side.glyph
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
    
    let result = [];
    choice.forEach(r => {
        result.push(dice[r]);
    })
    
    return result;
}

function createRollResult()
{
    let container = document.getElementById('diceroller-result');
    
    let resultBlock = document.createElement('span');
    resultBlock.className = 'section autoheight';
    resultBlock.innerHTML = `
        <div class="field bottomline">
            <div class="diceroller-resultdice">
                <span class="text-icon">&#9632; </span>
                <span class="text-icon">&#9670; </span>
                <span class="text-icon">&#11042; </span>
            </div>
            <div class="diceroller-resultdice">
                <span class="text-icon">&#9632; </span>
                <span class="text-icon">&#9670; </span>
                <span class="text-icon">&#11042; </span>
            </div>
        </div>
        <div class="field bottomline wrappable" data-type="rollresults"></div>
        <div class="field bottomline wrappable" data-type="rollresults"></div>
        <div class="field bottomline wrappable" data-type="rollresults"></div>
        <div class="field bottomline wrappable" data-type="rollresults"></div>
        <div class="field bottomline wrappable" data-type="rollresults"></div>
        <div class="field bottomline wrappable" data-type="rollresults"></div>
        <h4 class="block-subtitle"></h4>
        <h4 class="block-subtitle" style="display:none;">Триумфов : </h4>
        <h4 class="block-subtitle" style="display:none;">Крахов : </h4>
        <h4 class="block-subtitle" style="display:none;">Преимуществ : </h4>
        <h4 class="block-subtitle" style="display:none;">Осложнений : </h4>
    `;
    
    container.insertBefore(resultBlock, container.firstChild);
    return resultBlock;
}

function createRollResultSimple()
{
    let container = document.getElementById('diceroller-result');
    
    let resultBlock = document.createElement('span');
    resultBlock.className = 'section autoheight';
    resultBlock.innerHTML = `
        <div class="field bottomline">
            <div class="diceroller-resultdice">
                <span class="text-icon">&#9632; </span>
            </div>
        </div>
        <div class="field bottomline wrappable" data-type="rollresults"></div>
        <h4 class="block-subtitle"></h4>
    `;
    
    container.insertBefore(resultBlock, container.firstChild);
    return resultBlock;
}

function insertSideIcons(container, values)
{
    values.forEach(side => {
        img = document.createElement('img');
        img.className = 'icon';
        img.src = availableSides[side].image;
        container.appendChild(img);
    });
}

function pushRollResult(container, values)
{
    values.forEach(resultVal => {
        let resultSpan = document.createElement('div');
        resultSpan.className = 'text-icon icon-splitter';
        insertSideIcons(resultSpan, resultVal);
        
        container.appendChild(resultSpan);
    });
    
    if (values.length === 0)
        container.style = "display: none;"
}

function rollPool(dict)
{
    let result = [];
    
    Object.entries(dict).forEach(([key, value]) => {
        result.push({
            "id": parseInt(key),
            "values": roll(parseInt(key), value)
        });
    });
    return result;
}

function processRollResults(values)
{
    let result = {
        'triumphs': 0,
        'despairs': 0,
        'advantages': 0,
        'successes': 0
    };
    
    let handlers = {
        '1': () => {result.advantages++;},
        '-1': () => {result.advantages--;},
        '2': () => {result.successes++;},
        '-2': () => {result.successes--;},
        '3': () => {result.triumphs++;result.successes++;},
        '-3': () => {result.despairs++;result.successes--;},
        '0': () => {}
    }
    
    for (let val of values) handlers[val]();
    
    return result;
}

async function dicerollerSendRollToWebhook(flatResults, results, rolled)
{
    let webhook = document.getElementById('dice-webhook').value;
    if (!webhook || !webhook.startsWith('https://discord.com/api/webhooks/'))
        return;
    
    
    const payload = {
        embeds: [
            {
                author: {},
                description: "",
                footer: {
                    text: `Положительные : ⯀ ${rolled[0]} ◆ ${rolled[1]} ⬢ ${rolled[2]}\nОтрицательные :  ⯀ ${rolled[3]} ◆ ${rolled[4]} ⬢ ${rolled[5]}`
                },
                fields: [
                    {
                        name: "Кости Бонуса :",
                        value: ""
                    },
                    {
                        name: "Кости Способности :",
                        value: ""
                    },
                    {
                        name: "Кости Мастерства :",
                        value: ""
                    },
                    {
                        name: "Кости Штрафа :",
                        value: ""
                    },
                    {
                        name: "Кости Сложности :",
                        value: ""
                    },
                    {
                        name: "Кости Вызова :",
                        value: ""
                    }
                ]
            }
        ]
    };
    
    let selectedSkill = document.getElementById('dice-skillSelect').value;
    if (selectedSkill < 0)
    {
        selectedSkill = "";
    }
    else
    {
        selectedSkill = " " + availableSkills.find(item => item.id == selectedSkill).nameP;
    }
    
    let selectedDifficulty = document.getElementById('dice-difficultySelect');
    selectedDifficulty = selectedDifficulty.children[selectedDifficulty.value].text.split(' ')[0];
    
    payload.embeds[0].title = `Проверка${selectedSkill} (${selectedDifficulty}) — `;
    payload.embeds[0].color = flatResults.successes > 0 ? 40507 : 16711680;
    payload.embeds[0].title += flatResults.successes > 0 ? "Успех!" : "Провал!";
    if (flatResults.successes > 1)
        payload.embeds[0].title += " (" + flatResults.successes + ")";
    
    if (flatResults.triumphs > 0) payload.embeds[0].description += `\n**Триумфов** — ${flatResults.triumphs}`;
    if (flatResults.despairs > 0) payload.embeds[0].description += `\n**Крахов** — ${flatResults.despairs}`;
    if (flatResults.advantages > 0) payload.embeds[0].description += `\n**Преимуществ** — ${flatResults.advantages}`;
    if (flatResults.advantages < 0) payload.embeds[0].description += `\n**Осложнений** — ${-flatResults.advantages}`;
    
    payload.embeds[0].author.name = document.getElementById('charname').value;
    
    let wipes = [];
    results.forEach((res, index) => {
        if (res.values.length === 0)
        {
            wipes.push(index);
        }
        else
        {
            startFlag = true;
            res.values.forEach(val => {
                if (!startFlag)
                {
                    payload.embeds[0].fields[index].value += ", ";
                }
                else
                {
                    startFlag = false;
                }
                val.forEach(v => {
                    payload.embeds[0].fields[index].value += availableSides[v].glyph;
                })
            });
        }
    });
    wipes.reverse().forEach(i => {
        payload.embeds[0].fields.splice(i, 1);
    });
    
    try 
    {
        const response = await fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok)
            throw new Error(`Ошибка отправления вебхука: ${response.status}\n${response.statusText}`);
    }
    catch (error)
    {
        console.error('Ошибка сети:', error);
    }
}

async function dicerollerSendRollSimpleToWebhook(result, n)
{
    let webhook = document.getElementById('dice-webhook').value;
    if (!webhook || webhook.startsWith('https://discord.com/api/webhooks/'))
        return;
    
    const payload = {
        embeds: [
            {
                color: 33791,
                author: {},
                description: result,
                footer: {
                    text: `⯀ ${n}`
                }
            }
        ]
    };
    
    payload.embeds[0].title = `Бросок d${n} — ${result}`;
    payload.embeds[0].author.name = document.getElementById('charname').value;
    
    try 
    {
        const response = await fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok)
            throw new Error(`Ошибка отправления вебхука: ${response.status}\n${response.statusText}`);
    }
    catch (error)
    {
        console.error('Ошибка сети:', error);
    }
}

function dicerollerRoll()
{
    let amounts = [
        document.getElementById('diceroller-value1').value,
        document.getElementById('diceroller-value2').value,
        document.getElementById('diceroller-value3').value,
        document.getElementById('diceroller-valuen1').value,
        document.getElementById('diceroller-valuen2').value,
        document.getElementById('diceroller-valuen3').value
    ];
    
    let rollValue = rollPool({
        "1":  amounts[0],
        "2":  amounts[1],
        "3":  amounts[2],
        "-1": amounts[3],
        "-2": amounts[4],
        "-3": amounts[5]
    });
    
    let result = createRollResult();
    
    let htmlAmounts = result.querySelectorAll('.diceroller-resultdice');
    
    htmlAmounts[0].children[0].innerHTML += amounts[0];
    htmlAmounts[0].children[1].innerHTML += amounts[1];
    htmlAmounts[0].children[2].innerHTML += amounts[2];
    htmlAmounts[1].children[0].innerHTML += amounts[3];
    htmlAmounts[1].children[1].innerHTML += amounts[4];
    htmlAmounts[1].children[2].innerHTML += amounts[5];
    
    result.querySelectorAll('[data-type="rollresults"]').forEach((resultSpace, index) => {
        pushRollResult(resultSpace, rollValue[index].values);
    });
    
    let processedResults = processRollResults(rollValue.flatMap(dice => dice.values.flat()));
    
    let stats = result.querySelectorAll('.block-subtitle');
    
    let selectedSkill = document.getElementById('dice-skillSelect').value;
    if (selectedSkill < 0)
    {
        selectedSkill = "";
    }
    else
    {
        selectedSkill = " " + availableSkills.find(item => item.id == selectedSkill).nameP;
    }
    
    let selectedDifficulty = document.getElementById('dice-difficultySelect');
    selectedDifficulty = selectedDifficulty.children[selectedDifficulty.value].text.split(' ')[0];
    
    stats[0].innerHTML = `Проверка${selectedSkill} (${selectedDifficulty}) — `;
    stats[0].innerHTML += processedResults.successes > 0 ? "Успех !" : "Провал !";
    if (processedResults.successes > 1)
        stats[0].innerHTML += " ( " + processedResults.successes + " )";
    
    if (processedResults.triumphs > 0)
    {
        stats[1].style = "";
        stats[1].innerHTML += processedResults.triumphs;
    }
    if (processedResults.despairs > 0)
    {
        stats[2].style = "";
        stats[2].innerHTML += processedResults.despairs;
    }
    if (processedResults.advantages > 0)
    {
        stats[3].style = "";
        stats[3].innerHTML += processedResults.advantages;
    }
    if (processedResults.advantages < 0)
    {
        stats[4].style = "";
        stats[4].innerHTML += -processedResults.advantages;
    }
    
    dicerollerSendRollToWebhook(processedResults, rollValue, amounts);
}

function dicerollerRollSimple(n)
{
    let side = cryptoRandom(1, n, 1)[0];
    
    let result = createRollResultSimple();
    result.querySelector('.diceroller-resultdice').firstElementChild.innerHTML += n;
    let resultSpan = document.createElement('div');
    resultSpan.className = 'text-icon icon-splitter';
    let span = document.createElement('span');
    span.ClassName = 'icon';
    span.innerHTML = side;
    resultSpan.appendChild(span);
    result.querySelector('[data-type="rollresults"]').appendChild(resultSpan);
    result.querySelector('.block-subtitle').innerHTML += `Бросок d${n} — ${side}`;
    
    dicerollerSendRollSimpleToWebhook(side, n)
}

function dicerollerEmpower(alignment = true)
{
    inputLower = 'diceroller-value'+ (alignment ? '' : 'n') +'2';
    inputHigher = 'diceroller-value'+ (alignment ? '' : 'n') +'3';
    
    
    inputLower = document.getElementById(inputLower);
    inputHigher = document.getElementById(inputHigher);
    
    amount = 'diceroller-adjust'+ (alignment ? '' : 'n') +'1';
    amount = document.getElementById(amount);
    
    
    while (amount.value > 0)
    {
        if(inputLower.value > 0)
        {
            inputLower.value--;
            inputHigher.value++;
        }
        else
        {
            inputLower.value++;
        }
        amount.value--;
    }
    
    
}

function dicerollerWeaken(alignment = true)
{
    inputLower = 'diceroller-value'+ (alignment ? '' : 'n') +'2';
    inputHigher = 'diceroller-value'+ (alignment ? '' : 'n') +'3';
    
    
    inputLower = document.getElementById(inputLower);
    inputHigher = document.getElementById(inputHigher);
    
    amount = 'diceroller-adjust'+ (alignment ? '' : 'n') +'2';
    amount = document.getElementById(amount);
    
    while (amount.value > 0)
    {
        if(inputHigher.value > 0)
        {
            inputHigher.value--;
            inputLower.value++;
        }
        amount.value--;
    }
}

function skillSelect(value)
{
    let skill = availableSkills.find(item => item.id == value);
    let attribute = availableChars[skill.attribute];
    
    let attributeValue = document.getElementById(attribute.uid).value;
    let skillValue = document.getElementById('skills-container')
        .querySelector(`[data-skill-id="${skill.id}"]`)
        .querySelector(`.rank-selector`)
        .dataset.rank;
    
    document.getElementById('diceroller-value2').value = Math.abs(attributeValue - skillValue);
    document.getElementById('diceroller-value3').value = Math.min(attributeValue, skillValue);
    
    
}

document.addEventListener('DOMContentLoaded', () => {
    retrieveDice();
    
    document.getElementById('diceroller-roll').addEventListener('click', () => {
        dicerollerRoll();
    });
    
    document.getElementById('diceroller-rollSimple10').addEventListener('click', () => {
        dicerollerRollSimple(10);
    });
    
    document.getElementById('diceroller-rollSimple100').addEventListener('click', () => {
        dicerollerRollSimple(100);
    });
    
    document.getElementById('diceroller-empower-a').addEventListener('click', () => {
        dicerollerEmpower(true);
    });
    
    document.getElementById('diceroller-empower-b').addEventListener('click', () => {
        dicerollerEmpower(false);
    });
    
    document.getElementById('diceroller-weaken-a').addEventListener('click', () => {
        dicerollerWeaken(true);
    });
    
    document.getElementById('diceroller-weaken-b').addEventListener('onclick', () => {
        dicerollerWeaken(false);
    });
    
    document.getElementById('dice-difficultySelect').addEventListener('change', function(){
        document.getElementById('diceroller-valuen2').value = parseInt(this.value);
    });
    
    document.getElementById('dice-skillSelect').addEventListener('change', function(){
        skillSelect(parseInt(this.value));
    });
    
});
