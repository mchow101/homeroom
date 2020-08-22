// Initialize important pomodoro, connection, and task/link list variables
var pomodoro_work;
var timeLeft;
var port = chrome.runtime.connect({ name: "conn" }); // establishes connection to background.js
var pom_port = chrome.runtime.connect({ name: "pomodoro" });
var task_counter = 0;
var link_counter = 0;

// top slider to change tabs
var slider = document.getElementById("choose-tab");
var current = "1";
slider.addEventListener("change", function () {
    current = slider.value;
    changetab();
});

// change tabs
function changetab() {
    if (current.charAt(0) === '1') { // Tab #1
        document.getElementById("tasks").style.display = "block";
        document.getElementById("classes").style.display = "none";
        document.getElementById("pomodoro").style.display = "none";
        document.getElementById("blocker").style.display = "none";
    }

    else if (current.charAt(0) === '2') { // Tab #2
        document.getElementById("tasks").style.display = "none";
        document.getElementById("classes").style.display = "block";
        document.getElementById("pomodoro").style.display = "none";
        document.getElementById("blocker").style.display = "none";
    }

    else if (current.charAt(0) === '3') { // Tab #3
        document.getElementById("tasks").style.display = "none";
        document.getElementById("classes").style.display = "none";
        document.getElementById("pomodoro").style.display = "block";
        document.getElementById("blocker").style.display = "none";
        set_task_list();
    }
 
    else { // Tab #4
        document.getElementById("tasks").style.display = "none";
        document.getElementById("classes").style.display = "none";
        document.getElementById("pomodoro").style.display = "none";
        document.getElementById("blocker").style.display = "block";
    }
}

// Get Theme Mode from options file
function getTheme() {
    chrome.storage.sync.get(['mainbgcolor', 'elementcolor', 'textcolor', 'sliderlight', 'sliderdark', 'radiofill', 'timermain'], function (data) {
        document.documentElement.style.setProperty('--main-bg-color', data.mainbgcolor);
        document.documentElement.style.setProperty('--element-color', data.elementcolor);
        document.documentElement.style.setProperty('--text-color', data.textcolor);
        document.documentElement.style.setProperty('--slider-light', data.sliderlight);
        document.documentElement.style.setProperty('--slider-dark', data.sliderdark);
        document.documentElement.style.setProperty('--radio-fill', data.radiofill);
        document.documentElement.style.setProperty('--timer-main', data.timermain);
    });
}

// adds a subsection with input box and collapsible header
function section_setup(section) {
    // possibly at some point add way to change placeholder to add a link/class meeting time/whatever if it's in class
    if (section.parentElement.id === "class-list" || section.parentElement.id === "new-class") {
        console.log(section.nextElementSibling);
        section.nextElementSibling.innerHTML = section.nextElementSibling.innerHTML +
            '<label for="days">Choose class days:</label><br>' +
            '<select name="days" class="days"><option value="Monday">Monday</option>' +
            '<option value="Tuesday">Tuesday</option><option value="Wednesday">Wednesday</option>' +
            '<option value="Thursday">Thursday</option><option value="Friday">Friday</option>' +
            '<option value="Saturday">Saturday</option><option value="Sunday">Sunday</option></select>' +
            '<select name="time" class="time"><option value="9">9:00</option>' +
            '<option value="10">10:00</option><option value="11">11:00</option>' +
            '<option value="12">12:00</option><option value="1">1:00</option>' +
            '<option value="2">2:00</option><option value="3">3:00</option></select>' +
            '<br><input type="submit" value="Submit" class="submit"><br><br>';

        port.postMessage({ action: "Update classes", class: section.textContent.substring(2) });
    } else {
        section.nextElementSibling.innerHTML = section.nextElementSibling.innerHTML +
            '<input type="text" id="' + section.textContent.substring(2) +
            '" class="new-todo"  placeholder=" New todo item" style="font-size: 16px; "></input>';
    }
    section.id = section.textContent.substring(2);
    section.addEventListener("click", function () {
        var content = this.nextElementSibling;
        // change + and - when list is expanded vs. not expanded
        if (content.style.display === "block") {
            content.style.display = "none";
            this.textContent = this.textContent.replace('-', '+');
        } else {
            content.style.display = "block";
            this.textContent = this.textContent.replace('+', '-');
        }
    });
}

