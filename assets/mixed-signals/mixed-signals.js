var TOTAL_ROUNDS = parseInt(document.getElementById("initial-count").value);
var INITIAL_DURATION = parseInt(document.getElementById('initial-duration').value);

document.getElementById('initial-duration-value').textContent = INITIAL_DURATION;
document.getElementById('initial-count-value').textContent = TOTAL_ROUNDS;

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
    TOTAL_ROUNDS = parseInt(document.getElementById("initial-count").value);
    INITIAL_DURATION = parseInt(document.getElementById('initial-duration').value);
    console.log(TOTAL_ROUNDS, INITIAL_DURATION);

    let rounds = 0;
    let reactionTimeWindow = INITIAL_DURATION;

    let tests = generateTests(TOTAL_ROUNDS);
    let answers = [];
    console.log(tests);

    const symbols = document.getElementById('symbols');
    
    const roundCounter = document.getElementById('rounds')
    const milliseconds = document.getElementById('milliseconds')
    const countdown = document.getElementById('countdown');

    startContainer.classList.add('hide');
    resultsContainer.classList.add('hide');
    gameContainer.classList.remove('hide');
    
    countdown.classList.remove('hide');
    symbols.classList.add('hide');
    
    milliseconds.textContent = reactionTimeWindow+'ms';
    roundCounter.textContent = TOTAL_ROUNDS;

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

        roundCounter.textContent = TOTAL_ROUNDS - rounds;
        milliseconds.textContent = reactionTimeWindow + 'ms';

        let audio = document.getElementById("sound");
        audio.src = `./audio/${tests[rounds].number}.mp3`;
        audio.play();


        setTimeout(()=>{
            drawSymbols(handleInput);
        }, 600)

        let start, end, answerTimeout;

        function drawSymbols(callback){
            symbols.textContent = tests[rounds].symbols;
            symbols.classList.remove('hide');
            callback();
        }
        
        function handleInput(){
            start = performance.now();
            answerTimeout = setTimeout(()=>{
                checkInput(null, true);
                window.removeEventListener('keypress', checkInput);
            }, reactionTimeWindow);

            window.addEventListener('keypress', checkInput);
        }

        function checkInput(event, timeIsUp = false){
            if(timeIsUp){
                answers.push({
                    isCorrect : false,
                    timeIsUp : true
                });
                rounds++;
                setTimeout(run, 1500);

                symbols.classList.add('hide');
                return;
            }

            console.log(event.key);
            if(event.key !== ' '){
                return;
            }

            audio.src = "";
            symbols.classList.add('hide');
            clearTimeout(answerTimeout);
            
            window.removeEventListener('keypress', checkInput);
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

function randomSymbol(){
    randomSymbol.chars = randomSymbol.chars || "ABCDEFGH$%@#WOZXKYT";

    return randomSymbol.chars.charAt(random_int(0, randomSymbol.chars.length-1));
}

function generateTests(rounds){
    let temp = [];
    for(let i=0; i < rounds; ++i){

        let audioNum = random_int(1, 7);
        let symbol = randomSymbol();

        // 50% chance that symbol is a digit (different from audio)
        if(random_int(0, 1) === 0){
            symbol = random_int(1, 9);
            while(symbol === audioNum){
                symbol = random_int(1, 9)
            }
            // 50% chance that symbol is actually audio
            if(random_int(0, 1) === 0){
                symbol = audioNum;
            }
        }

        // the audio corresponds with number of symbols
        let symbols = `${symbol}`.repeat(audioNum);

        // 50% chance number of symbols is different
        if(random_int(0, 1) === 0){
            let tempNum = audioNum;
            while(tempNum === audioNum){
                tempNum = random_int(1, 7);
            }
            symbols = `${symbol}`.repeat(tempNum);
        }

        temp.push({
            symbols : symbols,
            number : audioNum
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

function checkAnswer(isCorrect, isQuick, reactionTimeWindow){
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
        return reactionTimeWindow;
    }

    // else must update time and reset squares
    resetSquares();
    if(isCorrect){
        if(isQuick){
            if(reactionTimeWindow > 300){
                return reactionTimeWindow - 40;
            } else if(reactionTimeWindow > 200) {
                return reactionTimeWindow - 25;
            } else if(reactionTimeWindow > 120){
                return reactionTimeWindow - 15;
            } else {
                return reactionTimeWindow - 10 >= 45 ? reactionTimeWindow - 10 : 45;    
            }
        } else {
            if(reactionTimeWindow > 200){
                return reactionTimeWindow - 40;
            } else if(reactionTimeWindow > 140){
                return reactionTimeWindow - 25;
            }
            return reactionTimeWindow - 15 >= 45 ? reactionTimeWindow - 15 : 45;
        }
    } else {
        if(reactionTimeWindow > 200){
            return reactionTimeWindow + 25;
        } else {
            return reactionTimeWindow + 20;
        }
    }
    
}