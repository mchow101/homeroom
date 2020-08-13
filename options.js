
var changeToLight = document.getElementById('lightbtn');
changeToLight.addEventListener('click', function() {
        chrome.storage.sync.set({mainbgcolor: '#F2F2F2', elementcolor:'#ffffff', textcolor: '#404040', sliderlight: '#A7ACC6', sliderdark: '#4E598C', radiofill: '#f7a191', timermain: '#4E598C', pomodoroinput: 0}, function() {
            console.log('Value is set for light mode');
        });
        // document.documentElement.style.setProperty('--main-bg-color', '#F2F2F2');
        console.log('Let there be light!');
        // $(':root').css('--main-bg-color', '#F2F2F2');
});


var changeToDark = document.getElementById('darkbtn');
changeToDark.addEventListener('click', function(){
  
        chrome.storage.sync.set({mainbgcolor: '#17181c', elementcolor:'#313135', textcolor: '#eaebf1', sliderlight: '#8b8c8d', sliderdark: '#48484b', radiofill: '#873121', timermain: '#eaebf1'}, function() {
            console.log('Value is set for dark mode');
        });
  
        // document.documentElement.style.setProperty('--main-bg-color', '#121212');
        // $(':root').css('--main-bg-color', '#121212');
        console.log('Let there be...dark? Darkness?');
});
