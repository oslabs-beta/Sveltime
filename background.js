console.log('this is the background script');

// chrome.runtime.onMessage.addListener((msg, sender, response)=> {
//   if (msg) {
//     console.log('i received msg: ', msg);
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      
//       chrome.tabs.sendMessage(tabs[0].id, { header: msg }, () => {});
//     });
//   }
//   return true;
// });




chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg) {
    console.log('msg received in background.js', msg);
    chrome.runtime.onConnect.addListener(port => {
      if (port.name === 'svelte-background-connection') {
        port.onMessage.addListener((message) => {
          console.log('msg received in background.js from App.svelte : ', message);
        });
        port.postMessage(msg);
      }
    });
  }
  // chrome.runtime.sendMessage(msg);
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {});
    //   });
});

// chrome.runtime.onMessage.addListener((msg, sender, response)=> {
//   if(msg === 'app component mounted'){
//     console.log(` background.js message ${msg} recieved from sender ${sender}`);
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {});
//       });
//   }
//   return true;
// });

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name === "knockknock");
//   port.onMessage.addListener(function(msg) {
//     console.log('msg: ', msg);
//     if (msg.joke === "Knock knock")
//       port.postMessage({question: "Who's there?"});
//     else if (msg.answer === "Madame")
//       port.postMessage({question: "Madame who?"});
//     else if (msg.answer === "Madame... Bovary")
//       port.postMessage({question: "I don't get it."});
//   });
// });
