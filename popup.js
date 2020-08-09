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
});
