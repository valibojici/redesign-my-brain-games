
let startButton = document.getElementById('start-button');
let startContainer = document.getElementById('start-container');
let resultsContainer = document.getElementById('results-container');
let mainContainer = document.getElementById('main-container');
let circle = document.getElementById('circle');
let carContainer = document.getElementById('car-container');
let timer_container = document.getElementById('timer_container');
let countdown_container = document.getElementById('countdown');

let correct_answers_span = document.getElementById('correct');
let incorrect_answers_span = document.getElementById('incorrect');
let accuracy_span = document.getElementById('accuracy');
let best_time_span = document.getElementById('best-react');

mainContainer.style.display = 'none';

let timer = 60;
let timer_interval = null;

let correct_answers = 0;
let incorrect_answers = 0;

let total_incorrect_answers = 0;
let total_corect_answers = 0;
let best_reaction_time = 100000;

startButton.addEventListener('click', e=>{

    startContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    timer = 60;
    timer_container.textContent = `Time left 00:${timer}`;
    timer_container.style.display = 'inline';

    correct_answers = 0;
    incorrect_answers = 0;
    total_incorrect_answers = 0;
    total_corect_answers = 0;
    best_reaction_time = 100000;

    setTimeout(()=>{
        countdown_container.textContent = '3';
        setTimeout(()=>{
            countdown_container.textContent = '2';
            setTimeout(()=>{
                countdown_container.textContent = '1';

                timer_interval = setInterval(()=>{
                    timer--;
                    timer_container.textContent = `Time left 00:${timer}`;
            
                    if(timer == 0){
                        clearInterval(timer_interval);
                    }
                }, 1000);
            
                setTimeout(()=>{
                    run();

                    countdown_container.textContent = '';
                }, 1000)
            
                
                
            }, 1000)

        }, 1000)

    }, 0)

    
    
    
});

window.onresize = e=>{
    circle.style.width = window.getComputedStyle(circle).height;
    radius = parseFloat(circle.style.width) / 2;
};
 
function run(){
    if (timer == 0)
    {
        console.log('Done');
        mainContainer.style.display = 'none';
        resultsContainer.style.display = 'flex';
        timer_container.style.display = 'none';

        correct_answers_span.textContent = total_corect_answers;
        incorrect_answers_span.textContent = total_incorrect_answers;
        accuracy_span.textContent = Math.round((total_corect_answers / (total_corect_answers + total_incorrect_answers)) * 100) + '%';
        best_time_span.textContent = best_reaction_time + ' ms';
        return;
    }

    mainContainer.style.display = 'block';
    circle.style.width = window.getComputedStyle(circle).height;
    let radius = parseFloat(circle.style.width) / 2;
    let reaction_time = window.localStorage.getItem('reaction_time') != null 
                            ? parseInt(window.localStorage.reaction_time) : 500;
    

    console.log(reaction_time, incorrect_answers, correct_answers);

    let wrong_answer = false; // true is incorrect car or sign is clicked

    function draw_static_tiles()
    {
        for(let i = 15 + 7.5; i < 360 + 15 + 7.5  ; i += 45)
        {
            let img = document.createElement('img');
            img.src = './assets/imgs/static.png';
            img.classList.add('tile');
            img.classList.add('static');
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
            childs.item(index).src = './assets/imgs/route66logo.png';
            childs.item(index).style.width = '85px';
            childs.item(index).style.height = '85px';
            return (index - 1) / 3;
        }

        function draw(radius_offset, start, increment, isOuter = false)
        {
            for(let i = start; i < 360 + start; i += increment)
            {
                let img = document.createElement('img');
                img.src = './assets/imgs/horse.png';
                img.classList.add('tile');
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
        car.src = `./assets/imgs/car${index}.png`;
        carContainer.appendChild(car);
        car.style.display = 'inline';
        return car;
    }


    let route66_index = draw_tiles();
    let car_index = random_int(1,3);
    addCar(car_index);
    

    setTimeout(() => {
        remove_children(circle);
        draw_static_tiles();
        remove_children(carContainer);
        carContainer.style.backgroundImage = 'url("./assets/imgs/static.png")';
    }, reaction_time);


    let car_answer = null;

    setTimeout( ()=>{
        remove_children(circle);
        carContainer.style.backgroundImage = 'none';

        let fake_car_index = random_int(1, 3);
        while(fake_car_index == car_index)
        {
            fake_car_index = fake_car_index + 1;
            if(fake_car_index > 3)fake_car_index = 1;
        }

        let real_car = addCar(car_index);
        let fake_car = addCar(fake_car_index);
        real_car.isCorrect = 'true';
        fake_car.isCorrect = 'false';

        

        if(random_int(0, 1) == 0)
        {
            // 50% chance cars are swapped
            [real_car.src, fake_car.src] = [fake_car.src, real_car.src];
            [real_car, fake_car] = [fake_car, real_car];
        }

        real_car.addEventListener('click', handle_car_click);
        fake_car.addEventListener('click', handle_car_click);

        function handle_car_click(e)
        {
            [fake_car, real_car].forEach(car => car.removeEventListener('click', handle_car_click));
            remove_children(carContainer);
            draw_static_tiles();

            let index = 0;
            for(let tile of circle.children)
            {
                tile.isCorrect = (index == route66_index ? 'true' : 'false');
                tile.addEventListener('click', handle_tile_click);
                index++;
            }

            if(e.target.isCorrect === 'false')
            {
                wrong_answer = true;
            }
        }

        function handle_tile_click(e)
        {
            if(e.target.isCorrect === 'false'){
                wrong_answer = true;
            }

            for(let tile of circle.children){     
                tile.removeEventListener('click', handle_tile_click);
            }

            if(wrong_answer == true){
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
                    reaction_time += random_int(10, 20);
                }
                else if(reaction_time >= 300){
                    reaction_time += random_int(5, 15)
                }
                else if(reaction_time >= 250){
                    reaction_time += random_int(15, 25)
                }
                else{
                    reaction_time += random_int(8, 18);
                }
                window.localStorage.reaction_time = reaction_time;
                incorrect_answers = 0;
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
                    reaction_time -= random_int(30, 50);
                }
                else if(reaction_time >= 200){
                    reaction_time -= random_int(10, 30);
                }
                else reaction_time -= 15;

                window.localStorage.reaction_time = reaction_time;
                correct_answers = 0;
            }

            remove_children(circle);
            remove_children(carContainer);

            setTimeout(()=>{
                run();
            }, 1000)
        }
        
    }, reaction_time*2); 

    
}

function degrees_to_radians(degrees)
{
    return degrees * (Math.PI/180);
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