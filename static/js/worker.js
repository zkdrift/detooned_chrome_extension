claimed_toons = [];
detonated_toons = [];
mutated_toons = [];
toons = [];

needs_update = false;



function updateToons() {  
  if (needs_update && claimed_toons.length > 0) {
      // update search listings
      matches = document.querySelectorAll(".AssetsSearchView--assets > div > div > div > div > div > article > a > div:nth-child(2) > div:nth-child(1) > div > div")
      matches.forEach(function(el) {
          if (el.innerHTML) {
            els = el.innerHTML.split('TOONZ #');
            if (els.length > 1) {
              els = els[1].split(' (');
              token_id = els[0];        

              if (claimed_toons.includes(parseInt(token_id))) {
                if (!el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('claimed-toon')) {
                  el.innerHTML = 'TOONZ #' + parseInt(token_id) + ' (Claimed)';
                  var claimed_img = document.createElement("img");
                  claimed_img.classList.add('claimed-toon');
                  claimed_img.src = chrome.runtime.getURL("/static/images/claimed.png");                    
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('claimed-toon');
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(claimed_img);
                }
              } else {
                if (!el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('unclaimed-toon')) {
                  el.innerHTML = 'TOONZ #' + parseInt(token_id) + ' (Unclaimed)';
                  var unclaimed_img = document.createElement("img");
                  unclaimed_img.classList.add('unclaimed-toon');
                  unclaimed_img.src = chrome.runtime.getURL("/static/images/unclaimed.png");                
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('unclaimed-toon');
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(unclaimed_img);
                }
              }

              if (detonated_toons.includes(parseInt(token_id))) {
                if (!el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('detonated-toon')) {
                  var detonated_link = document.createElement("a");
                  toons.forEach(function(toon){
                    if (toon.token_id == token_id) {
                      detonated_token_id = toon.detonated_token_id;
                      detonated_link_string = "https://opensea.io/assets/ethereum/0x479e2cfa68c4a30eb37404044e195858a1d2eddc/" + detonated_token_id;
                    }
                  });

                  detonated_link.setAttribute('href', detonated_link_string);       
                  var detonated_img = document.createElement("img");
                  detonated_img.classList.add('detonated-toon');
                  detonated_img.src = chrome.runtime.getURL("/static/images/detonated.png");                    
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('detonated-toon');
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(detonated_link);
                  detonated_link.appendChild(detonated_img);
                }
              } else {
                if (!el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('undetonated-toon')) {
                  var undetonated_img = document.createElement("img");
                  undetonated_img.classList.add('undetonated-toon');
                  undetonated_img.src = chrome.runtime.getURL("/static/images/undetonated.png");                    
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('undetonated-toon');
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(undetonated_img);                
                }
              }


              if (mutated_toons.includes(parseInt(token_id))) {
                if (!el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('mutated-toon')) {
                  var mutated_link = document.createElement("a");
                  toons.forEach(function(toon){
                    if (toon.token_id == token_id) {
                      mutated_token_id = toon.mutated_token_id;
                      mutated_link_string = "https://opensea.io/assets/ethereum/0x479e2cfa68c4a30eb37404044e195858a1d2eddc/" + mutated_token_id;
                    }
                  });

                  mutated_link.setAttribute('href', mutated_link_string);                  

                  var mutated_img = document.createElement("img");
                  mutated_img.classList.add('mutated-toon');
                  mutated_img.src = chrome.runtime.getURL("/static/images/mutated.png");                    
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('mutated-toon');
                  el.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(mutated_link);
                  mutated_link.appendChild(mutated_img);

                }
                } else {
                  if (!el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('unmutated-toon')) {                  
                    var unmutated_img = document.createElement("img");
                    unmutated_img.classList.add('unmutated-toon');
                    unmutated_img.src = chrome.runtime.getURL("/static/images/unmutated.png");                    
                    el.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('unmutated-toon');
                    el.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(unmutated_img);
                  }
                }
              }                
          }
      });

      // update individual item pages
      appended_title = [];
      links = [];
      detonated_token_id = 0;
      mutated_token_id = 0;
      is_item_page = 0;
      if (document.querySelector(".CollectionLink--link") && document.querySelector(".CollectionLink--link").href == 'https://opensea.io/collection/degentoonz-collection') {
        is_item_page = document.location.href.split("0x19b86299c21505cdf59ce63740b240a9c822b5e4/");
        if (is_item_page.length > 1) {
          token_id = is_item_page[1];
          matches = document.querySelectorAll(".item--title");
          matches.forEach(function(el) {              
              if (claimed_toons.includes(parseInt(token_id))) {
                appended_title.unshift("Claimed");
              } else {
                appended_title.unshift("Unclaimed");
              }
              if (mutated_toons.includes(parseInt(token_id))) {
                toons.forEach(function(toon){
                  if (toon.token_id == token_id) {
                    mutated_token_id = toon.mutated_token_id;
                    mutated_link = "https://opensea.io/assets/ethereum/0x479e2cfa68c4a30eb37404044e195858a1d2eddc/" + mutated_token_id;
                    link = document.createElement('a');
                    link.setAttribute('href', mutated_link);
                    link.classList.add('disposable-link');                    
                    link.innerHTML = 'View Mutated Toon';
  
                    links.unshift(link);
                      
                  }
                });
                appended_title.unshift("Mutated @ #" + mutated_token_id);
              } else {
                //appended_title.unshift("");
              }
              
              if (detonated_toons.includes(parseInt(token_id))) {
                toons.forEach(function(toon){
                  if (toon.token_id == token_id) {
                    detonated_token_id = toon.detonated_token_id;
                    detonated_link = "https://opensea.io/assets/ethereum/0x479e2cfa68c4a30eb37404044e195858a1d2eddc/" + detonated_token_id;
                    link = document.createElement('a');
                    link.setAttribute('href', detonated_link);
                    link.classList.add('disposable-link');
                    link.innerHTML = 'View Detonated Toon';
  
                    links.unshift(link);
                  }
                });
                appended_title.unshift("Detonated @ #" + detonated_token_id);
  
              } else {
                //appended_title.unshift("Unclaimed");
              }            
              el.innerHTML = "TOONZ #" + token_id + "(" + appended_title.join() + ")";
              document.querySelectorAll('.disposable-link').forEach(function(link){
                link.remove();
              });
              links.forEach(function(link){
                el.after(link)
              });            
          });            
        }
      }
    }
    needs_update = false;
    setTimeout(updateToons, 500);
}

// a bit hacky, couldnt figure out how to get it to just monitor for the right changes so had to revert to a timer :(
function setupObserver() {
  observer = new MutationObserver((mutations) => { 
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
}
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});
 
 
function onUrlChange() {
  setTimeout(syncChain, 500);
}

function syncChain() {
  setupObserver();
  if (chrome.runtime?.id) { // make sure in context of window still and not unloaded
      chrome.runtime.sendMessage({function: "updateToons"}, function(response) { // send a message to the background service to re-fetch data of claimed toons

        claimed_toons = [];
        detonated_toons = [];
        mutated_toons = [];
        toons = [];
        response.forEach(function(v){
          if (v.mutated) {
            mutated_toons.unshift(v.token_id);
          }
          if (v.dynamite_claimed) {
            claimed_toons.unshift(v.token_id);
          }
          if (v.detonated) {
            detonated_toons.unshift(v.token_id);
          }

          toons.unshift({token_id: v.token_id, mutated_token_id: v.mutated_token_id, detonated_token_id: v.detonated_token_id});
        });

        needs_update = true;
        updateToons(); // update the page to show
    });
  }
  setTimeout(syncChain, 120000); // run this again in a few minutes
}

syncChain();
