let options = {
  nameUnknownText: 'Unknown meeting title',
  waitingRoomText: 'In waiting room',
  inCallText: 'In call',
};

chrome.storage.onChanged.addListener((changes, area) => {
    chrome.storage.sync.get(options, result => {
      // Update fields as neccessary
      options = result;
    })
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if(request.action == "presence") {
        chrome.tabs.sendMessage(request.tab, request.info, function(data){
        let response = {};
        console.log(data);
        if(data.inMeeting){
          response.clientId = '848220803925671966';
          response.presence = {};
          response.presence.details = data.title || options.nameUnknownText;
          response.presence.state = data.lobby ? options.waitingRoomText : options.inCallText;
          response.presence.largeImageKey = 'meet_logo';
          if(!data.lobby && data.startTime)
            response.presence.startTimestamp = data.startTime
        }
        sendResponse(response);
      });
      return true;
    }
  });