// adds an input box which can add text to the section (new task, link, etc.)
function add_todo_input() {
    $(".new-todo").focus(function () {
        $(this).keypress(function (event) {
            if (event.which == 13) {
                var content = $(this).val();
                if (content != "") {

                    // if it's a valid link
                    if (
                        content.includes("http") ||
                        content.includes("https") ||
                        content.includes("www")
                    ) {
                        var has_spaces = $.trim(content).split(" ");
                        if (has_spaces.length == 1) {
                            if (!content.includes("http") || content.includes("https"))
                                content = "http://" + content;
                            $(this).after('<br><a href="' + content + '" target = "_blank">' + content + "</a>");
                            $(this).val("");
                        } else {
                            to_add_to_list =
                                '<br><label id="task' + task_counter + '" style="font-size:17px;"><input type="checkbox" class="task"></input><span>';
                            add_to_end = "</span></label>";
                            for (var i = 0; i < has_spaces.length; i++) {
                                if (
                                    has_spaces[i].includes("http") ||
                                    has_spaces[i].includes("https") ||
                                    has_spaces[i].includes("www")
                                ) {
                                    if (!has_spaces[i].includes("http") || has_spaces[i].includes("https"))
                                        has_spaces[i] = "http://" + has_spaces[i];
                                    to_add_to_list +=
                                        '<a href="' +
                                        has_spaces[i] +
                                        '" target = "_blank">' +
                                        has_spaces[i] +
                                        "</a>";
                                } else {
                                    to_add_to_list += has_spaces[i] + " ";
                                }
                            }
                            to_add_to_list = to_add_to_list + add_to_end;
                            $(this).after(to_add_to_list);
                            $(this).val("");
                        }
                    }
                    //if it's not a link
                    else {
                        $(this).after(
                            '<br><label id="task' + task_counter
                            + '" style="font-size:17px;"><input type="checkbox" class="task" id="checkbox'
                            + task_counter + '"></input><span>'
                            + content +
                            '</span><input type = "button" class="remove" value ="&times"></input></label>'
                        );
                        $(this).val("");
                    }
                    // add to background list
                    var section_id = this.id;
                    port.postMessage({
                        action: "Update tasks",
                        task: content,
                        checked: false,
                        section: section_id,
                    });

                    // listener for check
                    $("#checkbox" + task_counter).click(function () {
                        port.postMessage({ action: "Update tasks", task: content, checked: this.checked, section: section_id });
                    });

                    // listener for removing items
                    $(".remove").off("click");
                    $(".remove").click(function () {
                        var to_be_removed = $(this).parentsUntil('div');
                        port.postMessage({ action: "Remove task", task: content, section: section_id });
                        $(to_be_removed[0]).prev().remove();
                        for (var i = 0; i < to_be_removed.length; i++) {
                            to_be_removed[i].remove();
                        }
                    });

                    // update task_counter
                    task_counter++;
                }
            }
        });
    });
}

// add blocked links to Website Blocker Tab
$("#add-blocked").focus(function () {
    $(this).keypress(function (event) {
        if (event.which == 13) {
            var content = $(this).val();
            if (content != "") {
                // if it's a valid link
                if (
                    content.includes("http") ||
                    content.includes("https") ||
                    content.includes("www")
                ) {
                    var has_spaces = $.trim(content).split(" ");
                    if (has_spaces.length == 1) {
                        if (!content.includes("http") || content.includes("https"))
                            content = "http://" + content;
                        $(this).after('<br><a href="' + content + '" target = "_blank">' + content + "</a>");
                        $(this).val("");
                        port.postMessage({
                            action: "Update links",
                            link: content
                        });
                    } else {
                        alert("Please enter only the link of the website you would like to block.");
                    }
                }
                //if it's not a link
                else {
                    alert("Please enter a valid link.");
                }
            }
        }
    });
});

