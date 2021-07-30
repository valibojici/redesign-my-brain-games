var TOTAL_ROUNDS = parseInt(document.getElementById('initial-count').value);
var INITIAL_DURATION = parseInt(document.getElementById('initial-duration').value);

document.getElementById('initial-duration-value').textContent = document.getElementById('initial-duration').value;
document.getElementById('initial-count-value').textContent = document.getElementById('initial-count').value;



const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const resultsContainer = document.getElementById('results-container');

const startBtn = document.getElementById('start-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
 

[startBtn, tryAgainBtn].forEach(btn => btn.addEventListener('click', setup) );

function setup(event)
{
    startContainer.classList.add('hide');
    gameContainer.classList.remove('hide');

    let rounds = TOTAL_ROUNDS;
    let symbolDuration = INITIAL_DURATION;
    
    let tests = generateTests(TOTAL_ROUNDS);
    console.log(tests);

    const symbol = document.getElementById('symbol');
    const inputContainer = document.getElementById('input-container');
    const countdown = document.getElementById('countdown');
    const roundCounter = document.getElementById('rounds')
    const milliseconds = document.getElementById('milliseconds')
    
    milliseconds.textContent = symbolDuration;
    roundCounter.textContent = `${rounds}`;

    symbol.classList.add('hide');
    inputContainer.classList.add('hide');

    if(event.target === startBtn){
        startContainer.classList.add('hide');          
    }
    else if(event.target === tryAgainBtn){
        resultsContainer.classList.add('hide');
    }
        
    countdown.classList.remove('hide');
    resetSquares();

    setTimeout(()=>{
        countdown.textContent = '3';
    }, 0);

    setTimeout(()=>{
        countdown.textContent = '2';
    }, 1000);

    setTimeout(()=>{
        countdown.textContent = '1';
    }, 2000)

    setTimeout(()=>{
        countdown.classList.add('hide');
        setTimeout(run, 1000);
    }, 3000);

    function run(){
        rounds--;
        if(rounds < 0){
            terminate();
        }

        milliseconds.textContent = symbolDuration;
        roundCounter.textContent = rounds + 1;

        symbol.classList.remove('hide');
        drawSymbols(tests[rounds].symbolList, symbolDuration, symbol, handleInput);
        
        function handleInput(){
            symbol.classList.add('hide');
            inputContainer.classList.remove('hide');

            let firstDigitInput = document.getElementById('first-digit');
            let secondDigitInput = document.getElementById('second-digit');

            firstDigitInput.focus();
            
            firstDigitInput.addEventListener('input',e=>{
                secondDigitInput.focus();
            });

            secondDigitInput.addEventListener('input',e=>{
                confirmButton.focus();
            })

            firstDigitInput.value = '';
            secondDigitInput.value = '';
            let confirmButton = document.getElementById('confirm-button');

            confirmButton.addEventListener('click', checkInput);
        }

        function checkInput(){
            let firstDigitInput = document.getElementById('first-digit');
            let secondDigitInput = document.getElementById('second-digit');

            let firstDigit = parseInt(firstDigitInput.value);
            let secondDigit = parseInt(secondDigitInput.value);
            if(!isDigit(firstDigit) || !isDigit(secondDigit)){
                return;
            }
            tests[rounds].isCorrect = (firstDigit === tests[rounds].firstDigit && secondDigit === tests[rounds].secondDigit);
            
            symbolDuration = checkAnswer(tests[rounds].isCorrect, symbolDuration);

            let confirmButton = document.getElementById('confirm-button');
            confirmButton.removeEventListener('click', checkInput);

            inputContainer.classList.add('hide');
            setTimeout(run, 1500);
        }
    }

    function terminate(){
        gameContainer.classList.add('hide');
        resultsContainer.classList.remove('hide');
        return;
    }
}

function random_int(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function isDigit(c){
    return parseInt(c) >= 0 && parseInt(c) <= 9;
}

function updateDurationText(val){
    INITIAL_DURATION = parseInt(val);
    document.getElementById('initial-duration-value').textContent = val;
}

function updateCountText(val){
    TOTAL_ROUNDS = parseInt(val);
    document.getElementById('initial-count-value').textContent = val;
}

function generateSymbols(isQuick){
    symbols = [];
    let length = random_int(15, 23);
    for(let i=0; i<length; ++i){
        let letterCode = random_int(65, 65 + 26 - 1);
        let letter = String.fromCharCode(letterCode);
        if(i > 4 && i < length - 4 && random_int(0, 2) == 0){
            symbols.push(' ');
            if(random_int(0, 1) == 0){
                symbols.push(' ');
                symbols.push(' ');
            }
        }
        while(symbols[symbols.length - 1] === letter || letter === 'I' || letter === 'O'){
            letterCode = random_int(65, 65 + 26 - 1);
            letter = String.fromCharCode(letterCode);
        }
        symbols.push(letter);
    }

    let digit1Index = random_int(4, symbols.length - 8);
    let digit2Index = random_int(digit1Index+2,digit1Index + 3);

    if(isQuick){
        digit2Index = digit1Index + 1;
    }

    symbols[digit1Index] = random_int(1, 9);
    symbols[digit2Index] = random_int(1, 9);
    while(symbols[digit2Index] === symbols[digit1Index]){
        symbols[digit2Index] = random_int(1, 9);
    }
    return symbols;
}

function generateTests(length){
    let temp = [];
    for(let i=0; i<length; ++i){
        let symbols = generateSymbols((i < length / 2));
        let firstDigit = -1, secondDigit = -1;

        for(let symbol of symbols){
            if(isDigit(symbol)){
                if(firstDigit === -1){
                    firstDigit = symbol;
                } else {
                    secondDigit = symbol;
                }
            }
        }

        temp.push({
            symbolList : symbols,
            isQuick : (i < length / 2),
            firstDigit : firstDigit,
            secondDigit : secondDigit
        });
    }
    return shuffle(temp);
}

function shuffle(sourceArray) {
    // https://stackoverflow.com/a/3718452
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}

function drawSymbols(symbolList, duration, symbolContainer, callback){
    let index = 0;
    let firstDigitPassed = false;
    
    console.log(index, symbolList, duration, symbolContainer, callback);
    
    loopAsync();
    function loopAsync(){
        if(index === symbolList.length){
            setTimeout(()=>{
                symbolContainer.classList.add('hide');
                setTimeout(callback, 650);

            }, duration);
            return;
        }
        symbolContainer.textContent = symbolList[index];
        symbolContainer.style.color = 'black';

        if(symbolList[index] >= 0 && symbolList[index] <= 9){
            if(!firstDigitPassed && random_int(0, 2) === 0){
                symbolContainer.style.color = 'red';
            }
            firstDigitPassed = true;
        }
        index++;
        setTimeout(loopAsync, duration);
    }
}

function resetSquares(){
    let correctSquares = document.getElementById('correct-squares').children;
    let incorrectSquares = document.getElementById('incorrect-squares').children;
    
    for(let square of correctSquares){
        square.classList.remove('active-square');
    }
    for(let square of incorrectSquares){
        square.classList.remove('active-square');
    }
}

function checkAnswer(isCorrect, symbolDuration){
    let squares = document.getElementsByClassName(`${isCorrect ? 'green' : 'red'}-square`);
    let ok = false;
    console.log(squares);
    for(let square of squares){
        if(!square.classList.contains('active-square')){
            square.classList.add('active-square');
            ok = true;
            break;
        }
    }

    if(ok){
        // just modify square and return without modifying time
        return symbolDuration;
    }

    // else must update time and reset squares
    resetSquares();
    if(isCorrect){
        return symbolDuration - 10;
    } else {
        return symbolDuration + 20;
    }
    
}