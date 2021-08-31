let checkboxMeetingTitle = document.getElementById("checkboxMeetingTitle");
let checkboxWaitingRoom = document.getElementById("checkboxWaitingRoom");
let checkboxInCall = document.getElementById("checkboxInCall");

let textMeetingTitle = document.getElementById("textMeetingTitle");
let textWaitingRoom = document.getElementById("textWaitingRoom");
let textInCall = document.getElementById("textInCall");

chrome.storage.sync.get(
  {
    nameUnknownText: null,
    waitingRoomText: null,
    inCallText: null,
  },
  (result) => {
    // Unknown meeting custom alt text intial setup
    if (result.nameUnknownText) {
      checkboxMeetingTitle.checked = true;
      textMeetingTitle.disabled = false;
      textMeetingTitle.value = result.nameUnknownText;
    } else {
      checkboxMeetingTitle.checked = false;
      textMeetingTitle.disabled = true;
      textMeetingTitle.value = "Unknown meeting title";
    }

    // Waiting room custom text initial setup
    if (result.waitingRoomText) {
      checkboxWaitingRoom.checked = true;
      textWaitingRoom.disabled = false;
      textWaitingRoom.value = result.waitingRoomText;
    } else {
      checkboxWaitingRoom.checked = false;
      textWaitingRoom.disabled = true;
      textWaitingRoom.value = "In waiting room";
    }

    // In call custom text initial setup
    if (result.inCallText) {
      checkboxInCall.checked = true;
      textInCall.disabled = false;
      textInCall.value = result.inCallText;
    } else {
      checkboxInCall.checked = false;
      textInCall.disabled = true;
      textInCall.value = "In call";
    }
  }
);

// Unknown meeting title custom alt text
checkboxMeetingTitle.addEventListener("change", () => {
  if (checkboxMeetingTitle.checked) {
    chrome.storage.sync.set({ nameUnknownText: "Unknown meeting title" });
  } else {
    chrome.storage.sync.remove("nameUnknownText");
    textMeetingTitle.value = "Unknown meeting title";
  }
  textMeetingTitle.disabled = !checkboxMeetingTitle.checked;
});

textMeetingTitle.addEventListener("change", () => {
  if (checkboxMeetingTitle.checked)
    chrome.storage.sync.set({ nameUnknownText: textMeetingTitle.value });
});

// Waiting room custom text
checkboxWaitingRoom.addEventListener("change", () => {
  if (checkboxWaitingRoom.checked) {
    chrome.storage.sync.set({ waitingRoomText: "In waiting room" });
  } else {
    chrome.storage.sync.remove("waitingRoomText");
    textWaitingRoom.value = "In waiting room";
  }
  textWaitingRoom.disabled = !checkboxWaitingRoom.checked;
});

textWaitingRoom.addEventListener("change", () => {
  if (checkboxWaitingRoom.checked)
    chrome.storage.sync.set({ waitingRoomText: textWaitingRoom.value });
});

// In call custom text
checkboxInCall.addEventListener("change", () => {
  if (checkboxInCall.checked) {
    chrome.storage.sync.set({ inCallText: "In call" });
  } else {
    chrome.storage.sync.remove("inCallText");
    textInCall.value = "In call";
  }
  textInCall.disabled = !checkboxInCall.checked;
});

textInCall.addEventListener("change", () => {
  if (checkboxInCall.checked)
    chrome.storage.sync.set({ inCallText: textInCall.value });
});
