var FAST_ROUNDS = parseInt(document.getElementById("initial-fast-count").value);
var SLOW_ROUNDS = parseInt(document.getElementById("initial-slow-count").value);
var TOTAL_ROUNDS = FAST_ROUNDS + SLOW_ROUNDS;
var INITIAL_FAST_DURATION = parseInt(document.getElementById('initial-fast-duration').value);
var INITIAL_SLOW_DURATION = parseInt(document.getElementById('initial-slow-duration').value);


document.getElementById('initial-slow-duration-value').textContent = document.getElementById('initial-slow-duration').value;
document.getElementById('initial-fast-duration-value').textContent = document.getElementById('initial-fast-duration').value;
document.getElementById('initial-slow-value').textContent = document.getElementById('initial-slow-count').value;
document.getElementById('initial-fast-value').textContent = document.getElementById('initial-fast-count').value;

const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const resultsContainer = document.getElementById('results-container');

const startBtn = document.getElementById('start-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
 
startBtn.addEventListener('click', setup);
tryAgainBtn.addEventListener('click', e=>{
    resultsContainer.classList.add('hide');
    startContainer.classList.remove('hide');
});

function setup(event)
{
    FAST_ROUNDS = parseInt(document.getElementById("initial-fast-count").value);
    SLOW_ROUNDS = parseInt(document.getElementById("initial-slow-count").value);
    TOTAL_ROUNDS = FAST_ROUNDS + SLOW_ROUNDS;
    INITIAL_FAST_DURATION = parseInt(document.getElementById('initial-fast-duration').value);
    INITIAL_SLOW_DURATION = parseInt(document.getElementById('initial-slow-duration').value);
    
    let rounds = 0;
    let symbolDuration = SLOW_ROUNDS === 0 ? INITIAL_FAST_DURATION : INITIAL_SLOW_DURATION;
    let changedToFastRuns = SLOW_ROUNDS === 0 ? true : false;
    let tests = generateTests(SLOW_ROUNDS, FAST_ROUNDS);
    console.log(tests);

    const symbol = document.getElementById('symbol');
    const inputContainer = document.getElementById('input-container');
    const roundCounter = document.getElementById('rounds')
    const milliseconds = document.getElementById('milliseconds')
    const countdown = document.getElementById('countdown');

    startContainer.classList.add('hide');
    resultsContainer.classList.add('hide');
    gameContainer.classList.remove('hide');
    
    countdown.classList.remove('hide');
    symbol.classList.add('hide');
    inputContainer.classList.add('hide');
    
    milliseconds.textContent = `${symbolDuration}ms ${changedToFastRuns ? '(fast)' : '(slow)'}`;
    roundCounter.textContent = `${TOTAL_ROUNDS}`;

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
        if(rounds === TOTAL_ROUNDS){
            terminate();
            return;
        }

        if(!changedToFastRuns && tests[rounds].isQuick){
            changedToFastRuns = true;
            symbolDuration = INITIAL_FAST_DURATION;
            resetSquares();
        }
        
        milliseconds.textContent = `${symbolDuration}ms ${changedToFastRuns ? '(fast)' : '(slow)'}`;

        symbol.classList.remove('hide');
        drawSymbols(tests[rounds].symbolList, symbolDuration, symbol, handleInput);
        
        function handleInput(){
            symbol.classList.add('hide');
            inputContainer.classList.remove('hide');

            let firstDigitInput = document.getElementById('first-digit');
            let secondDigitInput = document.getElementById('second-digit');

            [firstDigitInput, secondDigitInput].forEach(btn=>
                btn.addEventListener('focus', e=>{
                    e.target.value = '';
                    e.target.textContent = '';
            }));

            firstDigitInput.focus();
            
            firstDigitInput.addEventListener('input',e=>{
                if(secondDigitInput.value == ''){
                    secondDigitInput.focus();
                }
            });

            secondDigitInput.addEventListener('input',e=>{
                secondDigitInput.blur();
            })

            firstDigitInput.value = '';
            secondDigitInput.value = '';
            
            window.addEventListener('keyup', checkInput);
        }

        function checkInput(event){
            if(event.key !== 'Enter'){
                return;
            }

            let firstDigitInput = document.getElementById('first-digit');
            let secondDigitInput = document.getElementById('second-digit');

            let firstDigit = parseInt(firstDigitInput.value);
            let secondDigit = parseInt(secondDigitInput.value);

            if(!isDigit(firstDigit) || !isDigit(secondDigit)){
                document.getElementById('error-msg').classList.remove('hide');
                setTimeout(()=>{document.getElementById("error-msg").classList.add('hide')}, 1000);
                return;
            }
            window.removeEventListener('keyup', checkInput);

            tests[rounds].isCorrect = (firstDigit === tests[rounds].firstDigit && secondDigit === tests[rounds].secondDigit);
            
            inputContainer.classList.add('hide');
            roundCounter.textContent = roundCounter.textContent - 1;
            
            symbolDuration = checkAnswer(tests[rounds].isCorrect, tests[rounds].isQuick, symbolDuration);
            rounds++;
            setTimeout(run, 1500);
        }
    }

    function terminate(){
        gameContainer.classList.add('hide');
        resultsContainer.classList.remove('hide');

        let correctSlowAnswers = 0, incorrectSlowAnswers = 0, correctFastAnswers = 0, incorrectFastAnswers = 0;
        tests.forEach(test =>{
            if(test.isQuick){
                if(test.isCorrect){
                    correctFastAnswers++;
                } else {
                    incorrectFastAnswers++;
                }
            } else {
                if(test.isCorrect){
                    correctSlowAnswers++;
                } else {
                    incorrectSlowAnswers++;
                }
            }
        });

        document.getElementById("correct-slow-answers").textContent = correctSlowAnswers;
        document.getElementById("incorrect-slow-answers").textContent = incorrectSlowAnswers;
        document.getElementById("correct-fast-answers").textContent = correctFastAnswers;
        document.getElementById("incorrect-fast-answers").textContent = incorrectFastAnswers;
        document.getElementById("slow-accuracy").textContent = Math.round(100 * correctSlowAnswers / (correctSlowAnswers + incorrectSlowAnswers));
        document.getElementById("fast-accuracy").textContent = Math.round(100* correctFastAnswers / (correctFastAnswers + incorrectFastAnswers));
        document.getElementById("overall-accuracy").textContent = Math.round(100 * (correctSlowAnswers + correctFastAnswers) / (correctSlowAnswers + incorrectSlowAnswers + correctFastAnswers + incorrectFastAnswers));
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

function updateText(id, val){
    document.getElementById(id).textContent = val;
}

function generateSymbols(isQuick){
    symbols = [];
    let length = random_int(15, 20);
    let spaceChance = 3;

    for(let i=0; i<length; ++i){
        let letterCode = random_int(65, 65 + 26 - 1);
        let letter = String.fromCharCode(letterCode);
        if(i > 4 && i < length - 4 && random_int(1, spaceChance) == 1){
            symbols.push(' ');
            spaceChance++;
            if(random_int(0, 1) == 0){
                symbols.push(' ');
                symbols.push(' ');
            }
        }
        while(symbols[symbols.length - 1] === letter || letter === 'O'){
            letterCode = random_int(65, 65 + 26 - 1);
            letter = String.fromCharCode(letterCode);
        }
        symbols.push(letter);
    }

    let digit1Index = random_int(3, symbols.length - 6);
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

function generateTests(slow, fast){
    let temp = [];
    for(let i=0; i < slow + fast; ++i){

        let symbols = generateSymbols((i >= slow));
        let firstDigit = -1, secondDigit = -1;

        for(let symbol of symbols){
            if(isDigit(symbol)){
                if(firstDigit === -1){
                    firstDigit = symbol;
                } else {
                    secondDigit = symbol;
                    break;
                }
            }
        }

        temp.push({
            symbolList : symbols,
            isQuick : (i >= slow),
            firstDigit : firstDigit,
            secondDigit : secondDigit
        });
    }
    return temp;
}

// function shuffle(sourceArray) {
//     // https://stackoverflow.com/a/3718452
//     for (var i = 0; i < sourceArray.length - 1; i++) {
//         var j = i + Math.floor(Math.random() * (sourceArray.length - i));

//         var temp = sourceArray[j];
//         sourceArray[j] = sourceArray[i];
//         sourceArray[i] = temp;
//     }
//     return sourceArray;
// }

function drawSymbols(symbolList, duration, symbolContainer, callback){
    let index = 0;
    let firstDigitPassed = false;
        
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

function checkAnswer(isCorrect, isQuick, symbolDuration){
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
        if(isQuick){
            if(symbolDuration > 300){
                return symbolDuration - 40;
            } else if(symbolDuration > 200) {
                return symbolDuration - 25;
            } else if(symbolDuration > 120){
                return symbolDuration - 15;
            } else {
                return symbolDuration - 10 >= 45 ? symbolDuration - 10 : 45;    
            }
        } else {
            if(symbolDuration > 200){
                return symbolDuration - 40;
            } else if(symbolDuration > 140){
                return symbolDuration - 25;
            }
            return symbolDuration - 15 >= 45 ? symbolDuration - 15 : 45;
        }
    } else {
        if(symbolDuration > 200){
            return symbolDuration + 25;
        } else {
            return symbolDuration + 20;
        }
    }
    
}