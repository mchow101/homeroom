var pomodoro_work = true;
var port = chrome.runtime.connect({ name: "conn" });
var pom_port = chrome.runtime.connect({ name: "pomodoro" });
var num = 1;

// top slider to change tabs
var slider = document.getElementById("choose-tab");
var current = "1";
slider.addEventListener("change", function () {
  current = slider.value;
  changetab();
});

// change tabs
function changetab() {
  if (current.charAt(0) === "1") {
    console.log("Tasks tab");
    document.getElementById("tasks").style.display = "block";
    document.getElementById("classes").style.display = "none";
    document.getElementById("pomodoro").style.display = "none";
  } else if (current.charAt(0) === "2") {
    console.log("Classes");
    document.getElementById("tasks").style.display = "none";
    document.getElementById("classes").style.display = "block";
    document.getElementById("pomodoro").style.display = "none";
  } else {
    console.log("Pomodoro");
    document.getElementById("tasks").style.display = "none";
    document.getElementById("classes").style.display = "none";
    document.getElementById("pomodoro").style.display = "block";
    set_task_list();
  }
}

// adds a subsection with input box and collapsible header
function section_setup(section) {
  // possibly at some point add way to change placeholder to add a link/class meeting time/whatever if it's in class
  section.nextElementSibling.innerHTML =
    section.nextElementSibling.innerHTML +
    '<dd><input type="text" id="' +
    section.textContent.substring(2) +
    '" class="new-todo"  placeholder=" New todo item"></input></dd>';
  section.id = section.textContent.substring(2);
  section.addEventListener("click", function () {
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      this.textContent = this.textContent.replace("-", "+");
    } else {
      content.style.display = "block";
      this.textContent = this.textContent.replace("+", "-");
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
          //console.log(content);
          // if time: add more ors

          // if it's a valid link
          if (
            content.includes("http") ||
            content.includes("https") ||
            content.includes("www")
          ) {
            var has_spaces = $.trim(content).split(" ");
            if (has_spaces.length == 1) {
              console.log(this.id);
              $(this).before('<a href=">' + content + '">' + content + "</a>");
              $(this).val("");
            } else {
              console.log(this.id);
              to_add_to_list =
                '<label><input type="checkbox" class="task"></input><span>';
              add_to_end = "</span></label><br>";

              for (var i = 0; i < has_spaces.length; i++) {
                if (
                  has_spaces[i].includes("http") ||
                  has_spaces[i].includes("https") ||
                  has_spaces[i].includes("www")
                ) {
                  to_add_to_list +=
                    '<a href="' +
                    has_spaces[i] +
                    '">' +
                    has_spaces[i] +
                    " " +
                    "</a>"; //space in the back
                } else {
                  to_add_to_list += has_spaces[i] + " ";
                }
              }
              to_add_to_list = to_add_to_list + add_to_end;
              $(this).before(to_add_to_list);
              $(this).val("");
            }
          }
          //if it's not a link
          else {
            console.log(this.id);
            $(this).before(
              '<label><input type="checkbox" class="task"></input><span>' +
              content +
              '</span><input type = "button" class="remove" value ="x"></input></label><br>'
            );
            $(this).val("");
            port.postMessage({
              action: "Update tasks",
              task: content,
              checked: false,
              section: this.id,
            });
          }
        }
      }
    });
  });
}

