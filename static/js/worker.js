toons = [];
needs_update = false;

function updateToons() {  
  if (needs_update && toons.length > 0) {
      matches = document.querySelectorAll(".AssetsSearchView--assets > div > div > div > div > div > article > a > div:nth-child(2) > div:nth-child(1) > div > div")
      matches.forEach(function(el) {
          if (el.innerHTML) {
            els = el.innerHTML.split('TOONZ #');
            els = els[1].split(' (Claimed)');
            token_id = els[0];        
            
            if (toons.includes(parseInt(token_id))) {
                el.innerHTML = 'TOONZ #' + parseInt(token_id) + ' (Claimed)';
                el.classList.add('claimed-toon');
            } else {
              el.classList.add('unclaimed-toon');
            }
          }
      });

      //item--title
      matches = document.querySelectorAll(".item--title");
      matches.forEach(function(el) {
          els = el.innerHTML.split('TOONZ #');
          els = els[1].split(' (Claimed)');
          token_id = els[0];        
          
          if (toons.includes(parseInt(token_id))) {
              el.innerHTML = 'TOONZ #' + parseInt(token_id) + ' (Claimed)';
              el.classList.add('claimed-toon');
          } else {
            el.classList.add('unclaimed-toon');
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

if (document.querySelector("[role=grid]") != null) {
  observer.observe(document.querySelector("[role=grid]"), { 
    attributes: true, 
    subtree: true,
    childList: true
  });
}

function syncChain() {
    chrome.runtime.sendMessage({function: "updateToons"}, function(response) { 
      toons = [];      
      response.forEach(function(v) {
          toons.unshift(v.token_id);
      });
      
      needs_update = true;
      updateToons();
  });
  setTimeout(syncChain, 120000);
}

syncChain();
