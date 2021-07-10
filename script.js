button = document.getElementsByTagName('button')[0];
prev = performance.now();
button.addEventListener('click', e=>{
    t = performance.now();
    console.log(t - prev);
    prev = t;
});