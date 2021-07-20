const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const resultsContainer = document.getElementById('results-container');
const correctSquaresContainer = document.getElementById('correct-squares');
const incorrectSquaresContainer = document.getElementById('incorrect-squares');

startContainer.style.display = 'none';
gameContainer.style.display = 'none';
resultsContainer.style.display = 'block';

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
})

for(let i=0;i<5;++i){
    let square = document.createElement('div');
    square.classList.add('square', 'green-square');
    correctSquaresContainer.appendChild(square);

    if(i % 2 == 0)square.classList.add('active-square')
}

for(let i=0;i<2;++i){
    let square = document.createElement('div');
    square.classList.add('square', 'red-square');
    incorrectSquaresContainer.appendChild(square);

    if(i==1)square.classList.add('active-square')
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