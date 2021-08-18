setupStages();

window.addEventListener('resize', e => {
    setupStages();
});


changeTextContent("seconds-value", calculateTime(document.getElementById('seconds-input').value));
changeTextContent("reaction-time-value", document.getElementById('reaction-time-input').value);


document.getElementById('start-button').addEventListener('click', e => {
    setup();
});

document.getElementById('try-again-button').addEventListener('click', e => {
    document.getElementById('results-container').classList.add('hide');
    document.getElementById('start-container').classList.remove('hide');
});



function setup() {
    const startContainer = document.getElementById("start-container");
    const gameContainer = document.getElementById('game-container');
    const resultsContainer = document.getElementById('results-container');
    const timerContainer = document.getElementById('timer-container');
    const countdownContainer = document.getElementById('countdown');

    const testGenerator = generateTest();
    let answers = [];

    startContainer.classList.add('hide');
    gameContainer.classList.remove('hide');
    countdownContainer.classList.remove('hide');

    let secondsLeft = document.getElementById('seconds-input').value;
    let secondsInterval = null;
    let reactionTime = parseInt(document.getElementById('reaction-time-input').value);

    timerContainer.textContent = `Time left ${calculateTime(secondsLeft)}`;

    setTimeout(() => {
        countdownContainer.textContent = '3';
    }, 0);

    setTimeout(() => {
        countdownContainer.textContent = '2';
    }, 1000);

    setTimeout(() => {
        countdownContainer.textContent = '1';
    }, 2000);


    setTimeout(() => {
        countdownContainer.textContent = '';

        setTimeout(() => {
            startContainer.classList.add('hide');
            gameContainer.classList.remove('hide');
            timerContainer.classList.remove('hide');

            secondsInterval = setInterval(() => {
                secondsLeft--;
                timerContainer.textContent = `Time left ${calculateTime(secondsLeft)}`;
                if (secondsLeft === 0) {
                    clearInterval(secondsInterval);
                }
            }, 1000);

            run();
        }, 1000);

    }, 3000);

    function run() {
        if (secondsLeft === 0) {
            terminate(answers);
            return;
        }

        let test = testGenerator.next().value;

        stageOne();

        function stageOne() {
            let container = document.getElementById('stage-one');
            let tile = container.getElementsByClassName('outer-tiles')[0].children[test.tile * 3 + 1];
            let car = container.getElementsByClassName('car-container')[0].getElementsByTagName('img')[0];

            // make sure all images are loaded first
            let images = [{
                    elem: tile,
                    src: './imgs/logo.png'
                },
                {
                    elem: car,
                    src: `./imgs/car${test.car}.png`
                }
            ].map(item => {
                return new Promise((resolve, reject) => {
                    item.elem.src = item.src;
                    if (item.elem.complete) {
                        resolve();
                    } else {
                        item.elem.onload = resolve;
                        item.elem.onerror = reject;
                    }
                });
            });

            Promise.all(images).then((vals) => {
                container.classList.remove('hide');
                setTimeout(()=>{
                    tile.src = './imgs/horse.png';
                    stageTwo();
                }, reactionTime);
            })
        }

        function stageTwo() {
            document.getElementById('stage-one').classList.add('hide');
            document.getElementById('stage-two').classList.remove('hide');
            setTimeout(stageThree, reactionTime);
        }

        function stageThree() {
            document.getElementById('stage-two').classList.add('hide');
            let container = document.getElementById('stage-three');
            let tilesContainer = container.getElementsByClassName('tiles')[0];
            let carContainer = container.getElementsByClassName('car-container')[0];
            let carImgs = carContainer.getElementsByTagName('img');

            let answerIsCorrect = true;

            tilesContainer.classList.add('hide');
            carContainer.classList.add('hide');
            container.classList.remove('hide');

            let carIndexes = (randomInt(0, 1) == 0) ? [test.car, test.fakeCar] : [test.fakeCar, test.car];

            let images = [{
                    image: carImgs[0],
                    index: carIndexes[0]
                },
                {
                    image: carImgs[1],
                    index: carIndexes[1]
                }
            ].map(item => {
                return new Promise((resolve, reject) => {
                    item.image.src = `./imgs/car${item.index}.png`;
                    item.image.isCorrect = (item.index == test.car);
                    if (item.image.complete) {
                        resolve();
                    } else {
                        item.image.onload = resolve;
                        item.image.onerror = reject;
                    }
                });
            });

            Promise.all(images).then(() => {
                carContainer.classList.remove('hide');
                for (let car of carImgs) {
                    car.addEventListener('click', handleCarClick);
                    car.classList.add('selectable');
                }
            });


            function handleCarClick(event) {
                for (let car of carImgs) {
                    car.removeEventListener('click', handleCarClick);
                    car.classList.remove('selectable');
                }
                answerIsCorrect = event.target.isCorrect;

                carContainer.classList.add('hide');
                tilesContainer.classList.remove('hide');

                for (let i = 0; i < tilesContainer.children.length; ++i) {
                    tilesContainer.children[i].isCorrect = (i == test.tile);
                    tilesContainer.children[i].classList.add('selectable');
                    tilesContainer.children[i].addEventListener('click', handleTileClick);
                }
            }

            function handleTileClick(event) {
                for (let i = 0; i < tilesContainer.children.length; ++i) {
                    tilesContainer.children[i].classList.remove('selectable');
                    tilesContainer.children[i].removeEventListener('click', handleTileClick);
                }

                answerIsCorrect = (answerIsCorrect && event.target.isCorrect);
                tilesContainer.classList.add('hide');
                container.classList.add("hide");

                answers.push({isCorrect : answerIsCorrect, time : reactionTime});

                reactionTime = checkAnswer(answerIsCorrect, reactionTime);
                setTimeout(run, 1000);
            }
        }

    }
}

