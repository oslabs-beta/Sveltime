let editorExtensionId = chrome.runtime.id;


const code = `let editorExtensionId = '${editorExtensionId}';

(function() {
console.log('This is the content script');
let componentArr = [];
let componentFragmentArr = [];
let componentTimeArr = [];
let addComponentTimeArr = [];
const componentMap = new Map();
const componentMap2 = new Map();
let firstRender = true;
let addedComponents = 0;
let mountedComponents = 0;
let addComponentArr = [];
let componentDetailsList = [];
let addComponentDetailsList = [];

function deleteTimeComponent(arrComponent, arrTimeComponent, event) {
  let index;
  if (arrTimeComponent.length !== arrComponent.length) {
    console.log('ARR TIME and ARR do not have equal lengths. EXITING');
    return;
  }
  for (let i = 0 ; i < arrTimeComponent.length; i++) {
    if (arrTimeComponent[i][1] === parseFloat(event.timeStamp.toFixed(10))) {
      index  = i;
      break;
    }
  }
  for (let i = index; i < arrTimeComponent.length; i++) {
    arrTimeComponent[i] = arrTimeComponent[i + 1];
    arrComponent[i] = arrComponent[i + 1];
  }
  
  arrTimeComponent.splice(arrTimeComponent.length - 1);
  arrComponent.splice(arrComponent.length - 1);
  console.log('arrTimeComponent after delete: ', arrTimeComponent);
  console.log('arrComponent after delete: ', arrComponent);
  componentDetailsList.splice(index, 1);


}
function deleteComponent(arr, map, event) {
  let index = 0;
  console.log('map.get(event): ', map.get(event));
  for (let i = map.get(event); i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }

  console.log('map: ', map);
  map.delete(event);
  // for (const key of map.keys()) {
  //   map.set(key, index);
  //   index++;
  // }
  return arr.splice(arr.length - 1);
}

function searchDeeplyNestedObject(obj, str, result = false, map = new Map(), path = '') {
  if (typeof obj !== 'object') return result;
  
  
  if (Array.isArray(obj)) {
    
    for (const value of obj) {
      if (typeof value === 'object') {
        result = searchDeeplyNestedObject(value, str, result, map, path);
      }
      if (typeof value === 'string') {
        if (value === str) {
          result = true;
          break;
        }
      }
    }
  }
  else {
    if (!map.has(obj)) {
      map.set(obj, true);
      for (const key in obj) {
        path  = path + ' -> ' + key;
        if (key === 'cssRules' || key === 'rules') {
          // console.log('path: ', path);
          continue;
        }
        if (typeof obj[key] === 'object') {
					
          result = searchDeeplyNestedObject(obj[key], str, result, map, path);
        }
        if (typeof obj[key] === 'string') {
          if (obj[key] === str) {
						result = true;
            break;
          }
        }
      }
    }
  }
  return result
}

let start;
window.document.addEventListener('SvelteRegisterComponent', (e) => {
  console.log('svelteRegisterComponent e:', e);
  start = window.performance.now();
  if (!firstRender) {
    componentMap2.set(componentArr.length + addedComponents, e);
    addedComponents++;
    addComponentTimeArr.push([e.detail.tagName, parseFloat(e.timeStamp.toFixed(10))]);
    addComponentArr.push(e.detail.tagName);
    addComponentDetailsList.push({'name': e.detail.tagName, 'details': e.detail.component.$capture_state()});
  }

  // e.detail.component.$$.before_update.push(() => {
  //   console.log(e.detail.tagName, ' before update');
  // })

  // e.detail.component.$$.after_update.push(() => {
  //   console.log(e.detail.tagName, ' after update');
  // })

  e.detail.component.$$.on_mount.push(() => {
   e.detail.component.customRenderTime = window.performance.now() - start;

    console.log(e.detail.tagName, ' just mounted');
    console.log('customRenderTime: ', e.detail.component.customRenderTime);
    if (!firstRender) {
      mountedComponents++;
      if (mountedComponents === addedComponents && addComponentArr.length > 0) {
        console.log('addComponentArr: ', addComponentArr);
        for (let i = componentArr.length - 1; i >= 0; i--) {
          if (componentArr[i] === addComponentArr[addComponentArr.length - 1]) {
            for (let k = componentArr.length - 1; k > i; k--) {
              console.log('i  k: ', i, k);
              componentDetailsList[k + addComponentDetailsList.length] = componentDetailsList[k]
              componentArr[k + addComponentArr.length] = componentArr[k];
              componentTimeArr[k + addComponentArr.length] = componentTimeArr[k].slice();
              componentMap.set(componentMap2.get(k), k + addComponentArr.length);
              console.log('componentArr after first push: ', componentArr);
            }
            const len = componentMap.size;
            console.log('componentMap2: ', componentMap2);
            for (let j = 0; j < addComponentArr.length; j++) {
              componentDetailsList[i + 1] = addComponentDetailsList[j]
              componentArr[i + 1] = addComponentArr[j];
              componentTimeArr[i + 1] = addComponentTimeArr[j].slice();
              componentMap.set(componentMap2.get(len + j), len - addComponentArr.length + j);
              i++;
            }
            break;
          }
        }
        console.log('componentMap on add: ', componentMap);
        console.log(componentArr);
        console.log('componentTimeArr: ', componentTimeArr);
        // window.postMessage(componentTimeArr);
       
        window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList}));
        addedComponents = 0;
        mountedComponents = 0;
        addComponentArr = [];
        addComponentTimeArr = [];
        addComponentDetailsList = [];
      }
    }

    
  });
  e.detail.component.$$.on_destroy.push(() => {
    console.log('e.detail.component.$$.on_destroy: ', e.detail.tagName, ' was destroyed!');
    // deleteComponent(componentArr, componentMap, e);
    deleteTimeComponent(componentArr, componentTimeArr, e);
    console.log('componentArr on destroy: ', componentArr);
    // window.postMessage(componentTimeArr);
    window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList}));
  });


  if (firstRender) {

    componentMap2.set(componentArr.length, e);
    componentMap.set(e, componentArr.length);
    componentTimeArr.push([e.detail.tagName, parseFloat(e.timeStamp.toFixed(10))]);
    componentArr.push(e.detail.tagName);
    componentDetailsList.push({'name': e.detail.tagName, 'details': e.detail.component.$capture_state()});
  }
  console.log('e.detail.tagName: ',e.detail.tagName,  'e.detail.id: ',e.detail.id);

  if (e.detail.id === 'create_fragment' && firstRender){
    // console.log('componentMap2: ', componentMap2);
    console.log('componentArr on original render: ', componentArr);
    // window.postMessage(componentTimeArr);
    window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList}));
    firstRender = false;
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
function rebaseRenderTime(arr) {
  if (!arr.length) return arr;
  for (let i = arr.length - 1; i > 0; i--) {
    arr[i][1] -= arr[i - 1][1];
    arr[i][1] = arr[i][1].toFixed(2);
  }
  arr[0][1] = 0.00;
  return arr;
}

window.addEventListener("message", function(event) {
  // const data = rebaseRenderTime(event.data);
  // console.log('event.data: ', data);
  
  // chrome.runtime.sendMessage(data);
  console.log('event.data: ', event.data);
  chrome.runtime.sendMessage(JSON.parse(event.data));
});



// window.document.addEventListener('SvelteDOMInsert', e => {
//   console.log('svelteDOMinsert e: ', e);
// });
// window.document.addEventListener('SvelteDOMRemove', e => { console.log('svelteDOMRemove e: ', e); });
// window.document.addEventListener('SvelteDOMAddEventListener', e => {console.log('svelteDOMAddEventListener e :', e);});
// window.document.addEventListener('SvelteRegisterBlock', (e) => {
  // console.log('svelteRegisterBlock: e: ', e);
// })