// finds all unchecked items and adds them to pomodoro task list
function set_task_list() {
  var task_list = [];
  port.postMessage({ action: "Get tasks" });
  port.onMessage.addListener(function (msg) {
    task_list = msg.tasks;
    $("option").remove();
    for (var i = 0; i < task_list.length; i++) {
      console.log(task_list[i][1]);
      if (!task_list[i][1]) {
        $("#inputGroupSelect01").append(
          "<option>" + task_list[i][0] + "</option>"
        );
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

function get_days(submit) {
  submit.addEventListener("click", function () {
    console.log(this.values);
  });
}

subs = document.getElementsByClassName("submit");
for (var i = 0; i < subs.length; i++) {
  get_days(subs[i]);
}

//playing around with remove feature 
/*
function remove_item(event){
  console.log('x');
  var to_be_removed = $(this).parentsUntil('div');
  console.log(to_be_removed);
  for (var i = 0; i < to_be_removed.length; i++) {
    console.log(to_be_removed[i]);
    to_be_removed[i].remove();

  }
}

var remove_class = document.getElementsByClassName('remove');
remove_class.addEventListener("click", remove_item);
*/

// initialize the popup with saved data
function pop_init() {
  changetab();
  port.postMessage({ action: "Get tasks" });
  port.onMessage.addListener(function (msg) {
    task_list = msg.tasks;
    // task section headers
    sections_html = document.getElementsByClassName("section-header");
    sections = [];
    for (var s = 0; s < sections_html.length; s++)
      sections = sections.concat(sections_html[s].id);
    for (var i = 0; i < task_list.length; i++) {
      if (!sections.includes(task_list[i][2])) {
        $("#task-list").prepend(
          '<h5 class="section-header"><span>+ </span>' +
          task_list[i][2] +
          '</h5><div class="task-section lead"></div>'
        );
        section_setup(document.getElementsByClassName("section-header")[0]);
        add_todo_input();
        sections = sections.concat(
          document.getElementsByClassName("section-header")[0].id
        );
      }
    }
  });
}

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
            '<h5 class="class-header"><span>+ </span>' +
            content +
            '</h5><div class="task-section lead"></div>'
          );
          $("#task-list").prepend(
            '<h5 class="section-header"><span>+ </span>' +
            content +
            '</h5><div class="task-section lead"></div>'
          );
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
  let timeLeft;
  //let wholeTime = 25;

  let workTime = document.getElementById("work-period").value * 60; // manage this to set the whole time
  let breakTime = document.getElementById("break-period").value * 60;

  let isPaused = false;
  let isStarted = false;

  update(
    pomodoro_work ? workTime : breakTime,
    pomodoro_work ? workTime : breakTime
  ); //refreshes progress bar
  displayTimeLeft(pomodoro_work ? workTime : breakTime);

  function changeWholeTime(seconds) {
    if (pomodoro_work) {
      if (workTime + seconds > 0) {
        workTime += seconds;
        update(workTime, workTime);
      }
    } else {
      if (breakTime + seconds > 0) {
        breakTime += seconds;
        update(breakTime, breakTime);
      }
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

  function timer(seconds) {
    //counts time, takes seconds
    let remainTime = Date.now() + seconds * 1000;
    displayTimeLeft(seconds);

    intervalTimer = setInterval(function () {
      timeLeft = Math.round((remainTime - Date.now()) / 1000);
      if (timeLeft < 0) {
        clearInterval(intervalTimer);
        pomodoro_work = !pomodoro_work;
        displayTimeLeft(pomodoro_work ? workTime : breakTime);
        alert(get_message(pomodoro_work));
        timer(pomodoro_work ? workTime : breakTime);
        return;
        // pauseBtn.classList.remove('pause');
        // pauseBtn.classList.add('play');
      }
      displayTimeLeft(timeLeft);
    }, 1000);
  }

  function pauseTimer(event) {
    if (isStarted === false) {
      timer(pomodoro_work ? workTime : breakTime);
      isStarted = true;
      this.classList.remove("play");
      this.classList.add("pause");
      console.log(pomodoro_work ? "Work" : "Break");
      // setterBtns.forEach(function (btn) {
      //     btn.disabled = true;
      //     btn.style.opacity = 0.5;
      // });
    } else if (isPaused) {
      this.classList.remove("play");
      this.classList.add("pause");
      timer(timeLeft);
      isPaused = isPaused ? false : true;
    } else {
      this.classList.remove("pause");
      this.classList.add("play");
      clearInterval(intervalTimer);
      isPaused = isPaused ? false : true;
    }
  }

  function displayTimeLeft(timeLeft) {
    //displays time on the input
    console.log("Changing time...");
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displayString = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
      }${seconds}`;
    displayOutput.textContent = displayString;
    update(timeLeft, pomodoro_work ? workTime : breakTime);
  }

  // port.postMessage({ joke: "Knock knock" });
  // port.onMessage.addListener(function (msg) {
  //     console.log(msg.time);
  // });

  pauseBtn.addEventListener("click", pauseTimer);

  workInput.addEventListener("change", function timerReset() {
    //pauseTimer();
    if (document.getElementById("work-period").value < 0) {
      alert("Timer value must be greater than or equal to zero!");
      workTime = 0;
      document.getElementById("work-period").value = 0;
    } else {
      workTime = document.getElementById("work-period").value * 60;
      document.getElementById("work-period").value = workTime / 60;
    }
    if (pomodoro_work) {
      timeLeft = workTime;
      displayTimeLeft(workTime);
      update(workTime, workTime);
    }
  });

  breakInput.addEventListener("change", function timerReset() {
    //pauseTimer();
    if (document.getElementById("break-period").value < 0) {
      alert("Timer value must be greater than or equal to zero!");
      breakTime = 0;
      document.getElementById("break-period").value = 0;
    } else {
      breakTime = document.getElementById("break-period").value * 60;
      document.getElementById("break-period").value = breakTime / 60;
    }
    if (!pomodoro_work) {
      timeLeft = breakTime;
      displayTimeLeft(breakTime);
      update(breakTime, breakTime);
    }
  });
});

chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
  console.log(response.farewell);
});
