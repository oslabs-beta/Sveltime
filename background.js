console.log('this is the background script');

// chrome.runtime.onMessage.addListener((msg, sender, response)=> {
//   console.log(`message ${msg} recieved from sender ${sender}`);
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
