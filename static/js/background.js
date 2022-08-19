chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
    fetch('https://detooned-s3.s3.us-west-1.amazonaws.com/detooned.json?ts=' + Date.now())
    .then(result => result.json())
    .then(output => sendResponse(output)) 
    return true;
});