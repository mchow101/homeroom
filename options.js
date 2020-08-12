
let changeToLight = document.getElementById('btn-changeToLight');
changeToLight.addEventListener('click', setTheme('Light'));


let changeToDark = document.getElementById('btn-changeToDark');
changeToDark.addEventListener('click', setTheme('Dark'));

function setTheme(theme) {
    if (theme == 'Light') {
        // document.documentElement.style.setProperty('--main-bg-color', '#F2F2F2');
        console.log('Let there be light!');
        $(':root').css('--main-bg-color', '#F2F2F2');
    }
    if (theme == 'Dark') {
        // document.documentElement.style.setProperty('--main-bg-color', '#121212');
        $(':root').css('--main-bg-color', '#121212');
        console.log('Let there be...dark? Darkness?');
    }
}

