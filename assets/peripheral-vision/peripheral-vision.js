
let startButton = document.getElementById('start-button');
let startContainer = document.getElementById('start-container');
let resultsContainer = document.getElementById('results-container');
let tryagainButton = document.getElementById('try-again-button');
let resetButtons = document.getElementsByClassName('reset-time');
let mainContainer = document.getElementById('main-container');
let circle = document.getElementById('circle');
let carContainer = document.getElementById('car-container');
let timer_container = document.getElementById('timer-container');
let countdown_container = document.getElementById('countdown');

let correct_answers_span = document.getElementById('correct');
let incorrect_answers_span = document.getElementById('incorrect');
let accuracy_span = document.getElementById('accuracy');
let best_time_span = document.getElementById('best-react');

mainContainer.style.display = 'none';

let timer = 0;
let timer_interval = null;

let correct_answers = 0;
let incorrect_answers = 0;

let total_incorrect_answers = 0;
let total_corect_answers = 0;
let best_reaction_time = 100000;

startButton.addEventListener('click', e=>{
    setup_and_start(); 
});

tryagainButton.addEventListener('click', e=>{
    setup_and_start();
});

for(let button of resetButtons){
    button.addEventListener('click', e=>{
        window.localStorage.removeItem('reaction_time');
        e.target.textContent = 'Reaction time set to 500ms';
        let background = e.target.style.background;

        e.target.style.background = 'transparent';
        setTimeout(()=>{
            e.target.textContent = 'Reset default reaction time';
            e.target.style.background = background;
        }, 1500);
    });
}

function resizeCircleContainer()
{
    circle.style.width = window.getComputedStyle(circle).height;

    let scaleXfactor = 1.8;
    circle.style.transform = `translate(-50%, -50%) scaleX(${scaleXfactor})`;
    while(isOverflowing(mainContainer) && scaleXfactor > 1)
    {
        circle.style.transform = `translate(-50%, -50%) scaleX(${scaleXfactor})`;
        scaleXfactor -= 0.05;
    } 
}

window.onresize = e=>{
    resizeCircleContainer();
};

