const ITEM_NO = 50;
let IMG_INITIAL_DURATION = document.getElementById('initial-duration').value;

const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const resultsContainer = document.getElementById('results-container');

const startBtn = document.getElementById('start-btn');
const tryAgainBtn = document.getElementById('try-again-btn');


gameContainer.classList.add('hide');
resultsContainer.classList.add('hide');

[startBtn, tryAgainBtn].forEach(btn => btn.addEventListener('click', setup) );

function setup(event)
{
    console.log('setup');

    let itemCount = ITEM_NO;
    let imgDuration = IMG_INITIAL_DURATION;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let answers = [];

    const item = document.getElementById('game-item');
    const itemCounter = document.getElementById('item-no');
    const countdown = document.getElementById('countdown');
    const milliseconds = document.getElementById('milliseconds')
    const correctSquares = document.getElementById('correct-squares').children;
    const incorrectSquares = document.getElementById('incorrect-squares').children;
    

    milliseconds.textContent = imgDuration;
    itemCounter.textContent = `${itemCount}`;
    item.classList.add('hide');
    gameContainer.classList.remove('hide');
    
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
        if(itemCount === 0){
            terminate();
            return;
        }

        let startTime = null;
        let endTime = null;

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
        }, imgDuration);

        setTimeout(()=>{
            item.classList.add('hide');
        }, imgDuration * 2);


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

                        if(imgDuration > 200){
                            imgDuration -= 40
                        }
                        else if(imgDuration >= 80){
                            imgDuration -= 30;
                        }
                        else if(imgDuration >= 60){
                            imgDuration -= 10;
                        }
                        milliseconds.textContent = imgDuration;
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

                        if(imgDuration <= 80){
                            imgDuration += 20
                        }
                        else if(imgDuration <= 140){
                            imgDuration += 30
                        }
                        else{
                            imgDuration += 40;
                        }
                        milliseconds.textContent = imgDuration;
                    }
                    else
                    {
                        incorrectSquares[incorrectAnswers].classList.add('active-square');
                        incorrectAnswers++;
                    }
                }
                
                
                
                window.removeEventListener('keydown', handleChoice);
                itemCount--;
                itemCounter.textContent = `${itemCount}`;
                setTimeout(run, 1000);
            }
        }
    }

    function terminate(){
        localStorage.imgDuration = imgDuration;

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

function updateTextInput(val){
    IMG_INITIAL_DURATION = parseInt(val);
    document.getElementById('initial-duration-value').textContent = val;
}