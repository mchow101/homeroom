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
        set_task_list();
    }
}

function section_setup(section) {
    console.log(section.nextElementSibling);
    section.nextElementSibling.innerHTML = section.nextElementSibling.innerHTML + '<dd><input type="text" id="' + section.textContent.substring(1) + '" class="new-todo"  placeholder=" New todo item"></input></dd>';
    section.id = section.textContent.substring(2);
    section.addEventListener("click", function () {
        var content = this.nextElementSibling;
        console.log(content);
        if (content.style.display === "block") {
            content.style.display = "none";
            this.textContent = this.textContent.replace('-', '+');
        } else {
            content.style.display = "block";
            this.textContent = this.textContent.replace('+', '-');
        }
    });
}

function add_todo_input() {
    $('.new-todo').focus(function () {
        $(this).keypress(function (event) {
            if (event.which == 13) {
                var content = $(this).val();
                if (content != "") {
                    console.log(this.id)
                    $(this).before('<label><input type="checkbox" class="task"></input><span>' + content + '</span></label><br>');
                    $(this).val("");
                }
            }
        });
    });
}

function set_task_list() {
    $('option').remove();
    var all_tasks = document.getElementsByClassName("task");
    for (var i = 0; i < all_tasks.length; i++) {
        if (!all_tasks[i].checked) {
            $('#inputGroupSelect01').append('<option>' + all_tasks[i].nextElementSibling.textContent + '</option>');
        }
    }
}

$(document).ready(function () {
    changetab();

    let tasks = document.getElementsByClassName('task');
    let sections = document.getElementsByClassName('section-header');

    let classes = document.getElementsByClassName('classes');
    let classSections = document.getElementsByClassName('class-header');

    for (var i = 0; i < sections.length; i++) {
        section_setup(sections[i]);
    }

    // copied above and tried to tweak for classes
    for (var i = 0; i < classSections.length; i++) {
        section_setup(classSections[i]);
    }

    $('.new-section').focus(function () {
        $(this).keypress(function (event) {
            if (event.which == 13) {
                var content = $(this).val();
                if (content != "") {
                    console.log(document.getElementById('task-list').innerHTML);
                    $('#task-list').prepend('<h5 class="section-header"><span>+ </span>' + content + '</h5><div class="task-section lead"></div>');
                    $(this).val("");
                    section_setup(document.getElementsByClassName("section-header")[0]);
                    add_todo_input();
                }
            }
        });
    });

    $('.new-class').focus(function () {
        $(this).keypress(function (event) {
            if (event.which == 13) {
                var content = $(this).val();
                if (content != "") {
                    console.log(document.getElementById('class-list').innerHTML);
                    $('#class-list').prepend('<h5 class="class-header"><span>+ </span>' + content + '</h5><div class="task-section lead"></div>');
                    $('#task-list').prepend('<h5 class="section-header"><span>+ </span>' + content + '</h5><div class="task-section lead"></div>');
                    $(this).val("");
                    section_setup(document.getElementsByClassName("class-header")[0]);
                    add_todo_input();
                    section_setup(document.getElementsByClassName("section-header")[0]);
                    add_todo_input();
                }
            }
        });
    });

    add_todo_input();

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
    const workInput = document.getElementById('work-period');

    let intervalTimer;
    let timeLeft;
    //let wholeTime = 25;

    let workTime = document.getElementById('work-period').value * 60; // manage this to set the whole time 
    //let breakTime = document.getElementById('break-period').value * 60;

    let isPaused = false;
    let isStarted = false;

    update(workTime, workTime); //refreshes progress bar
    displayTimeLeft(workTime);

    function changeWholeTime(seconds) {
        if ((workTime + seconds) > 0) {
            workTime += seconds;
            update(workTime, workTime);
        }
    }

    /*for (var i = 0; i < setterBtns.length; i++) {
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
    }*/

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
                displayTimeLeft(workTime);
                pauseBtn.classList.remove('pause');
                pauseBtn.classList.add('play');
                return;
            }
            displayTimeLeft(timeLeft);
        }, 1000);
    }

    function pauseTimer(event) {
        if (isStarted === false) {
            timer(workTime);
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
        console.log(timeLeft);
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        displayOutput.textContent = displayString;
        update(timeLeft, workTime);
    }

    pauseBtn.addEventListener('click', pauseTimer);

    workInput.addEventListener('change', function timerReset() {
        workTime =  document.getElementById("work-period").value * 60;
        //pauseTimer();
        timeLeft = workTime;
        displayTimeLeft(workTime);
        update(workTime, workTime);
    });
});