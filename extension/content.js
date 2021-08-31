let inMeeting = false;
let startTime = null;
let title, lobby;
let lastInMeeting = inMeeting,
  lastLobby = lobby,
  lastTitle = title;
const urlRegex = /[a-z]{3}-[a-z]{4}-[a-z]{3}/.compile();
const webSocket = new WebSocket("ws://127.0.0.1:6970");

const sendData = () => {
  if (webSocket.readyState !== WebSocket.CLOSED) {
    if (webSocket.readyState === WebSocket.OPEN) {
      if (inMeeting) {
        let presenceObject = {
          details: title,
          state: lobby ? options.waitingRoomText : options.inCallText,
          largeImageKey: "meet",
          largeImageText: "Google Meet",
        };
        if (startTime) {
          presenceObject.startTimestamp = startTime;
        }
        webSocket.send(JSON.stringify(presenceObject));
      } else {
        webSocket.send(JSON.stringify({}));
      }
    } else setTimeout(sendData, 500);
  }
};

let extensionId = "agnaejlkbiiggajjmnpmeheigkflbnoo"; //Chrome
if (typeof browser !== "undefined" && typeof chrome !== "undefined") {
  extensionId = "{57081fef-67b4-482f-bcb0-69296e63ec4f}"; //Firefox
}

let options = {
  nameUnknownText: "Unknown meeting title",
  waitingRoomText: "In waiting room",
  inCallText: "In call",
};

chrome.storage.onChanged.addListener((changes, area) => {
  if (changes.inCallText) {
    options.inCallText = changes.inCallText.newValue;
  }
  if (changes.nameUnknownText) {
    options.nameUnknownText = changes.nameUnknownText.newValue;
  }
  if (changes.waitingRoomText) {
    options.waitingRoomText = changes.waitingRoomText.newValue;
  }
});

chrome.storage.sync.get(options, (result) => {
  // Update fields as neccessary
  options = result;
});

const presenceUpdate = () => {
  // If inside meeting or waiting room
  if (document.querySelector(".Jyj1Td") || document.querySelector(".CkXZgc")) {
    // Get meeting title
    title = (
      document.querySelector(".Jyj1Td") || document.querySelector(".CkXZgc")
    ).innerHTML;
    if (
      title == "Ready to join?" ||
      title == "Meeting details" ||
      window.location.href.indexOf(title) + 1
    )
      title = options.nameUnknownText;
    lobby =
      document.querySelector(".VfPpkd-rXoKne-JIbuQc") ||
      document.querySelector(".tFj9ee")
        ? true
        : false;
    // If start time isn't set and in meeting, set it to now
    if (!lobby && startTime == null) startTime = new Date();
    // Erase start time if not in meeing
    else if (lobby) startTime = null;
    inMeeting = true;
  }
  // Possible breaking change introduced
  else {
    inMeeting = false;
    startTime = null;
  }
  // Force update when meeting state changed or title is fetched
  if (lastInMeeting != inMeeting || lastLobby != lobby || lastTitle != title) {
    // Register Presence
    chrome.runtime.sendMessage(
      extensionId,
      { mode: "passive" },
      function (response) {}
    );
    lastInMeeting = inMeeting;
    lastLobby = lobby;
    lastTitle = title;
    sendData();
  }
};

//Check if URL is of a meeting
if (urlRegex.exec(new URL(window.location).pathname)) {
  setInterval(presenceUpdate, 1000);
}
// Wait for presence Requests
chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
  sendResponse(getPresence());
});

function getPresence() {
  return {
    inMeeting: inMeeting,
    title: title,
    state: lobby ? options.waitingRoomText : options.inCallText,
    startTime: startTime ? startTime.getTime() : null,
  };
}
