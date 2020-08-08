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
//     $(".widget input[type=submit]").button();
//     $('#plus').click(function () {
//         /*makes a new todo. i want to do this without append-mit seems sloppy to me
//         or like there is a more efficient way to do this) but i'm too lazy rn. eventually...
//         in the future i will want to exchange the general id for the id
//         of the category that the user is in 
//         */
//         //if $('#task-to-do'.val()){
//         var new_task = '#task-to-do'.val();

//         $('#general').append("<dd><input class = 'task' type = 'checkbox'/>" + new_task + "</input></dd>");


    });


//     /* currently not being used
//     $('.minus').click(function(){
//       //deletes EVERYTHING. :D
//       var k = alert("Are you sure you want to clear your todo list?");
//       //^checks to make sure you are okay, though idk if u really have a choice.
//       if($('.task').has('.chk')){
//         if($('.chk').is(":checked")){
//           //makes sure you've at least done something before they all go bye-bye. without being saved. :D
//            $('.td_item').remove();
//         } else{
//           //lets you know that you've been slacking. how polite
//           var niceTry = alert("You don't seem to have done anything on your list.");
//         }
//       }
//     });*/
// });

let tasks = document.getElementsByClassName('task');
let sections = document.getElementsByClassName('section-header');
for (var i = 0; i < sections.length; i++) {
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