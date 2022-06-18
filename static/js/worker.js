toons = [];
needs_update = false;



function updateToons() {  
  if (needs_update && toons.length > 0) {
      // update search listings
      matches = document.querySelectorAll(".AssetsSearchView--assets > div > div > div > div > div > article > a > div:nth-child(2) > div:nth-child(1) > div > div")
      matches.forEach(function(el) {
          if (el.innerHTML) {
            els = el.innerHTML.split('TOONZ #');
            els = els[1].split(' (');
            token_id = els[0];        
            if (true) {
              if (toons.includes(parseInt(token_id))) {
                if (el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('claimed-toon')) {
                  return true;
                }

                el.innerHTML = 'TOONZ #' + parseInt(token_id) + ' (Claimed)';
                var claimed_img = document.createElement("img");
                claimed_img.classList.add('claimed-toon');
                claimed_img.src = chrome.runtime.getURL("/static/images/claimed.png");
                
                el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('claimed-toon');
                el.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(claimed_img);
              } else {
                if (el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('unclaimed-toon')) {
                  return true;
                }
                el.innerHTML = 'TOONZ #' + parseInt(token_id) + ' (Unclaimed)';

                var unclaimed_img = document.createElement("img");
                unclaimed_img.classList.add('unclaimed-toon');
                unclaimed_img.src = chrome.runtime.getURL("/static/images/unclaimed.png");                
                el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('unclaimed-toon');
                el.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(unclaimed_img);
              }
            }
          }
      });

      // update individual item pages
      matches = document.querySelectorAll(".item--title");
      matches.forEach(function(el) {
          els = el.innerHTML.split('TOONZ #');
          els = els[1].split(' (');
          token_id = els[0];        
          
          if (toons.includes(parseInt(token_id))) {
              el.innerHTML = 'TOONZ #' + parseInt(token_id) + ' (Claimed)';
          } else {
            el.innerHTML = 'TOONZ #' + parseInt(token_id) + ' (Unclaimed)';
          }
      });
    }
    needs_update = false;
    setTimeout(updateToons, 500);
}

// a bit hacky, couldnt figure out how to get it to just monitor for the right changes so had to revert to a timer :(
const observer = new MutationObserver((mutations) => { 
    mutations.forEach((mutation) => {
      const el = mutation.target;
      needs_update = true;
    });
 });

if (document.querySelector("[role=grid]") != null) { // monitor the page for any changes
  observer.observe(document.querySelector("[role=grid]"), { 
    attributes: true, 
    subtree: true,
    childList: true
  });
}

function syncChain() {
  if (chrome.runtime?.id) { // make sure in context of window still and not unloaded
      chrome.runtime.sendMessage({function: "updateToons"}, function(response) { // send a message to the background service to re-fetch data of claimed toons
        toons = [];      
        response.forEach(function(v) {
            toons.unshift(v.token_id);
        });
        
        needs_update = true;
        updateToons(); // update the page to show
    });
  }
  setTimeout(syncChain, 120000); // run this again in a few minutes
}

syncChain();
