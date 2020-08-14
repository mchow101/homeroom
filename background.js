// tasks
var tasks = [];

// links
var links = [];

// classes
var classes = [];

// pomdoro
var intervalTimer;
var localTimeLeft = -1;
var pomodoro_work = true;
var timerRunning = false;
var break_time = 5;
var work_time = 25;

chrome.runtime.onInstalled.addListener(function () {
  
  // Automatically set to light mode upon installation
  chrome.storage.sync.set({mainbgcolor: '#F2F2F2', elementcolor:'#ffffff', textcolor: '#404040', sliderlight: '#A7ACC6', sliderdark: '#4E598C', radiofill: '#f7a191', timermain: '#4E598C'}, function() {
    console.log('Value is set for light mode');
  });

  // set chrome.declarativeContent net rules
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

// OAuth implementation for google calendar
chrome.identity.getAuthToken({ interactive: true }, function (token) {
  //console.log(token);
});

// Basic Google Account Data Extraction
chrome.identity.getProfileUserInfo(function (info) {
  email = info.email;
  id = info.id;
  // console.log(email);
  // console.log(id);
});


// Sets timer to run in the background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.get == "timer" && !sender.tab) sendResponse({ timeLeft: localTimeLeft, pomodoro_work: pomodoro_work, timer_running: timerRunning });
});

// Message handler
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    // Update tasks
    if (msg.action == "Update tasks") {
      var in_list = false;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].includes(msg.task) && tasks[i].includes(msg.section)) {
          tasks[i] = [msg.task, msg.checked, msg.section];
          in_list = true;
        }
      }
      if (!in_list)
        tasks = tasks.concat([[msg.task, msg.checked, msg.section]]);
    }

    // Get tasks
    else if (msg.action == "Get tasks") {
      port.postMessage({ tasks: tasks, signature: msg.signature });
    }

    // Remove tasks
    else if (msg.action == "Remove task") {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].includes(msg.task) && tasks[i].includes(msg.section))
          tasks.pop(i);
      }
    }

    // Update Timer Data
    else if (msg.action == "Timer" || msg.action == "Stop Timer") {
      if (msg.seconds == null || msg.timeLeft < 0 || msg.action == "Stop Timer") {
        clearInterval(intervalTimer);
        try { port.postMessage({ signature: "End Timer", timeLeft: timeLeft }); }
        catch { console.log("TRYING TO STOP")}
      } else {
        let remainTime = Date.now() + msg.seconds * 1000;
        chrome.tabs.getCurrent(function() { console.log(this) });
        intervalTimer = setInterval(function () {
          timeLeft = Math.round((remainTime - Date.now()) / 1000);
          try { port.postMessage({ signature: "Timer", timeLeft: timeLeft, finished: timeLeft < 0 }); }
          catch { console.log(timeLeft)}
        }, 1000);
      }
    }

    // Get links
    else if (msg.action == "Get links") {
      port.postMessage({ links: links, signature: msg.signature });
    }

    // Update links
    else if (msg.action == "Update links") {
      var in_list = false;
      for (var i = 0; i < links.length; i++) {
        if (links[i].includes(msg.link)) {
          links[i] = [msg.link];
          in_list = true;
        }
      }
      if (!in_list)
        links = links.concat([[msg.link]]);
    }
  });
});

// MongoDB Connection Request Draft
/*chrome.runtime.onInstalled.addListener(function (request) {
  console.log("Getting message");
  var settings = {
    url: "https://us-central1-aiot-fit-xlab.cloudfunctions.net/gettasksbyuser",
    type: "POST",
    //timeout: 0,
    success: function (data) {
      console.log(data);
    },
    error: (err) => {
      console.log(err.responseJSON);
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify({ uid: "1" }),
    dataType: "json",
  };

  $.ajax(settings);
});*/