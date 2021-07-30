var TOTAL_ROUNDS = document.getElementById('initial-count').value;;
var INITIAL_DURATION = document.getElementById('initial-duration').value;

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
    console.log('setup');

    startContainer.classList.add('hide');
    gameContainer.classList.remove('hide');

    let rounds = TOTAL_ROUNDS;
    let symbolDuration = INITIAL_DURATION;
    // let correctAnswers = 0;
    // let incorrectAnswers = 0;
    let answers = [];

    const symbol = document.getElementById('symbol');
    const inputContainer = document.getElementById('input-container');
    const countdown = document.getElementById('countdown');
    const roundCounter = document.getElementById('rounds')
    const milliseconds = document.getElementById('milliseconds')
    const correctSquares = document.getElementById('correct-squares').children;
    const incorrectSquares = document.getElementById('incorrect-squares').children;
    

    milliseconds.textContent = symbolDuration;
    roundCounter.textContent = `${rounds}`;

    symbol.classList.add('hide');
    inputContainer.classList.add('hide');
    
    let symbolList = getSymbols();

    console.log(symbolList);

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
        run();
    }, 3000);

    function run(){
        symbol.classList.remove('hide');
        let index = 0;
        function loopAsync(){
            if(index === symbolList.length){
                setTimeout(()=>{
                    symbol.classList.add('hide');
                }, symbolDuration)
            }
            symbol.textContent = symbolList[index];
            symbol.style.color = 'black';
            if(symbolList[index] >= 1 && symbols[index] <= 9 && random_int(0, 2) === 0){
                symbol.style.color = 'red';   
            }
            index++;
            setTimeout(loopAsync, symbolDuration);
        }

        setTimeout(loopAsync, 1000);
        return;

        if(rounds === 0){
            terminate();
            return;
        }

        setTimeout(()=>{
            // 0 = tool 1 = writing
            let imgIndex = random_int(1, 25);
            let dir = random_int(0, 1) === 0 ? 'tools' : 'writing';
            
            // item.classList.add('hide');

            // to do: function to change img src and callback funtion to remove hide class

            item.src = `./imgs/${dir}/${imgIndex}.png`;
            item.type = dir;


            if(item.complete){
                item.classList.remove('hide');
                startTime = performance.now();
            } else {
                item.addEventListener('load', e =>{
                    item.classList.remove('hide');
                    startTime = performance.now();
                })
            }
            

            

            window.addEventListener('keydown', handleChoice);
        }, symbolDuration);

        setTimeout(()=>{
            item.classList.add('hide');
        }, symbolDuration * 2);


        function handleChoice(event){
            endTime = performance.now();

            if(event.key === 'ArrowLeft' || event.key === 'ArrowRight'){            
                let arrow = document.getElementById(event.key === 'ArrowLeft' ? 'left-arrow' : 'right-arrow');
                let isCorrect = true;
                if(event.key === 'ArrowLeft' && item.type === 'writing' || event.key === 'ArrowRight' && item.type === 'tools'){
                    isCorrect = false;
                }
                
                answers.push({
                    time : endTime - startTime,
                    isCorrect : isCorrect
                });

                if(isCorrect){
                    flashGreen(arrow);

                    if(correctAnswers === 5){
                        resetSquares();
                        correctAnswers = incorrectAnswers = 0;

                        if(symbolDuration > 200){
                            symbolDuration -= 40
                        }
                        else if(symbolDuration >= 80){
                            symbolDuration -= 30;
                        }
                        else if(symbolDuration >= 60){
                            symbolDuration -= 10;
                        }
                        milliseconds.textContent = symbolDuration;
                    }
                    else
                    {
                        correctSquares[correctAnswers].classList.add('active-square');
                        correctAnswers++;
                    }
                }else{
                    flashRed(arrow);

                    if(incorrectAnswers === 2){
                        resetSquares();
                        correctAnswers = incorrectAnswers = 0;

                        if(symbolDuration <= 80){
                            symbolDuration += 20
                        }
                        else if(symbolDuration <= 140){
                            symbolDuration += 30
                        }
                        else{
                            symbolDuration += 40;
                        }
                        milliseconds.textContent = symbolDuration;
                    }
                    else
                    {
                        incorrectSquares[incorrectAnswers].classList.add('active-square');
                        incorrectAnswers++;
                    }
                }
                
                
                
                window.removeEventListener('keydown', handleChoice);
                rounds--;
                roundser.textContent = `${rounds}`;
                setTimeout(run, 1000);
            }
        }
    }

    function terminate(){
        localStorage.symbolDuration = symbolDuration;

        let correct = 0;
        let incorrect = 0;
        let totalTime = 0;
        let totalGoodTime = 0;
        let totalBadTime = 0;

        for(let answer of answers){
            
            if(answer.isCorrect){ 
                correct++; 
                totalGoodTime += answer.time;
            }
            else { 
                incorrect++; 
                totalBadTime += answer.time;
            }
            totalTime += answer.time;
        }

        gameContainer.classList.add('hide');
        
        document.getElementById('correct-answers').textContent = correct;
        document.getElementById('incorrect-answers').textContent = incorrect;
        document.getElementById('accuracy').textContent = `${Math.round(correct / answers.length * 100)}`;
        document.getElementById('avg-react-time').textContent = `${Math.round(totalTime / answers.length)}`;
        document.getElementById('correct-react-time').textContent = `${correct !== 0 ? Math.round(totalGoodTime / correct) : 0}`;
        document.getElementById('incorrect-react-time').textContent = `${incorrect !== 0 ? Math.round(totalBadTime / incorrect) : 0}`;

        resultsContainer.classList.remove('hide');
    }

    function resetSquares(){
        for(let square of correctSquares){
            square.classList.remove('active-square');
        }
        for(let square of incorrectSquares){
            square.classList.remove('active-square');
        }
    }
}

function flashRed(arrow){
    arrow.classList.toggle('red-arrow-color');
    setTimeout(()=>{
        arrow.classList.toggle('red-arrow-color');
    }, 130);
}

function flashGreen(arrow){
    arrow.classList.toggle('green-arrow-color');
    setTimeout(()=>{
        arrow.classList.toggle('green-arrow-color');
    }, 120);
}

function random_int(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function updateDurationText(val){
    INITIAL_DURATION = parseInt(val);
    document.getElementById('initial-duration-value').textContent = val;
}

function updateCountText(val){
    TOTAL_ROUNDS = parseInt(val);
    document.getElementById('initial-count-value').textContent = val;
}

function getSymbols(){
    symbols = [];
    let length = random_int(15, 25);
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
    let digit2Index = random_int(digit1Index+3,digit1Index + 5);

    symbols[digit1Index] = random_int(1, 9);
    symbols[digit2Index] = random_int(1, 9);
    while(symbols[digit2Index] === symbols[digit1Index]){
        symbols[digit2Index] = random_int(1, 9);
    }
    return symbols;
}