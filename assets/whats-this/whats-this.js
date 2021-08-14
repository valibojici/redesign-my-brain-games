var ITEM_NO = parseInt(document.getElementById('initial-count').value);
var IMG_INITIAL_DURATION = parseInt(document.getElementById('initial-duration').value);

document.getElementById('initial-duration-value').textContent = IMG_INITIAL_DURATION;
document.getElementById('initial-count-value').textContent = ITEM_NO;

const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const resultsContainer = document.getElementById('results-container');

const startBtn = document.getElementById('start-btn');
const tryAgainBtn = document.getElementById('try-again-btn');


gameContainer.classList.add('hide');
resultsContainer.classList.add('hide');


startBtn.addEventListener('click', setup);
tryAgainBtn.addEventListener('click', e=>{
    resultsContainer.classList.add('hide');
    startContainer.classList.remove('hide');
});

function setup(event)
{
    ITEM_NO = parseInt(document.getElementById('initial-count').value);
    IMG_INITIAL_DURATION = parseInt(document.getElementById('initial-duration').value);
    
    let tests = generateTests(ITEM_NO);

    let itemCount = 0;
    let imgDuration = IMG_INITIAL_DURATION;

    const item = document.getElementById('game-item');

    const itemCounter = document.getElementById('item-no');
    const milliseconds = document.getElementById('milliseconds')
    const countdown = document.getElementById('countdown');

    milliseconds.textContent = imgDuration;
    itemCounter.textContent = ITEM_NO;

    item.classList.add('hide');
    gameContainer.classList.remove('hide');
    startContainer.classList.add('hide');
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
        if(itemCount === ITEM_NO){
            terminate();
            return;
        }

        let startTime = null;
        let endTime = null;

        setTimeout(()=>{
            // 0 = tool 1 = writing
            item.src = tests[itemCount].src;

            if(item.complete){
                item.classList.remove('hide');
                startTime = performance.now();

                setTimeout(()=>{
                    item.classList.add('hide');
                }, imgDuration);
            } else {
                item.addEventListener('load', e =>{
                    item.classList.remove('hide');
                    startTime = performance.now();

                    setTimeout(()=>{
                        item.classList.add('hide');
                    }, imgDuration);
                });
            }
            window.addEventListener('keydown', handleChoice);

            

        }, imgDuration);


        function handleChoice(event){
            if(event.key === 'ArrowLeft' || event.key === 'ArrowRight'){   
                tests[itemCount].time = performance.now() - startTime;

                window.removeEventListener('keydown', handleChoice);         
                let arrow = document.getElementById(event.key === 'ArrowLeft' ? 'left-arrow' : 'right-arrow');
                  
                tests[itemCount].isCorrect = true;
                if(event.key === 'ArrowLeft' && tests[itemCount].type === 'writing' || event.key === 'ArrowRight' && tests[itemCount].type === 'tools'){
                    tests[itemCount].isCorrect = false;
                }
                
                imgDuration = checkAnswer(tests[itemCount].isCorrect, imgDuration, arrow);
                itemCount++;
                
                itemCounter.textContent = ITEM_NO - itemCount;
                milliseconds.textContent = imgDuration;
                
                setTimeout(run, 1000);
            }
        }
    }

    function terminate(){
        let correct = 0;
        let incorrect = 0;
        let totalTime = 0;
        let totalCorrectTime = 0;
        let totalIncorrectTime = 0;

        tests.forEach(test=>{
            if(test.isCorrect){
                correct++;
                totalCorrectTime += test.time;
            }
            else {
                incorrect++;
                totalIncorrectTime += test.time;
            }
            totalTime += test.time;
        })

        gameContainer.classList.add('hide');
        
        document.getElementById('correct-answers').textContent = correct;
        document.getElementById('incorrect-answers').textContent = incorrect;
        document.getElementById('accuracy').textContent = `${Math.round(correct / (correct + incorrect) * 100)}`;
        document.getElementById('avg-react-time').textContent = `${Math.round(totalTime / (correct + incorrect) )}`;
        document.getElementById('correct-react-time').textContent = `${correct !== 0 ? Math.round(totalCorrectTime / correct) : 0}`;
        document.getElementById('incorrect-react-time').textContent = `${incorrect !== 0 ? Math.round(totalIncorrectTime / incorrect) : 0}`;

        resultsContainer.classList.remove('hide');
    }
}

function generateTests(item_no){
    let tests = [];
    for(let i=0; i<item_no; ++i){

        let imgIndex = random_int(1, 25);
        while(tests.length > 0 && tests[tests.length-1].imgIndex === imgIndex){
            imgIndex = random_int(1, 25);
        } 

        // 0 = tool 1 = writing
        let dir = random_int(0, 1) === 0 ? 'tools' : 'writing';

        let test = {
            src : `./imgs/${dir}/${imgIndex}.png`,
            type : dir,
            imgIndex : imgIndex
        }

        tests.push(test);
    }
    return tests;
}

function checkAnswer(isCorrect, imgDuration, arrow){
    let squares = document.getElementsByClassName(`${isCorrect ? 'green' : 'red'}-square`);
    let ok = false;

    if(isCorrect){
        flashGreen(arrow);
    } else {
        flashRed(arrow);
    }

    for(let square of squares){
        if(!square.classList.contains('active-square')){
            square.classList.add('active-square');
            ok = true;
            break;
        }
    }

    if(ok){
        // just modify square and return without modifying time
        return imgDuration;
    }

    // else must update time and reset squares
    resetSquares();

    if(isCorrect){
        if(imgDuration > 300){
            return imgDuration - 40
        }
        else if(imgDuration > 200){
            return imgDuration - 30;
        }
        return imgDuration - 20 >= 125 ? imgDuration - 20 : 125;
    
    } else { // not correct

        if(imgDuration <= 80){
            return imgDuration + 20
        }
        else if(imgDuration <= 140){
            return imgDuration + 30
        }
        return imgDuration + 40;
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

function random_int(min, max){
    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

function updateDurationText(val){
    IMG_INITIAL_DURATION = parseInt(val);
    document.getElementById('initial-duration-value').textContent = val;
}

function updateCountText(val){
    ITEM_NO = parseInt(val);
    document.getElementById('initial-count-value').textContent = val;
}