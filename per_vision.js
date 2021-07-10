

let circle = document.getElementById('circle');
let carContainer = document.getElementById('car-container');
circle.style.width = window.getComputedStyle(circle).height;

let radius = parseFloat(circle.style.width) / 2;
console.log(radius);


window.onresize = e=>{
    circle.style.width = window.getComputedStyle(circle).height;
    radius = parseFloat(circle.style.width) / 2;
};

function degrees_to_radians(degrees)
{
    return degrees * (Math.PI/180);
}

function random_int(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function change_to_logo()
{
    let childs = circle.children;
    let index = random_int(0, 7) * 3 + 1;
    childs.item(index).src = './assets/imgs/route66logo.png';
    childs.item(index).style.width = '85px';
    childs.item(index).style.height = '85px';
}

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

function draw_tiles(radius_offset, start, increment, isOuter = false)
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
        change_to_logo();
    }
}

function remove_tiles()
{
    while (circle.firstChild) {
        circle.removeChild(circle.lastChild);
    }
}

draw_tiles(0.9, 7.5, 15, true);
draw_tiles(0.7, 0, 22.5);
draw_tiles(0.5, 22.5, 45);

setTimeout(() => {
    remove_tiles();
    draw_static_tiles();
}, 3000);

setTimeout(()=>{
    remove_tiles();
    draw_tiles(0.9, 7.5, 15, true);
    draw_tiles(0.7, 0, 22.5);
    draw_tiles(0.5, 22.5, 45);

    let car1 = document.createElement('img');
    let car2 = document.createElement('img');
    car1.src = './assets/imgs/car1.png';
    car2.src = './assets/imgs/car3.png';
    car1.style.display = 'inline';
    car2.style.display = 'inline';

    carContainer.appendChild(car1);
    carContainer.appendChild(car2);
    


}, 4000)

// for(let i = 7.5; i<360 + 7.5; i+=15)
// {
//     let img = document.createElement('img');
//     img.src = './assets/imgs/horse.png';
//     img.classList.add('tile');
//     let radius_reduced = 0.9 * radius;
//     let left = radius + radius_reduced * Math.cos(degrees_to_radians(i)) + 'px';
//     let top = radius + radius_reduced * Math.sin(degrees_to_radians(-i)) + 'px';

//     img.style.left = left;
//     img.style.top = top;
//     circle.appendChild(img);
// }

// for(let i=0; i < 360; i += 22.5)
// {
//     let img = document.createElement('img');
//     img.src = './assets/imgs/horse.png';
//     img.classList.add('tile');
//     let radius_reduced = 0.7 * radius;
//     let left = radius + radius_reduced * Math.cos(degrees_to_radians(i)) + 'px';
//     let top = radius + radius_reduced * Math.sin(degrees_to_radians(-i)) + 'px';

//     img.style.left = left;
//     img.style.top = top;
//     circle.appendChild(img);
// }

// for(let i=22.5; i < 360 + 22.5; i += 45)
// {
//     let img = document.createElement('img');
//     img.src = './assets/imgs/horse.png';
//     img.classList.add('tile');
//     let radius_reduced = 0.5 * radius;
//     let left = radius + radius_reduced * Math.cos(degrees_to_radians(i)) + 'px';
//     let top = radius + radius_reduced * Math.sin(degrees_to_radians(-i)) + 'px';

//     img.style.left = left;
//     img.style.top = top;
//     circle.appendChild(img);
// }

// for(let i = 1; i<=24; i+=3)
// {
    
// }