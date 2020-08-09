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


