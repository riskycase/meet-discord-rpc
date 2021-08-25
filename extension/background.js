chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if(request.action == "presence") {
      chrome.tabs.sendMessage(request.tab, request.info, function(data) {
      let response = {};
      if(data.inMeeting){
        response.clientId = '848220803925671966';
        response.presence = {};
        response.presence.details = data.title;
        response.presence.state = data.state;
        response.presence.largeImageKey = 'meet_logo';
        if(!data.lobby && data.startTime)
          response.presence.startTimestamp = data.startTime
      }
      sendResponse(response);
    });
    return true;
  }
});