chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.sync.set({ color: '#3aa757' }, function () {
        console.log('The color is green.');
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({})],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

});

chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.log(token);
});

chrome.identity.getProfileUserInfo(function (info) {
  email = info.email;
  id = info.id;
  console.log(email);
  console.log(id);
});

chrome.runtime.onInstalled.addListener(function (request) {
  console.log("Getting message");
  var settings = {
    url: "https://us-central1-aiot-fit-xlab.cloudfunctions.net/gettasksbyuser",
    type: "POST",
    //timeout: 0,
    success: function(data) {
        console.log(data);
    },
    error: (err) => {
        console.log(err.responseJSON);
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    data: {"uid": "1"},
    dataType: 'json',
    contentType: "application/json"
  };

  $.ajax(settings);
  /*$.ajax({
    url: 'https://en.wikipedia.org/w/api.php?' +
         'action=opensearch&format=json&maxlag=5&search=' + encodeURIComponent("cuba"),
    success(data) {
        console.log(data);
    },
  });*/
});