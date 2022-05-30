chrome.devtools.panels.create("Sveltime", null, "/public/index.html", null);

// chrome.runtime.onMessage.addListener((msg, sender, response)=> {
//   console.log(` devtools.js message ${msg} recieved from sender ${sender}`);
//   // msg = JSON.parse(msg);
//   if (Array.isArray(msg)) {
//     for (let i = 0; i < msg.length; i++) {
//       console.log(`msg[${i}]: `, msg[i]);
//     }
//   }
// });
// chrome.runtime.onMessage.addListener((msg, sender, response) => {
//   console.log('msg received in devtools.js', msg);
// });

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'svelte-devtools-connection') {
    port.onMessage.addListener((msg) => {
      let arrSvelteFiles;
      if (msg.name === 'start') {
        //console.log('msg received in devtools.js from App.svelete', msg);
        chrome.devtools.inspectedWindow.getResources((resources) => {
          // console.log('resources: ', resources);
          arrSvelteFiles = resources.filter((file) => !!file.url.match(/.svelte$/));
          //console.log('svelte files array: ', arrSvelteFiles);
          const newArr = [];
          function recursiveCreateNewArr(arrSvelteFiles, index = 0) {
            if (arrSvelteFiles[index] === undefined) {
              port.postMessage({ newArr });
              return;
            }
            arrSvelteFiles[index].getContent((source) => {
              newArr.push({
                url: arrSvelteFiles[index].url,
                type: arrSvelteFiles[index].type,
                source,
              });
              recursiveCreateNewArr(arrSvelteFiles, index + 1);
            });
          }
          recursiveCreateNewArr(arrSvelteFiles);
          //console.log('newArr: ', newArr);
        });
      }
    });
  }
// });
  // ==========



// chrome.runtime.onConnect.addListener((port) => {
//   console.assert(port.name === "svelte-devtools-connection");
//   port.onMessage.addListener((msg) => {
//     let arrSvelteFiles;
//     if (msg.name === "start") {
//       chrome.devtools.inspectedWindow.getResources((resources) => {
//         console.log("resources: ", resources);
//         arrSvelteFiles = resources.filter(
//           (file) => !!file.url.match(/.svelte$/)
//         );
//         console.log("svelte files array: ", arrSvelteFiles);
//         const newArr = [];
//         function recursiveCreateNewArr(arrSvelteFiles, index = 0) {
//           if (arrSvelteFiles[index] === undefined) {
//             port.postMessage({ newArr });
//             return;
//           }
//           arrSvelteFiles[index].getContent((source) => {
//             newArr.push({
//               url: arrSvelteFiles[index].url,
//               type: arrSvelteFiles[index].type,
//               source,
//             });
//             recursiveCreateNewArr(arrSvelteFiles, index + 1);
//           });
//         }
//         recursiveCreateNewArr(arrSvelteFiles);
//         console.log("newArr: ", newArr);
//       });
//     }
//   });
});