// finds all unchecked items and adds them to pomodoro task list
function set_task_list() {
    var task_list = [];
    port.postMessage({ action: "Get tasks", signature: "set_task_list" });
    port.onMessage.addListener(function (msg) {
        if (msg.signature === "set_task_list") {
            task_list = msg.tasks;
            $('option').remove();
            for (var i = 0; i < task_list.length; i++) {
                if (!task_list[i][1]) {
                    $('#inputGroupSelect01').append('<option>' + task_list[i][0] + '</option>');
                }
            }
        }
    });
}

// chooses a message to display for pomodoro
function get_message(work) {
    back_messages = [
        "Did you enjoy your break?",
        "Hope you had a restful break!",
        "Did you have a good break?",
        "Some time off is always nice, but...",
        "How was your break?",
    ];
    work_messages = [
        "Time to get back to work!",
        "Let's get cracking again!",
        "Are you ready to get some more work done?",
        "Your work is waiting for you!",
        "Get ready to focus again!",
        "Let's get back to work now!",
        "Ready... Set... Work!",
    ];
    break_messages = [
        "Let's take a break now!",
        "Good work! You deserve some rest now!",
        "Now seems like a good time for a quick walk!",
        "Nice work! Have you had some water lately?",
        "Great job! Maybe you should hydrate now!",
        "Awesome work! Take a quick break now!",
        "You've been focusing so well! You should take a break now.",
        "You've been working so hard! Do you want to stretch?",
    ];
    if (work) {
        return (
            back_messages[Math.floor(Math.random() * back_messages.length)] +
            " " +
            work_messages[Math.floor(Math.random() * work_messages.length)]
        );
    } else {
        return (
            break_messages[Math.floor(Math.random() * break_messages.length)] + " :)"
        );
    }
}

// Display meet dates for each class list
function meet_setup() {
    $('.submit').off('click');
    $('.submit').click(function () {
        console.log('submitted days');
        sibs = $(this).siblings();
        console.log(sibs);

        var content = "Meets on ";
        select_list = [];

        for (var i = 0; i < sibs.length; i++) {
            if ($(sibs[i]).hasClass('days') || $(sibs[i]).hasClass('time')) {
                select_list = select_list.concat(sibs[i]);
                console.log(select_list);
            }
        }

        // for (var i = 0; i < select_list.length; i++) {
        // if ($(select_list[i]).is("option:selected") && (i != select_list.length - 1))
        content += String($(select_list[0][select_list[0].selectedIndex]).attr('value')) + "s ";
        // else if ($(select_list[i]).is("option:selected"))
        content += "at " + String($(select_list[1][select_list[1].selectedIndex]).attr('value'));
        // }

        console.log(content);
        $(this).after('<br><label id="task"><input type="checkbox" class="task" id="checkbox"></input><span>'
            + content + '</span><input type = "button" class="remove" value ="&times"></input></label>');


        $(".remove").click(function () {
            var to_be_removed = $(this).parentsUntil('div');
            // port.postMessage({ action: "Remove task", task: content, section: section_id });
            $(to_be_removed[0]).prev().remove();
            for (var i = 0; i < to_be_removed.length; i++) {
                to_be_removed[i].remove();
            }
        });
    });
}

// pomodoro timer
let progressBar = document.querySelector(".e-c-progress");
let indicator = document.getElementById("e-indicator");
let pointer = document.getElementById("e-pointer");
let length = Math.PI * 2 * 100;
progressBar.style.strokeDasharray = length;
function update(value, timePercent) {
    var offset = -length - (length * value) / timePercent;
    progressBar.style.strokeDashoffset = offset;
    pointer.style.transform = `rotate(${(360 * value) / timePercent}deg)`;
}
//circle ends
const displayOutput = document.querySelector(".display-remain-time");
const pauseBtn = document.getElementById("pause");
const setterBtns = document.querySelectorAll("button[data-setter]");
const workInput = document.getElementById("work-period");
const breakInput = document.getElementById("break-period");

