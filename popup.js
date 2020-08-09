var slider = document.getElementById("choose-tab");
var current = '1';
slider.addEventListener("change", function () {
    current = slider.value;
    changetab();
});

function changetab() {
    if (current.charAt(0) === '1') {
        console.log("Tasks tab");
        document.getElementById("tasks").style.display = "block";
        document.getElementById("classes").style.display = "none";
        document.getElementById("pomodoro").style.display = "none";
    }

    else if (current.charAt(0) === '2') {
        console.log("Classes");
        document.getElementById("tasks").style.display = "none";
        document.getElementById("classes").style.display = "block";
        document.getElementById("pomodoro").style.display = "none";
    }

    else {
        console.log("Pomodoro");
        document.getElementById("tasks").style.display = "none";
        document.getElementById("classes").style.display = "none";
        document.getElementById("pomodoro").style.display = "block";
    }
}

$(document).ready(function () {
    changetab();

    let tasks = document.getElementsByClassName('task');
    let sections = document.getElementsByClassName('section-header');

    for (var i = 0; i < sections.length; i++) {
        sections[i].nextElementSibling.innerHTML = sections[i].nextElementSibling.innerHTML + '<dd><button class="plus">add</button><input type="text" id="' + sections[i].textContent.substring(1) + '" class="new-todo"></input></dd>';
        sections[i].id = sections[i].textContent.substring(1);
        sections[i].addEventListener("click", function () {
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
                this.textContent = this.textContent.replace('-', '+');
            } else {
                content.style.display = "block";
                this.textContent = this.textContent.replace('+', '-');
            }
        });
    }
    
    $('.plus').click(function () {
        var content = $(this).next().val()
        if (content != "") {
            console.log(this.id);
            $(this).before('<label><input type="checkbox" class="task"></input><span>' + content + '</span></label><br>');
        }
    });

    // Pomodoro Timer Code is Below
    let progressBar = document.querySelector('.e-c-progress');
    let indicator = document.getElementById('e-indicator');
    let pointer = document.getElementById('e-pointer');
    let length = Math.PI * 2 * 100;

    progressBar.style.strokeDasharray = length;

    function update(value, timePercent) {
        var offset = - length - length * value / (timePercent);
        progressBar.style.strokeDashoffset = offset;
        pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`;
    };

    //circle ends
    const displayOutput = document.querySelector('.display-remain-time')
    const pauseBtn = document.getElementById('pause');
    const setterBtns = document.querySelectorAll('button[data-setter]');

    let intervalTimer;
    let timeLeft;
    let wholeTime = 0.5 * 60; // manage this to set the whole time 
    let isPaused = false;
    let isStarted = false;


    update(wholeTime, wholeTime); //refreshes progress bar
    displayTimeLeft(wholeTime);

    function changeWholeTime(seconds) {
        if ((wholeTime + seconds) > 0) {
            wholeTime += seconds;
            update(wholeTime, wholeTime);
        }
    }

    for (var i = 0; i < setterBtns.length; i++) {
        setterBtns[i].addEventListener("click", function (event) {
            var param = this.dataset.setter;
            switch (param) {
                case 'minutes-plus':
                    changeWholeTime(1 * 60);
                    break;
                case 'minutes-minus':
                    changeWholeTime(-1 * 60);
                    break;
                case 'seconds-plus':
                    changeWholeTime(1);
                    break;
                case 'seconds-minus':
                    changeWholeTime(-1);
                    break;
            }
            displayTimeLeft(wholeTime);
        });
    }

    function timer(seconds) { //counts time, takes seconds
        let remainTime = Date.now() + (seconds * 1000);
        displayTimeLeft(seconds);

        intervalTimer = setInterval(function () {
            timeLeft = Math.round((remainTime - Date.now()) / 1000);
            if (timeLeft < 0) {
                clearInterval(intervalTimer);
                isStarted = false;
                setterBtns.forEach(function (btn) {
                    btn.disabled = false;
                    btn.style.opacity = 1;
                });
                displayTimeLeft(wholeTime);
                pauseBtn.classList.remove('pause');
                pauseBtn.classList.add('play');
                return;
            }
            displayTimeLeft(timeLeft);
        }, 1000);
    }

    function pauseTimer(event) {
        if (isStarted === false) {
            timer(wholeTime);
            isStarted = true;
            this.classList.remove('play');
            this.classList.add('pause');

            setterBtns.forEach(function (btn) {
                btn.disabled = true;
                btn.style.opacity = 0.5;
            });

        } else if (isPaused) {
            this.classList.remove('play');
            this.classList.add('pause');
            timer(timeLeft);
            isPaused = isPaused ? false : true
        } else {
            this.classList.remove('pause');
            this.classList.add('play');
            clearInterval(intervalTimer);
            isPaused = isPaused ? false : true;
        }
    }

    function displayTimeLeft(timeLeft) { //displays time on the input
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        displayOutput.textContent = displayString;
        update(timeLeft, wholeTime);
    }

    pauseBtn.addEventListener('click', pauseTimer);
});
