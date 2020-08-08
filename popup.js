
$(document).ready(function () {

    //$(".widget input[type=submit]").button(); //not currently using
    $('.todo-adder').click(function () {
        /*makes a new todo. i want to do this without append-mit seems sloppy to me
        or like there is a more efficient way to do this) but i'm too lazy rn. eventually...
        in the future i will want to exchange the general id for the id
        of the category that the user is in 
        */
        //if $('#task-to-do'.val()){
        var new_task = '#task-to-do'.val();

        $('#general').append("<dd><input class = 'task' type = 'checkbox'/>" + new_task + "</input></dd>");


    });


    /* currently not being used
    $('.minus').click(function(){
      //deletes EVERYTHING. :D
      var k = alert("Are you sure you want to clear your todo list?");
      //^checks to make sure you are okay, though idk if u really have a choice.
      if($('.task').has('.chk')){
        if($('.chk').is(":checked")){
          //makes sure you've at least done something before they all go bye-bye. without being saved. :D
           $('.td_item').remove();
        } else{
          //lets you know that you've been slacking. how polite
          var niceTry = alert("You don't seem to have done anything on your list.");
        }
      }
     
      
      
      
    });*/


});

let tasks = document.getElementsByClassName('task');
let sections = document.getElementsByClassName('section-header');
let addToDos - document.getElementsByClassName('todo-adder')
for (var i = 0; i < sections.length; i++) {
    sections[i].addEventListener("click", function () {
        var content = this.nextElementSibling;

        console.log("content: " + content.textContent);
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
      



  
      });
    });
}