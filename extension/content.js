let inMeeting = false
let startTime = null
let title, lobby
let lastInMeeting = inMeeting, lastLobby = lobby
const urlRegex = /[a-z]{3}-[a-z]{4}-[a-z]{3}/.compile()
 
let extensionId = "agnaejlkbiiggajjmnpmeheigkflbnoo"; //Chrome
if(typeof browser !== 'undefined' && typeof chrome !== "undefined"){
  extensionId = "{57081fef-67b4-482f-bcb0-69296e63ec4f}"; //Firefox
}

const test = () => {

    const url = new URL(window.location);

    //Check if URL is of a meeting
    if(urlRegex.exec(url.pathname)){

        // If inside meeting or waiting room
        if(document.querySelector('.Jyj1Td') || document.querySelector('.CkXZgc')){

            // Get meeting title
            title = (document.querySelector('.Jyj1Td') || document.querySelector('.CkXZgc')).innerHTML
            lobby = document.querySelector('.VfPpkd-rXoKne-JIbuQc') ? true : false
            // If start time isn't set and in meeting, set it to now
            if(!lobby && startTime == null)
                startTime = new Date()
            // Erase start time if not in meeing
            else if(lobby)
                startTime = null
            inMeeting = true
        }
        else{
            inMeeting = false;
            startTime = null;
        }
        if(lastInMeeting != inMeeting || lastLobby != lobby){
            // Register Presence
            chrome.runtime.sendMessage(extensionId, {mode: 'active'}, function(response) {
            });
            lastInMeeting = inMeeting
            lastLobby = lobby
        }
    }
}

setInterval(test, 1000);

// Wait for presence Requests
chrome.runtime.onMessage.addListener(function(info, sender, sendResponse) {
    sendResponse(getPresence());
});

function getPresence() {
    let response = {}
    if(inMeeting) {
        response = {
            clientId: '848220803925671966',
            presence: {
              details: (title == 'Ready to join?' || title == 'Meeting details') ? 'Unknown meeting title' : title,
              state: lobby ? 'In waiting room' : 'In call',
              largeImageKey: 'meet_logo',
              instance: true,
            }
          };
        if(!lobby)
        response.presence.startTimestamp = (startTime.getTime() - startTime.getMilliseconds())/1000
    }
    return response;
}