function checkAnswer(isCorrect, reactionTime){
    if(checkAnswer.correctAnswers == null || checkAnswer.correctAnswers == undefined){
        checkAnswer.correctAnswers = 0;
    }
    if(checkAnswer.incorrectAnswers == null || checkAnswer.incorrectAnswers == undefined){
        checkAnswer.incorrectAnswers = 0;
    }
    if(isCorrect){
        checkAnswer.correctAnswers++;
    } else {
        checkAnswer.incorrectAnswers++;
    }

    if(checkAnswer.correctAnswers === 4 || checkAnswer.incorrectAnswers === 3){
        checkAnswer.correctAnswers = 0;
        checkAnswer.incorrectAnswers = 0;
        if(isCorrect){
            if(reactionTime >= 2000) return reactionTime - 300;
            else if(reactionTime >= 1000) return reactionTime - 200;
            else if(reactionTime >= 500) return reactionTime - 100;
            else if(reactionTime - 50 >= 100) return reactionTime - 50;
            else return 100;
        } else {
            if(reactionTime >= 2000) return reactionTime + 200;
            else if(reactionTime >= 1000) return reactionTime + 150;
            else if(reactionTime >= 500) return reactionTime + 75;
            else if(reactionTime >= 200) return reactionTime + 50;
            else return reactionTime + 30;
        }
    }
    return reactionTime;
}

function terminate(answers){
    console.log(answers);
    let correctAnswers = answers.filter(answer => answer.isCorrect == true).length;
    let incorrectAnswers = answers.filter(answer => answer.isCorrect != true).length;
    
    let bestReactionTime = (correctAnswers == 0) ? 0 : answers
        .filter(answer => answer.isCorrect)
        .reduce((min, curr) => min.time < curr.time ? min : curr).time;


    document.getElementById('correct').textContent = correctAnswers;
    document.getElementById('incorrect').textContent = incorrectAnswers;
    document.getElementById('accuracy').textContent = Math.round(100 * correctAnswers / (correctAnswers + incorrectAnswers));
    document.getElementById('best-react').textContent = bestReactionTime;
    
    document.getElementById('game-container').classList.add('hide');
    document.getElementById('results-container').classList.remove('hide');
}

