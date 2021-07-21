const ITEM_NO = 50;
const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const resultsContainer = document.getElementById('results-container');
const correctSquaresContainer = document.getElementById('correct-squares');
const incorrectSquaresContainer = document.getElementById('incorrect-squares');

const startBtn = document.getElementById('start-btn');
const tryAgainBtn = document.getElementById('try-again-btn');


gameContainer.classList.add('hide');
resultsContainer.classList.add('hide');

[startBtn, tryAgainBtn].forEach(btn => btn.addEventListener('click', setup) );

function setup(event)
{
    console.log(1);

    let itemCount = ITEM_NO;
    
    if(event.target === startBtn)
    {
        startContainer.classList.add('hide');          
    }
    else if(event.target === tryAgainBtn)
    {
        resultsContainer.classList.add('hide');
    }
    
    gameContainer.classList.remove('hide');

    let object = document.getElementById('game-item');
    object.classList.add('hide');

    function run(){

    }
}


let leftArrow = document.getElementById('left-arrow');
let rightArrow = document.getElementById('right-arrow');

leftArrow.classList.add('noselect');
rightArrow.classList.add('noselect');

window.addEventListener('keydown',e=>{
    console.log(e.key);
    if(e.key == 'ArrowLeft' || e.key == 'ArrowRight'){
        let arrow = e.key == 'ArrowLeft' ? leftArrow : rightArrow;
        flashRed(arrow);
    }
});

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