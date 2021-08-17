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
    
    startContainer.classList.add('hide');
    gameContainer.classList.remove('hide');
    countdownContainer.classList.remove('hide');

    let secondsLeft = document.getElementById('seconds-input').value;
    let secondsInterval = null;
    let reactionTime = document.getElementById('reaction-time-input').value;

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
            terminate();
            return;
        }

        let test = testGenerator.next().value;

        function stageOne(){
            let container = document.getElementById('stage-one');
            let tile = container.getElementsByClassName('outer-tiles')[0].children[test.tile];
            let car = container.getElementsByClassName('car-container')[0].getElementsByTagName('img')[0];
            console.log(tile, car);
            
            // make sure all images are loaded first
            let images = [
                {elem:tile , src:'./imgs/logo.png'}, 
                {elem:car, src:`./imgs/car${test.car}.png`}
            ].map(item=>{
                return new Promise((resolve, reject)=>{
                    item.elem.src = item.src;
                    item.elem.onload = resolve;
                    item.elem.onerror = reject;
                });
            });
            
            Promise.all(images).then((vals)=>{
                console.log(vals, 'images loaded');
                container.classList.remove('hide');
            })
        }

        stageOne();
    }
}


function run() {
    if (secondsLeft == 0) {
        terminate();
        return;
    }

    

    document.getElementById('stage-one').classList.remove('hide');

    mainContainer.style.display = 'block';
    resizeCircleContainer();
    let radius = parseFloat(circle.style.width) / 2;

    let reaction_time = window.localStorage.getItem('reaction_time') != null ?
        parseInt(window.localStorage.reaction_time) : 500;

    console.log(reaction_time, incorrect_answers, correct_answers);

    let wrong_answer = false; // true if incorrect car or sign is clicked

    function draw_static_tiles() {
        for (let i = 15 + 7.5, j = 0; i < 360 + 15 + 7.5; i += 45, j++) {
            let img = document.createElement('img');
            img.src = './imgs/static.png';
            img.classList.add('tile', 'static', 'noselect');

            let radius_reduced = 0.9 * radius;
            let left = radius + radius_reduced * Math.cos(degrees_to_radians(i)) + 'px';
            let top = radius + radius_reduced * Math.sin(degrees_to_radians(-i)) + 'px';

            img.style.left = left;
            img.style.top = top;
            circle.appendChild(img);
        }
    }

    function draw_tiles() {
        function change_to_logo() {
            let childs = circle.children;
            let index = random_int(0, 7) * 3 + 1;
            childs.item(index).src = './imgs/route66logo.png';

            let curr_size = parseInt(window.getComputedStyle(childs.item(index)).width);
            childs.item(index).style.width = `${curr_size * 1.25}px`;
            childs.item(index).style.height = `${curr_size * 1.25}px`;
            return (index - 1) / 3;
        }

        function draw(radius_offset, start, increment, isOuter = false) {
            for (let i = start; i < 360 + start; i += increment) {
                let img = document.createElement('img');
                img.src = './imgs/horse.png';
                img.classList.add('tile', 'noselect');
                img.style.transform = `translate(-50%, -50%) scaleX(${1 / parseFloat(circle.style.transform.substr(22))})`;
                let radius_reduced = radius_offset * radius;
                let left = radius + radius_reduced * Math.cos(degrees_to_radians(i)) + 'px';
                let top = radius + radius_reduced * Math.sin(degrees_to_radians(-i)) + 'px';

                img.style.left = left;
                img.style.top = top;
                circle.appendChild(img);
            }
            if (isOuter) {
                return change_to_logo();
            }
        }
        let route66_index = draw(0.9, 7.5, 15, true);
        draw(0.7, 0, 22.5);
        draw(0.5, 22.5, 45);
        return route66_index;
    }

    function addCar(index) {
        let car = document.createElement('img');
        car.src = `./imgs/car${index}.png`;
        car.style.display = 'inline';
        car.classList.add('noselect');
        carContainer.appendChild(car);
        return car;
    }


    // draw all tiles and route66 logo and the car
    let route66_index, car_index;
    setTimeout(() => {
        route66_index = draw_tiles();
        car_index = random_int(1, 3);
        addCar(car_index);
    }, 0)

    // after reaction time milliseconds remove everything and draw static
    setTimeout(() => {
        remove_children(circle);
        draw_static_tiles(route66_index);
        remove_children(carContainer);
        carContainer.style.backgroundImage = 'url("./imgs/static.png")';
    }, reaction_time);


    // after 2*reaction time milliseconds, draw 2 cars and static tiles to  choose from
    setTimeout(() => {
        remove_children(circle);
        carContainer.style.backgroundImage = 'none';

        let fake_car_index = random_int(1, 3);
        while (fake_car_index == car_index) {
            fake_car_index = fake_car_index + 1;
            if (fake_car_index > 3) fake_car_index = 1;
        }

        let real_car, fake_car;
        if (random_int(0, 1) == 0) {
            real_car = addCar(car_index);
            fake_car = addCar(fake_car_index);
        } else {
            fake_car = addCar(fake_car_index);
            real_car = addCar(car_index);
        }
        real_car.isCorrect = true;
        fake_car.isCorrect = false;

        real_car.addEventListener('click', handle_car_click);
        fake_car.addEventListener('click', handle_car_click);

        function handle_car_click(e) {
            if (!e.target.isCorrect) {
                wrong_answer = true;
            }

            fake_car.removeEventListener('click', handle_car_click);
            real_car.removeEventListener('click', handle_car_click);
            remove_children(carContainer);

            draw_static_tiles();

            let index = 0;
            for (let tile of circle.children) {
                tile.isCorrect = (index === route66_index);
                tile.addEventListener('click', handle_tile_click);
                index++;
            }
        }

        function handle_tile_click(e) {
            if (!e.target.isCorrect) {
                wrong_answer = true;
            }

            for (let tile of circle.children) {
                tile.removeEventListener('click', handle_tile_click);
            }

            remove_children(circle);

            if (wrong_answer) {
                incorrect_answers++;
                total_incorrect_answers++;
            } else {
                correct_answers++;
                total_corect_answers++;

                if (reaction_time < best_reaction_time) {
                    best_reaction_time = reaction_time;
                }
            }

            if (incorrect_answers == 2) {
                if (reaction_time >= 800) {
                    reaction_time += 20;
                } else if (reaction_time >= 500) {
                    reaction_time += random_int(5, 10);
                } else if (reaction_time >= 300) {
                    reaction_time += random_int(10, 20)
                } else if (reaction_time >= 250) {
                    reaction_time += random_int(15, 25)
                } else if (reaction_time >= 200) {
                    reaction_time += random_int(30, 60);
                } else if (reaction_time >= 150) {
                    reaction_time += random_int(40, 80);
                } else if (reaction_time >= 100) {
                    reaction_time += random_int(50, 100);
                } else if (reaction_time >= 70) {
                    reaction_time += random_int(50, 120);
                } else {
                    reaction_time += random_int(50, 170);
                }
                window.localStorage.reaction_time = reaction_time;
                incorrect_answers = 0;
                correct_answers = 0;
            }

            if (correct_answers == 3) {
                if (reaction_time >= 800) {
                    reaction_time = 500;
                } else if (reaction_time >= 500) {
                    reaction_time -= random_int(100, 180);
                } else if (reaction_time >= 400) {
                    reaction_time -= random_int(80, 120);
                } else if (reaction_time >= 300) {
                    reaction_time -= random_int(65, 100);
                } else if (reaction_time >= 250) {
                    reaction_time -= random_int(35, 50);
                } else if (reaction_time >= 200) {
                    reaction_time -= random_int(10, 30);
                } else if (reaction_time >= 140) {
                    reaction_time -= random_int(10, 15);
                } else if (reaction_time >= 70) {
                    reaction_time -= 8;
                } else reaction_time -= 5;

                window.localStorage.reaction_time = reaction_time;
                correct_answers = 0;
                incorrect_answers = 0;
            }

            setTimeout(() => {
                run();
            }, 1000)
        }

    }, reaction_time * 2);


}

function terminate() {
    console.log('Done');
    mainContainer.style.display = 'none';
    resultsContainer.style.display = 'flex';
    timer_container.style.display = 'none';

    correct_answers_span.textContent = total_corect_answers;
    incorrect_answers_span.textContent = total_incorrect_answers;
    accuracy_span.textContent = Math.round((total_corect_answers / (total_corect_answers + total_incorrect_answers)) * 100) + '%';
    best_time_span.textContent = best_reaction_time + ' ms';
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

        while(fakeCarIndex === currentCarIndex){
            fakeCarIndex = randomInt(1, 3);
        }

        prevCarIndex[1] = prevCarIndex[0];
        prevCarIndex[0] = currentCarIndex;

        prevTileIndex[1] = prevTileIndex[0];
        prevTileIndex[0] = currentTileIndex;

        yield {
            tile: currentTileIndex,
            car: currentCarIndex,
            fakeCar : fakeCarIndex
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