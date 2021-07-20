let startContainer = document.getElementById('start-container');
let gameContainer = document.getElementById('game-container');
let resultsContainer = document.getElementById('results-container');

startContainer.style.display = 'none';

let leftArrow = document.getElementById('left-arrow');
let rightArrow = document.getElementById('right-arrow');

leftArrow.classList.add('noselect');
rightArrow.classList.add('noselect');

window.addEventListener('keydown',e=>{
    console.log(e.key);
    if(e.key == 'ArrowLeft' || e.key == 'ArrowRight'){
        let arrow = e.key == 'ArrowLeft' ? leftArrow : rightArrow;
        flashGreen(arrow);
    }
})

function flashRed(arrow){
    arrow.classList.toggle('red-arrow-color');
    setTimeout(()=>{
        arrow.classList.toggle('red-arrow-color');
    }, 120);
}

function flashGreen(arrow){
    arrow.classList.toggle('green-arrow-color');
    setTimeout(()=>{
        arrow.classList.toggle('green-arrow-color');
    }, 120);
}

last5 = [];


setInterval(()=>{
    let img = document.getElementById('game-item');
    let id = random_int(1, 18);
    while(last5.length >= 5 && last5.indexOf(id) > -1){
        id = random_int(1, 18);
        if(id > 18) id = 1;
    }
    if(last5.length >= 5){
        last5.shift();
    }
    last5.push(id);
    img.src = `./imgs/tools/${id}.png`;
}, 1000)


function random_int(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}