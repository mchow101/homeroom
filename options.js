
var changeToLight = document.getElementById('lightbtn');
changeToLight.addEventListener('click', function() {
        chrome.storage.sync.set({mainbgcolor: '#F2F2F2', elementcolor:'#ffffff', textcolor: '#404040', sliderlight: '#A7ACC6', sliderdark: '#4E598C', radiofill: '#f7a191', timermain: '#4E598C'}, function() {
            console.log('Value is set for light mode');
        });
        console.log('Let there be light!');
});


var changeToDark = document.getElementById('darkbtn');
changeToDark.addEventListener('click', function(){
  
        chrome.storage.sync.set({mainbgcolor: '#121212', elementcolor:'#252230', textcolor: '#eaebf1', sliderlight: '#bcbfd0', sliderdark: '#8e93ae', radiofill: '#873121', timermain: '#eaebf1'}, function() {
            console.log('Value is set for dark mode');
        });

        console.log('Let there be...dark? Darkness?');
});
