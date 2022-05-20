let editorExtensionId = chrome.runtime.id;


const code = `let editorExtensionId = '${editorExtensionId}';

(function() {
console.log('This is the content script');
const componentArr = [];
window.document.addEventListener('SvelteRegisterComponent', (e) => {
  // console.log('svelteregisterComponent: e.detail.tagName ', e.detail.tagName);

  componentArr.push(e.detail.tagName);
  if (e.detail.id === 'create_fragment'){
    window.postMessage(componentArr);
  }
    
});
})()`;

document.documentElement.setAttribute('onreset', code);
document.documentElement.dispatchEvent(new CustomEvent('reset'));

// chrome.runtime.onMessage.addListener((msg, sender, response)=> {
//   console.log('msg recieved on content.js: ', msg);
//   // window.postMessage({header : "APP MOUNTED"});
  
//   return true;
// });

// chrome.runtime.onMessage.addListener((msg, sender, response)=> {
//   console.log('msg recieved on content.js: ', msg);
//   // window.postMessage({header : "APP MOUNTED"});
  
//   return true;
// });

window.addEventListener("message", function(event) {
  console.log('event.data: ', event.data);
  
  chrome.runtime.sendMessage(event.data);
});

// window.document.addEventListener('SvelteDOMInsert', e => {
//   console.log('svelteDOMinsert e: ', e);
// });
// window.document.addEventListener('SvelteDOMRemove', e => { console.log('svelteDOMRemove e: ', e); });
// window.document.addEventListener('SvelteDOMAddEventListener', e => {console.log('svelteDOMAddEventListener e :', e);});