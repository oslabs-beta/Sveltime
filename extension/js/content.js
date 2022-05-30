const code = `
(function() {
//console.log('This is the content script');
let componentArr = [];
let componentFragmentArr = [];
let componentTimeArr = [];
let addComponentTimeArr = [];
const componentMap = new Map();
const componentMap2 = new Map();
const componentObj1 = {};
let componentObj2 = {};
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
  //console.log('arrTimeComponent after delete: ', arrTimeComponent);
  //console.log('arrComponent after delete: ', arrComponent);
  componentDetailsList.splice(index, 1);


}
function deleteComponent(arr, map, event) {
  let index = 0;
  //console.log('map.get(event): ', map.get(event));
  for (let i = map.get(event); i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
  //console.log('map: ', map);
  map.delete(event);
  return arr.splice(arr.length - 1);
}

let start;
window.document.addEventListener('SvelteRegisterComponent', (e) => {
  //console.log('svelteRegisterComponent e:', e);
  start = window.performance.now();
  
  componentObj1[e.detail.tagName + parseFloat(e.timeStamp.toFixed(10))] = e;

  if (!firstRender) {
    componentMap2.set(componentArr.length + addedComponents, e);
    addedComponents++;
    addComponentTimeArr.push([e.detail.tagName, parseFloat(e.timeStamp.toFixed(10))]);
    
    addComponentArr.push(e.detail.tagName);
    addComponentDetailsList.push({'name': e.detail.tagName, 'details': e.detail.component.$capture_state()});
  }

  e.detail.component.$$.on_mount.push(() => {
   e.detail.component.customRenderTime = window.performance.now() - start;

    //console.log(e.detail.tagName, ' just mounted');
    //console.log('customRenderTime: ', e.detail.component.customRenderTime);
    if (!firstRender) {
      mountedComponents++;
      if (mountedComponents === addedComponents && addComponentArr.length > 0) {
        //console.log('addComponentArr: ', addComponentArr);
        for (let i = componentArr.length - 1; i >= 0; i--) {
          if (componentArr[i] === addComponentArr[addComponentArr.length - 1]) {
            for (let k = componentArr.length - 1; k > i; k--) {
              //console.log('i  k: ', i, k);
              componentDetailsList[k + addComponentDetailsList.length] = componentDetailsList[k]
              componentArr[k + addComponentArr.length] = componentArr[k];
              componentTimeArr[k + addComponentArr.length] = componentTimeArr[k].slice();
              componentMap.set(componentMap2.get(k), k + addComponentArr.length);
              //console.log('componentArr after first push: ', componentArr);
            }
            const len = componentMap.size;
            //console.log('componentMap2: ', componentMap2);
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
        //console.log('componentMap on add: ', componentMap);
        //console.log(componentArr);
        //console.log('componentTimeArr: ', componentTimeArr);
       
        // window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList}));

        for (const [key, value] of Object.entries(componentObj1)) {
          componentObj2[key] = value.detail.component.$capture_state();
        }

        window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList, 'componentObj2' : componentObj2}));

        componentObj2 = {};

        addedComponents = 0;
        mountedComponents = 0;
        addComponentArr = [];
        addComponentTimeArr = [];
        addComponentDetailsList = [];
      }
    }

    
  });
  e.detail.component.$$.on_destroy.push(() => {
    //console.log('e.detail.component.$$.on_destroy: ', e.detail.tagName, ' was destroyed!');
    // deleteComponent(componentArr, componentMap, e);
    deleteTimeComponent(componentArr, componentTimeArr, e);
    //console.log('componentArr on destroy: ', componentArr);
    
    // window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList}));

    for (const [key, value] of Object.entries(componentObj1)) {
      componentObj2[key] =  value.detail.component.$capture_state();
    }

    window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList, 'componentObj2' : componentObj2}));

    componentObj2 = {};
  });


  if (firstRender) {

    componentMap2.set(componentArr.length, e);
    componentMap.set(e, componentArr.length);
    componentTimeArr.push([e.detail.tagName, parseFloat(e.timeStamp.toFixed(10))]);
    componentArr.push(e.detail.tagName);
    componentDetailsList.push({'name': e.detail.tagName, 'details': e.detail.component.$capture_state()});
  }
  //console.log('e.detail.tagName: ',e.detail.tagName,  'e.detail.id: ',e.detail.id);

  if (e.detail.id === 'create_fragment' && firstRender){
    // console.log('componentMap2: ', componentMap2);
    //console.log('componentArr on original render: ', componentArr);
    // window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList}));

    for (const [key, value] of Object.entries(componentObj1)) {
      componentObj2[key] = value.detail.component.$capture_state();
    }

    window.postMessage(JSON.stringify({'componentTimeArr': componentTimeArr, 'componentDetailsList': componentDetailsList, 'componentObj2' : componentObj2}));

    componentObj2 = {};

    firstRender = false;
  } 
  
});
})()`;

document.documentElement.setAttribute('onreset', code);
document.documentElement.dispatchEvent(new CustomEvent('reset'));

function rebaseRenderTime(arr) {
  if (!arr.length) return arr;
  for (let i = arr.length - 1; i > 0; i--) {
    arr[i][1] -= arr[i - 1][1];
    arr[i][1] = arr[i][1].toFixed(2);
  }
  arr[0][1] = 0.00;
  return arr;
}

function resetComponentDetailsList(parsedData) {
  const { componentTimeArr, componentDetailsList, componentObj2 } = parsedData;
  if (componentTimeArr.length !== componentDetailsList.length) {
    console.log('ERROR: componentTimeArr and componentDetailsList do not have the same length');
    return;
  }
  for (let i = 0; i < componentTimeArr.length; i++) {
    if (componentTimeArr[i][0] !== componentDetailsList[i].name) {
      console.log(`ERROR: Elements at index ${i} do not match in componentTimeArr and componentDetailsList`);
      return;
    }
    const key = componentTimeArr[i][0] + componentTimeArr[i][1];
    componentDetailsList[i].details = componentObj2[key];
  }
  parsedData.componentObj2 = null;
  return parsedData;
}

window.addEventListener("message", function(event) {
  let parsedData = JSON.parse(event.data);
  parsedData = resetComponentDetailsList(parsedData);
  //console.log('parsedData before rebase: ', parsedData);
  parsedData.componentTimeArr = rebaseRenderTime(parsedData.componentTimeArr);
  //console.log('parsedData: ', parsedData);
  chrome.runtime.sendMessage(parsedData);
});



// window.document.addEventListener('SvelteDOMInsert', e => {
//   console.log('svelteDOMinsert e: ', e);
// });
// window.document.addEventListener('SvelteDOMRemove', e => { console.log('svelteDOMRemove e: ', e); });
// window.document.addEventListener('SvelteDOMAddEventListener', e => {console.log('svelteDOMAddEventListener e :', e);});
// window.document.addEventListener('SvelteRegisterBlock', (e) => {
  // console.log('svelteRegisterBlock: e: ', e);
// })