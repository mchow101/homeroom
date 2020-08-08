let tasks = document.getElementsByClassName('task');

for (var i = 0; i < tasks.length; i++) {
    tasks[i].addEventListener("click", function (result) {
        console.log(result.target.checked);
        chrome.storage.sync.set({ i : result.target.checked }, function () {
            console.log(i + result.target.checked + " Storage");
        });
    });
    chrome.storage.sync.get([i], function (result) {
        console.log('Value currently is ' + result);
    });
}