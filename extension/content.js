let inMeeting = false
let startTime = null
let title, lobby
let lastInMeeting = inMeeting, lastLobby = lobby, lastTitle = title
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
            if( title == 'Ready to join?' || title == 'Meeting details' || window.location.href.indexOf(title)+1 )
                title = null
            lobby = document.querySelector('.VfPpkd-rXoKne-JIbuQc') || document.querySelector('.tFj9ee') ? true : false
            // If start time isn't set and in meeting, set it to now
            if(!lobby && startTime == null)
                startTime = new Date()
            // Erase start time if not in meeing
            else if(lobby)
                startTime = null
            inMeeting = true
        }
        // Possible breaking change introduced
        else{
            inMeeting = false;
            startTime = null;
        }
    }
    else{
        inMeeting = false;
        startTime = null;
    }
    // Force update when meeting state changed or title is fetched
    if(lastInMeeting != inMeeting || lastLobby != lobby || lastTitle != title){
        // Register Presence
        chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function(response) {
        });
        lastInMeeting = inMeeting
        lastLobby = lobby
        lastTitle = title
    }
}

setInterval(test, 1000);

// Wait for presence Requests
chrome.runtime.onMessage.addListener(function(info, sender, sendResponse) {
    sendResponse(getPresence());
});

function getPresence() {
    return {
        inMeeting: inMeeting,
        title: title,
        lobby: lobby,
        startTime: startTime ? startTime.getTime() : null
    }
}

