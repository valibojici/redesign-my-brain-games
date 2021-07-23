const ITEM_NO = 50;
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
    let imgDuration = 500;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    const item = document.getElementById('game-item');
    const itemCounter = document.getElementById('item-no');
    const countdown = document.getElementById('countdown');
    const imgDurationSpan = document.getElementById('img-duration')
    const correctSquares = document.getElementById('correct-squares').children;
    console.log(correctSquares);
    const incorrectSquares = document.getElementById('incorrect-squares').children;
    

    itemCounter.textContent = `${itemCount}`;
    item.classList.add('hide');
    gameContainer.classList.remove('hide');
    
    if(event.target === startBtn){
        startContainer.classList.add('hide');          
    }
    else if(event.target === tryAgainBtn){
        resultsContainer.classList.add('hide');
    }
    

    

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
        if(itemCounter === 0){
            terminate();
            return;
        }

        setTimeout(()=>{
            // 0 = tool 1 = writing
            let imgIndex = random_int(1, 18);
            let dir = random_int(0, 1) === 0 ? 'tools' : 'writing';
            
            // item.classList.add('hide');

            // to do: function to change img src and callback funtion to remove hide class

            item.src = `./imgs/${dir}/${imgIndex}.png`;
            item.type = dir;

            item.classList.remove('hide');

            window.addEventListener('keydown', handleChoice);
        }, imgDuration);

        setTimeout(()=>{
            item.classList.add('hide');
        }, imgDuration * 2);


        function handleChoice(event){
            if(event.key === 'ArrowLeft' || event.key === 'ArrowRight'){            
                let arrow = document.getElementById(event.key === 'ArrowLeft' ? 'left-arrow' : 'right-arrow');
                let isCorrect = true;
                if(event.key === 'ArrowLeft' && item.type === 'writing' || event.key === 'ArrowRight' && item.type === 'tools'){
                    isCorrect = false;
                }
                
                if(isCorrect){
                    flashGreen(arrow);

                    if(correctAnswers === 5){
                        resetSquares();
                        correctAnswers = incorrectAnswers = 0;

                        // to do modify item time here
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

                        // to do modify item time here
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