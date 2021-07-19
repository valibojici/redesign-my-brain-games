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
        changeArrowColor(arrow, 10, 200, 10);
        setTimeout(()=>{
            changeArrowColor(arrow, 0, 0, 0);
        }, 75)
    }
})

function changeArrowColor(arrow, r, g, b, alpha = 1){
    arrow.children[0].style.fill = `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

changeArrowColor(leftArrow, 10, 200, 244, 1);

console.log(leftArrow.children);