function setupStages() {
    function drawStageOne() {
        // how far every ring of tiles is drawn from the center 1 = maximum length
        let radiusOffset = [1, 0.75, 0.5];

        // hard coded to draw tiles this way
        let startOffset = [7.5, 0, 22.5];
        let increment = [15, 22.5, 45];

        // distance from center of screen to the bottom of the document
        let radius = parseFloat(document.body.scrollHeight) / 2;

        let containerWidth = parseFloat(document.body.scrollWidth);

        for (let k = 0; k < 3; ++k) {
            for (let i = startOffset[k]; i < 360 + startOffset[k]; i += increment[k]) {
                let img = document.createElement('img');
                document.getElementById('stage-one').getElementsByClassName("outer-tiles")[0].appendChild(img);
                img.classList.add('tile', 'noselect');

                img.src = './imgs/horse.png';

                let imgSize = parseFloat(getComputedStyle(img).width);

                // need to place images a little short of radius to make sure the center of
                // the image is in the correct place (in css the images have transform(-50%, -50%) )
                let radiusReduced = radiusOffset[k] * (radius - imgSize / 2);

                let left = containerWidth / 2 + radiusReduced * Math.cos(degrees_to_radians(i));
                let top = radius + radiusReduced * Math.sin(degrees_to_radians(-i));

                img.style.left = left - imgSize / 2 + 'px';
                img.style.top = top - imgSize / 2 + 'px';
            }

        }
    }

    function drawStageTwoAndThree() {
        let startOffset = 7.5 + 15;
        let radiusOffset = 1;
        let increment = 45;

        // distance from center of screen to the bottom of the document
        // let radius = parseFloat(getComputedStyle(document.getElementById("stage-three")).height) / 2;
        let radius = parseFloat(document.body.scrollHeight) / 2;

        let containerWidth = parseFloat(document.body.scrollWidth);

        for (let i = startOffset; i < 360 + startOffset; i += increment) {
            let img = document.createElement('img');
            document.getElementById('stage-two').getElementsByClassName("outer-tiles")[0].appendChild(img);

            img.classList.add('tile', 'noselect', 'static-tile');

            img.src = './imgs/static.png';

            let imgSize = parseFloat(getComputedStyle(img).width);

            // need to place images a little short of radius to make sure the center of
            // the image is in the correct place (in css the images have transform(-50%, -50%) )
            let radiusReduced = radiusOffset * (radius - imgSize / 2);

            let left = containerWidth / 2 + radiusReduced * Math.cos(degrees_to_radians(i));
            let top = radius + radiusReduced * Math.sin(degrees_to_radians(-i));

            img.style.left = left - imgSize / 2 + 'px';
            img.style.top = top - imgSize / 2 + 'px';

            let imgCopy = img.cloneNode(true);
            imgCopy.classList.add('selectable');
            document.getElementById('stage-three').getElementsByClassName("outer-tiles")[0].appendChild(imgCopy);
        }
    }

    for (let tileContainer of document.getElementsByClassName('tiles')) {
        removeChildren(tileContainer);
    }
    drawStageOne();
    drawStageTwoAndThree();
}


function* generateTest() {
    let prevTileIndex = [-1, -2];
    let prevCarIndex = [-1, -2];

    while (true) {
        let currentTileIndex = randomInt(0, 7);
        let currentCarIndex = randomInt(1, 3);
        let fakeCarIndex = randomInt(1, 3);

        while (prevTileIndex[1] === prevTileIndex[0] && prevTileIndex[0] === currentTileIndex) {
            currentTileIndex = randomInt(0, 7);
        }

        while (prevCarIndex[1] === prevCarIndex[0] && prevCarIndex[0] === currentCarIndex) {
            currentCarIndex = randomInt(1, 3);
        }

        while (fakeCarIndex === currentCarIndex) {
            fakeCarIndex = randomInt(1, 3);
        }

        prevCarIndex[1] = prevCarIndex[0];
        prevCarIndex[0] = currentCarIndex;

        prevTileIndex[1] = prevTileIndex[0];
        prevTileIndex[0] = currentTileIndex;

        yield {
            tile: currentTileIndex,
            car: currentCarIndex,
            fakeCar: fakeCarIndex
        }
    }
}


function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

function isOverflowing(element) {
    return element.clientWidth < element.scrollWidth || element.clientHeight < element.scrollHeight;
}

function changeTextContent(id, content) {
    document.getElementById(id).textContent = content;
}

function calculateTime(seconds) {
    seconds = parseInt(seconds);
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}