function setup_and_start()
{
    startContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    timer = 60;
    timer_container.textContent = `Time left ${display_time(timer)}`;
    timer_container.style.display = 'inline';

    correct_answers = 0;
    incorrect_answers = 0;
    total_incorrect_answers = 0;
    total_corect_answers = 0;
    best_reaction_time = 10000000;

    setTimeout(()=>{
        countdown_container.textContent = '3';
    }, 0);

    setTimeout(()=>{
        countdown_container.textContent = '2';
    }, 1000);

    setTimeout(()=>{
        countdown_container.textContent = '1';
        setTimeout(() => {
            countdown_container.textContent = '';
        }, 1000);

        setTimeout(()=>{
            timer_interval = setInterval(()=>{
                timer--;
                timer_container.textContent = `Time left ${display_time(timer)}`;
        
                if(timer == 0){
                    clearInterval(timer_interval);
                }
            }, 1000);

            run();
        }, 2000)
    
    }, 2000)

}

 
function run(){
    if (timer == 0){
        terminate();
        return;
    }

    mainContainer.style.display = 'block';
    resizeCircleContainer();
    let radius = parseFloat(circle.style.width) / 2;

    let reaction_time = window.localStorage.getItem('reaction_time') != null 
                            ? parseInt(window.localStorage.reaction_time) : 500;    

    console.log(reaction_time, incorrect_answers, correct_answers);

    let wrong_answer = false; // true if incorrect car or sign is clicked

    function draw_static_tiles()
    {
        for(let i = 15 + 7.5, j=0; i < 360 + 15 + 7.5; i += 45, j++)
        {
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

    function draw_tiles()
    {
        function change_to_logo()
        {
            let childs = circle.children;
            let index = random_int(0, 7) * 3 + 1;
            childs.item(index).src = './imgs/route66logo.png';

            let curr_size = parseInt(window.getComputedStyle(childs.item(index)).width);
            childs.item(index).style.width = `${curr_size * 1.25}px`;
            childs.item(index).style.height = `${curr_size * 1.25}px`;
            return (index - 1) / 3;
        }

        function draw(radius_offset, start, increment, isOuter = false)
        {
            for(let i = start; i < 360 + start; i += increment)
            {
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
            if(isOuter)
            {
                return change_to_logo();
            }
        }
        let route66_index = draw(0.9, 7.5, 15, true);
        draw(0.7, 0, 22.5);
        draw(0.5, 22.5, 45);
        return route66_index;
    }

    function addCar(index)
    {
        let car = document.createElement('img');
        car.src = `./imgs/car${index}.png`;
        car.style.display = 'inline';
        car.classList.add('noselect');
        carContainer.appendChild(car);
        return car;
    }


    // draw all tiles and route66 logo and the car
    let route66_index, car_index;
    setTimeout(()=>{
        route66_index = draw_tiles();
        car_index = random_int(1,3);
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
    setTimeout( ()=>{
        remove_children(circle);
        carContainer.style.backgroundImage = 'none';

        let fake_car_index = random_int(1, 3);
        while(fake_car_index == car_index)
        {
            fake_car_index = fake_car_index + 1;
            if(fake_car_index > 3)fake_car_index = 1;
        }

        let real_car, fake_car;
        if(random_int(0, 1) == 0)
        {
            real_car = addCar(car_index);
            fake_car = addCar(fake_car_index);
        }
        else
        {
            fake_car = addCar(fake_car_index);
            real_car = addCar(car_index);
        }
        real_car.isCorrect = true;
        fake_car.isCorrect = false;

        real_car.addEventListener('click', handle_car_click);
        fake_car.addEventListener('click', handle_car_click);

        function handle_car_click(e)
        {
            if(!e.target.isCorrect){
                wrong_answer = true;
            }

            fake_car.removeEventListener('click', handle_car_click);
            real_car.removeEventListener('click', handle_car_click);
            remove_children(carContainer);

            draw_static_tiles();

            let index = 0;
            for(let tile of circle.children)
            {
                tile.isCorrect = (index === route66_index);
                tile.addEventListener('click', handle_tile_click);
                index++;
            }
        }

        function handle_tile_click(e)
        {
            if(!e.target.isCorrect){
                wrong_answer = true;
            }

            for(let tile of circle.children){     
                tile.removeEventListener('click', handle_tile_click);
            }

            remove_children(circle);

            if(wrong_answer){
                incorrect_answers++;
                total_incorrect_answers++;
            }
            else{
                correct_answers++;
                total_corect_answers++;

                if(reaction_time < best_reaction_time){
                    best_reaction_time = reaction_time;
                }
            }

            if(incorrect_answers == 2){
                if(reaction_time >= 800){
                    reaction_time += 20;
                }
                else if (reaction_time >= 500){
                    reaction_time += random_int(5, 10);
                }
                else if(reaction_time >= 300){
                    reaction_time += random_int(10, 20)
                }
                else if(reaction_time >= 250){
                    reaction_time += random_int(15, 25)
                }
                else if(reaction_time >= 200){
                    reaction_time += random_int(30, 60);
                }
                else if(reaction_time >= 150){
                    reaction_time += random_int(40, 80);
                }
                else if(reaction_time >= 100){
                    reaction_time += random_int(50, 100);
                }
                else if(reaction_time >= 70){
                    reaction_time += random_int(50, 120);
                }
                else{
                    reaction_time += random_int(50, 170);
                }
                window.localStorage.reaction_time = reaction_time;
                incorrect_answers = 0;
                correct_answers = 0;
            }
            
            if(correct_answers == 3){
                if(reaction_time >= 800){
                    reaction_time = 500;
                }
                else if(reaction_time >= 500){
                    reaction_time -= random_int(100, 180);
                }
                else if(reaction_time >= 400){
                    reaction_time -= random_int(80, 120);
                }
                else if(reaction_time >= 300){
                    reaction_time -= random_int(65, 100);
                }
                else if(reaction_time >= 250){
                    reaction_time -= random_int(35, 50);
                }
                else if(reaction_time >= 200){
                    reaction_time -= random_int(10, 30);
                }
                else if(reaction_time >= 140){
                    reaction_time -= random_int(10, 15);
                }
                else if(reaction_time >= 70){
                    reaction_time -= 8;
                }
                else reaction_time -= 5;

                window.localStorage.reaction_time = reaction_time;
                correct_answers = 0;
                incorrect_answers = 0;
            }

            setTimeout(()=>{
                run();
            }, 1000)
        }
        
    }, reaction_time*2); 

    
}

function terminate()
{
    console.log('Done');
    mainContainer.style.display = 'none';
    resultsContainer.style.display = 'flex';
    timer_container.style.display = 'none';

    correct_answers_span.textContent = total_corect_answers;
    incorrect_answers_span.textContent = total_incorrect_answers;
    accuracy_span.textContent = Math.round((total_corect_answers / (total_corect_answers + total_incorrect_answers)) * 100) + '%';
    best_time_span.textContent = best_reaction_time + ' ms';
}

function degrees_to_radians(degrees)
{
    return degrees * (Math.PI/180);
}
 
function display_time(timer)
{
    // returns string in format mm:ss
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function random_int(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function remove_children(element)
{
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

function isOverflowing(element)
{
    return element.clientWidth < element.scrollWidth || element.clientHeight < element.scrollHeight;
}