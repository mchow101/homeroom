let tasks = document.getElementsByClassName('task');

let sections = document.getElementsByClassName('section-header');
for (var i = 0; i < sections.length; i++) {
    sections[i].addEventListener("click", function () {
        var content = this.nextElementSibling;
        console.log("content: " + content.textContent);
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    })
}