let intervalTimer;
//let wholeTime = 25;
let workTime = document.getElementById("work-period").value * 60; // manage this to set the whole time
let breakTime = document.getElementById("break-period").value * 60;
let isPaused = false;
let isStarted = false;
let timer_zero = false;
let remainTime = 0;

function timer(seconds) {
    //counts time, takes seconds
    port.postMessage({ signature: "Timer", action: "Timer", seconds: seconds });
    isStarted = true;
    isPaused = false;
    remainTime = Date.now() + seconds * 1000;
    displayTimeLeft(seconds);
}
function pauseTimer(event) {
    if (isStarted === false) {
        // Play
        timer(pomodoro_work ? workTime : breakTime);
        isStarted = true;
        this.classList.remove("play");
        this.classList.add("pause");
        console.log(pomodoro_work ? "Work" : "Break");
    } else if (isPaused) {
        // Play from pause
        this.classList.remove("play");
        this.classList.add("pause");
        timer(timeLeft);
        isPaused = false;
    } else {
        // Pause
        this.classList.remove("pause");
        this.classList.add("play");
        port.postMessage({ signature: "Timer", action: "Stop Timer" })
        isPaused = true;
    }
}
function displayTimeLeft(timeLeft) {
    //displays time on the input
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displayString = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
        }${seconds}`;
    displayOutput.textContent = displayString;
    update(timeLeft, pomodoro_work ? workTime : breakTime);
}

// initialize the popup with saved data
function pop_init() {
    changetab();
    port.postMessage({ action: "Get tasks", signature: "pop_init" });
    port.onMessage.addListener(function (msg) {
        if (msg.signature === "pop_init") {
            var task_list = msg.tasks;
            console.log(task_list);
            // task section headers
            sections = [];
            for (var i = task_list.length - 1; i >= 0; i--) {
                if (!sections.includes(task_list[i][2])) {
                    $('#task-list').prepend('<h5 class="section-header"><span>+ </span>' + task_list[i][2] + '</h5><div class="task-section lead"></div>');
                    section_setup(document.getElementsByClassName("section-header")[0]);
                    sections = sections.concat(document.getElementsByClassName("section-header")[0].id);
                }

                // add tasks
                var label_content = "";
                // if it's a valid link
                if (task_list[i][0].includes("http") || task_list[i][0].includes("https") || task_list[i][0].includes("www")) {
                    var has_spaces = $.trim(task_list[i][0]).split(" ");
                    if (has_spaces.length == 1) {
                        label_content = ('<br><a href="' + task_list[i][0] + '" target = "_blank">' + task_list[i][0] + "</a>");
                    } else {
                        to_add_to_list =
                            '<br><label id="task' + task_counter + '"><input type="checkbox" class="task"></input><span>';
                        add_to_end = "</span></label>";
                        for (var j = 0; j < has_spaces.length; j++) {
                            if (has_spaces[j].includes("http") || has_spaces[j].includes("https") || has_spaces[j].includes("www")) {
                                to_add_to_list += '<a href="' + has_spaces[j] + '" target = "_blank">' +
                                    has_spaces[j] + "</a>";
                            } else {
                                to_add_to_list += has_spaces[j] + " ";
                            }
                        }
                        label_content = to_add_to_list + add_to_end;
                    }
                }
                //if it's not a link
                else {
                    label_content =
                        '<br><label id="task' + task_counter
                        + '"><input type="checkbox" class="task" id="checkbox'
                        + task_counter + '"></input><span>'
                        + task_list[i][0] +
                        '</span><input type = "button" class="remove" value ="x"></input></label>';
                }
                document.getElementById(task_list[i][2]).nextElementSibling.innerHTML += label_content;

                // check task
                if (task_list[i][1]) {
                    $("#checkbox" + task_counter).attr("checked", true);
                }
                task_counter++;
            }
            // add listener for click
            $(".task").click(function () {
                port.postMessage({ action: "Update tasks", task: this.nextElementSibling.textContent, checked: this.checked, section: this.parentElement.parentElement.previousElementSibling.id });
            })
            // add input boxes
            add_todo_input();
            //allow the calendar to return a to-do of the days the class meets
            meet_setup();

            // listener for removing items
            $(".remove").click(function () {
                var to_be_removed = $(this).parentsUntil('div');
                console.log(to_be_removed[0].parentElement.previousElementSibling.id);
                port.postMessage({ action: "Remove task", task: to_be_removed[0].textContent, section: to_be_removed[0].parentElement.previousElementSibling.id });
                $(to_be_removed[0]).prev().remove();
                for (var i = 0; i < to_be_removed.length; i++) {
                    to_be_removed[i].remove();
                }
            });

            // find out if timer is running
            chrome.runtime.sendMessage({ get: "timer" }, function (response) {
                timeLeft = response.timeLeft;
                pomodoro_work = response.pomodoro_work;
                port.postMessage( { action: "Get times", signature: "getting times" } );
                port.onMessage.addListener(function(msg) {
                    if (msg.signature === "getting times") {
                        workTime = msg.work_time * 60;
                        breakTime = msg.break_time * 60;
                        document.getElementById("work-period").value = workTime / 60;
                        document.getElementById("break-period").value = breakTime / 60;
                    }
                })

                if (timeLeft < 0) {
                    update(
                        pomodoro_work ? workTime : breakTime,
                        pomodoro_work ? workTime : breakTime
                    ); //refreshes progress bar
                    displayTimeLeft(pomodoro_work ? workTime : breakTime);
                }
                else {
                    update(timeLeft, pomodoro_work ? workTime : breakTime);
                    displayTimeLeft(timeLeft);
                    if (response.timer_running) {
                        isStarted = true;
                        isPaused = false;
                        document.getElementById('pause').classList.remove("play");
                        document.getElementById('pause').classList.add("pause");
                        port.postMessage({ signature: "Timer", action: "Stop Timer" })
                        timer(timeLeft);
                    } else {
                        isStarted = true;
                        isPaused = true;
                    }
                }
            });
        }
    });

    // New class list selection for user
    // port.postMessage({ action: "Get classes", signature: "class_init" });
    // port.onMessage.addListener(function (msg) {
    //     if (msg.signature === "class_init") {
    //         classes = msg.classes;
    //         for (var i = 0; i < classes.length; i++) {
    //             console.log(i);
    //             $('#new-class').append('<h5 class="class-header"><span>+ </span>' + 
    //             classes[i] + '</h5><div class="task-section lead"><label for="days">Choose class days:</label><br>' +
    //                 '<select name="days" class="days"><option value="Monday">Monday</option>' +
    //                 '<option value="Tuesday">Tuesday</option><option value="Wednesday">Wednesday</option>' +
    //                 '<option value="Thursday">Thursday</option><option value="Friday">Friday</option>' +
    //                 '<option value="Saturday">Saturday</option><option value="Sunday">Sunday</option></select>' +
    //                 '<select name="time" class="time"><option value="9">9:00</option>' +
    //                 '<option value="10">10:00</option><option value="11">11:00</option>' +
    //                 '<option value="12">12:00</option><option value="1">1:00</option>' +
    //                 '<option value="2">2:00</option><option value="3">3:00</option></select>' +
    //                 '<br><input type="submit" value="Submit" class="submit"><br><br><div>');
    //         }
    //     }
    // });
    
    // reload all existing links, if any
    port.postMessage({ action: "Get links", signature: "pop_init_links" });
    port.onMessage.addListener(function (msg) {
        if (msg.signature === "pop_init_links") {
            var link_list = msg.links;
            console.log(link_list);
            for (var i = link_list.length - 1; i >= 0; i--) {
                // add list of links
                var link_content = "";
                link_content = ('<br><a href="' + link_list[i] + '" id="' + link_list[i] + '" target = "_blank">' + link_list[i] + "</a>");
                $('#link-list').append(link_content);
                link_counter++;
            }
        };
    });
    
    getTheme();
}

var remove_class;

// basic function that runs at the load-in stage
$(document).ready(function () {
    pop_init();


    let tasks = document.getElementsByClassName("task");
    let sections = document.getElementsByClassName("section-header");

    let classes = document.getElementsByClassName("classes");
    let classSections = document.getElementsByClassName("class-header");

    for (var i = 0; i < sections.length; i++) {
        section_setup(sections[i]);
    }

    for (var i = 0; i < classSections.length; i++) {
        section_setup(classSections[i]);
    }

    // tasks
    $(".new-section").focus(function () {
        $(this).keypress(function (event) {
            if (event.which == 13) {
                var content = $(this).val();
                if (content != "") {
                    $("#task-list").prepend(
                        '<h5 class="section-header"><span>+ </span>' +
                        content +
                        '</h5><div class="task-section lead"></div>'
                    );
                    $(this).val("");
                    section_setup(document.getElementsByClassName("section-header")[0]);
                    add_todo_input();
                }
            }
        });
    });

    // classes
    $(".new-class").focus(function () {
        $(this).keypress(function (event) {
            if (event.which == 13) {
                var content = $(this).val();
                if (content != "") {
                    $("#class-list").prepend(
                        '<h5 class="class-header" id="' + content + 
                        '"><span>+ </span>' + content +
                        '</h5><div class="task-section lead"></div>'
                    );
                    $("#task-list").prepend(
                        '<h5 class="section-header"><span>+ </span>' +
                        content +
                        '</h5><div class="task-section lead"></div>'
                    );
                    $(this).val("");
                    section_setup(document.getElementsByClassName("class-header")[0]);
                    meet_setup();
                    section_setup(document.getElementsByClassName("section-header")[0]);
                    add_todo_input();
                }
            }
        });
    });
    add_todo_input();


    // Listener for timer
    port.onMessage.addListener(function (msg) {
        if (msg.signature === "Timer") {
            timeLeft = msg.timeLeft;
            timer_zero = (msg.finished);
            displayTimeLeft(timeLeft);
            if (timer_zero) {
                // move to other part of the pomodoro
                pomodoro_work = !pomodoro_work;
                displayTimeLeft(pomodoro_work ? workTime : breakTime);
                port.postMessage({ signature: "Timer", action: "Stop Timer" });
                alert(get_message(pomodoro_work));
                timer(pomodoro_work ? workTime : breakTime);
                return;
            }
        }

        if (msg.signature === "End Timer") {


        }
    });

    // pause button
    pauseBtn.addEventListener("click", pauseTimer);
    workInput.addEventListener("change", function timerReset() {
        if (document.getElementById("work-period").value < 0) {
            alert("Timer value must be greater than or equal to zero!");
            workTime = 0;
            document.getElementById("work-period").value = 0;
        } else {
            workTime = document.getElementById("work-period").value * 60;
            document.getElementById("work-period").value = workTime / 60;
            port.postMessage({ action: "Update times", break_time: breakTime / 60, work_time: workTime / 60 });
        }
        if (pomodoro_work) {
            timeLeft = timeLeft < workTime ? timeLeft : workTime;
            displayTimeLeft(timeLeft);
            update(timeLeft, workTime);
        }
    });

    // break timer input
    breakInput.addEventListener("change", function timerReset() {
        if (document.getElementById("break-period").value < 0) {
            alert("Timer value must be greater than or equal to zero!");
            breakTime = 0;
            document.getElementById("break-period").value = 0;
        } else {
            breakTime = document.getElementById("break-period").value * 60;
            document.getElementById("break-period").value = breakTime / 60;
            port.postMessage({ action: "Update times", break_time: breakTime / 60, work_time: workTime / 60 });
        }
        if (!pomodoro_work) {
            timeLeft = timeLeft < breakTime ? timeLeft : breakTime;
            displayTimeLeft(timeLeft);
            update(breakTime, breakTime);
        }
    });
});
