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


        playAudio(tests[rounds].number);

        setTimeout(()=>{
            drawSymbols(handleInput);
        }, 475);

        let start, answerTimeout;

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
                let isCorrect = tests[rounds].number !== tests[rounds].symbols.length;

                answers.push({
                    isCorrect : isCorrect
                });

                stopAudio();
                symbols.classList.add('hide');
                reactionTimeWindow = checkAnswer(isCorrect, reactionTimeWindow);

                window.removeEventListener('keypress', checkInput);
                rounds++;
                setTimeout(run, 900);

            } else if(event.key === ' '){
                
                stopAudio();
                symbols.classList.add('hide');
                clearTimeout(answerTimeout);
    
                let isCorrect = tests[rounds].number === tests[rounds].symbols.length;

                flashSpacebar(isCorrect ? 'green' : 'red');

                answers.push({
                    isCorrect : isCorrect,
                    reactionTime : performance.now() - start
                })
    
                reactionTimeWindow = checkAnswer(isCorrect, reactionTimeWindow);
                
                window.removeEventListener('keypress', checkInput);
                rounds++;
                setTimeout(run, 900);      
            }

        }
    }

    function terminate(){
        gameContainer.classList.add('hide');
        resultsContainer.classList.remove('hide');

        let correctAnswers = 0, incorrectAnswers = 0, correctTotalTime = 0, incorrectTotalTime = 0, correctTotalTimeCount = 0, incorrectTotalTimeCount = 0;
        answers.forEach(answer =>{
            if(answer.isCorrect){
                correctAnswers++;
                if(answer.reactionTime){
                    correctTotalTime += answer.reactionTime;
                    correctTotalTimeCount++;
                }
            } else {
                incorrectAnswers++;
                if(answer.reactionTime){
                    incorrectTotalTime += answer.reactionTime;
                    incorrectTotalTimeCount++;
                }
            }
        })
        
        document.getElementById("correct-answers").textContent = correctAnswers;
        document.getElementById("incorrect-answers").textContent = incorrectAnswers;
        document.getElementById("accuracy").textContent = (correctAnswers + incorrectAnswers) === 0 ? 0 : Math.round(100 * correctAnswers / (correctAnswers + incorrectAnswers));

        document.getElementById("avg-correct-time").textContent = Math.round(correctTotalTimeCount === 0 ? 0 : correctTotalTime / correctTotalTimeCount);
        document.getElementById("avg-incorrect-time").textContent = Math.round(incorrectTotalTimeCount === 0 ? 0 : incorrectTotalTime / incorrectTotalTimeCount);

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

        if(i > 0){
            while(audioNum === temp[i-1].number) audioNum = random_int(1, 7);
        }

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

function checkAnswer(isCorrect, reactionTimeWindow){
    let squares = document.getElementsByClassName(`${isCorrect ? 'green' : 'red'}-square`);
    let ok = false;
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
        if(reactionTimeWindow > 1000){
            return reactionTimeWindow - 200;
        } else return reactionTimeWindow - 100 >= 500 ? reactionTimeWindow - 100 : 500;
    } else {
        if(reactionTimeWindow < 800)
            return reactionTimeWindow + 200;
        else 
            return reactionTimeWindow + 300;
    }
    
}

function flashSpacebar(color){
    let spacebar = document.getElementById('spacebar');

    if(color === 'green'){
        spacebar.classList.add('spacebar-correct');
        setTimeout(()=>{
            spacebar.classList.remove('spacebar-correct');
        }, 200);
    } else if(color === 'red') {
        spacebar.classList.add('spacebar-incorrect');
        setTimeout(()=>{
            spacebar.classList.remove('spacebar-incorrect');
        }, 100);
    }
}

function playAudio(num){
    // let source = document.createElement('source');
    let audio = document.getElementById('sound');
    audio.src = `./audio/${num}.mp3`;
    audio.play();
}

function stopAudio(){
    let audio = document.getElementById('sound');
    audio.pause();
    audio.src = "";
}