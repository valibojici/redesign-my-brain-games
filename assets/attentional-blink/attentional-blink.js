const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const resultsContainer = document.getElementById('results-container');

 
document.getElementById('start-btn').addEventListener('click',e=>{
    startContainer.classList.add('hide');
    resultsContainer.classList.remove('hide');
});