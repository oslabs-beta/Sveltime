<script lang='ts'>
  import { onMount } from 'svelte';
  import { parse, walk} from 'svelte/compiler';
  export let name:string;
  onMount(() => {
    console.log("sending message from app mount");
    let headNodes = [];
    const getNode = getComponentNode();
    const port = chrome.runtime.connect({name: "svelte-devtools-connection"});
    port.postMessage({
    name: "start",
    tabId: chrome.devtools.inspectedWindow.tabId,
    });
    port.onMessage.addListener((msg) => {
      console.log('msg received: ', msg);
      if (msg.newArr){
        const allComponents = {};
        msg.newArr.forEach((e) => {
          if (e.source){
            const ast = parse(e.source);
            if (ast.instance && ast.instance.content && ast.instance.content.body){
              const name = getComponentName(e.url);
              if (!allComponents[name]){
                allComponents[name] = [];
              }
              ast.instance.content.body.forEach((el) => {
              if (el.type === 'ImportDeclaration' && el.source.value.match(/.svelte$/)){
                allComponents[name].push(getComponentName(el.source.value));
              }
            });
            }
            
          }
        })
        console.log('allComponents: ', allComponents);
        const allComponentsParents = createParentObj(allComponents);
        console.log('allComponentsParents: ', allComponentsParents);
        headNodes = updateHeadNodes(allComponents, allComponentsParents, headNodes, getNode);
        console.log('headNodes: ', headNodes);
      }   
    });
  });

  function getComponentName(filePath){
    return filePath.slice(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
  }

  function createParentObj(allComponents){
    const allComponentsParents = {};
    Object.keys(allComponents).forEach(e => {
      if (allComponents[e].length){
        allComponents[e].forEach(comp => {
          if (!allComponentsParents[comp]) {
            allComponentsParents[comp] = [e];
          } else {
            allComponentsParents[comp].push(e);
          }
        });
      }
    });
    return allComponentsParents;
  }

  class ComponentNode{
    constructor(componentName) {
      this.componentName = componentName;
      this.parents = [];
      this.children = [];
    }
  }

  function getComponentNode(){
    const componentObj = {};

    return function(componentName){
      if (componentObj.hasOwnProperty(componentName)) return componentObj[componentName];
      const node = new ComponentNode(componentName);
      return componentObj[componentName] = node;
    }
  }
  function updateHeadNodes(allComponents, allComponentsParents, headNodes, getNode){
    Object.keys(allComponents).forEach(key => {
      const node = getNode(key);
      allComponents[key].forEach(e => {
        node.children.push(getNode(e));
      });
      if (!allComponentsParents.hasOwnProperty(key)) {
        headNodes.push(getNode(key));
      }
    });
    Object.keys(allComponentsParents).forEach(key => {
      const node = getNode(key);
      allComponentsParents[key].forEach(e => {
        node.parents.push(getNode(e));
      });
    });
    return headNodes;
  }
   
  </script>
  
  <p>Hello and Goodbye {name}</p>
  