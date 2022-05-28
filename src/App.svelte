<script lang="ts">
  import { onMount, afterUpdate } from 'svelte'
  import { compile, parse, walk } from 'svelte/compiler'
  import { get } from 'svelte/store'
  // import Container from './Container.svelte'
  import AllStores from './allStores.svelte'
  import ElementTree from './ElementTree.svelte'
  import Navbar from './Navbar.svelte'

  export let headNodes: any = []
  // export let currentComponents = headNodes;
  export let currentComponents: any
  export let arr = []
  export let renderedComponentsArr: any
  export let renderedComponents: any

  function addConnections() {
    const port = chrome.runtime.connect({ name: 'svelte-devtools-connection' });
      
    const portBackground = chrome.runtime.connect({
          name: 'svelte-background-connection',
        });
     return [port, portBackground]; 
  }

  const getNode = getComponentNode()
  let getRenderedNode = getRenderedComponentNode()
  
  function addListeners2 (port, portBackground) {
    let portMsg, portBackgroundMsg;
    
    port.onMessage.addListener((msg) => {
      portMsg = msg;
      if (portMsg && portBackgroundMsg) {
        const bothMsgReceived = new CustomEvent('messagesReceived', {
      detail: {
        portMsg,
        portBackgroundMsg
      }
    })
        document.dispatchEvent(bothMsgReceived);
      }
    })
    portBackground.onMessage.addListener((msg) => {
      portBackgroundMsg = msg;
      if (portMsg && portBackgroundMsg) {
        const bothMsgReceived = new CustomEvent('messagesReceived', {
      detail: {
        portMsg,
        portBackgroundMsg
      }
    })
        document.dispatchEvent(bothMsgReceived);
      }
    })
  }

  function buildComponentObjects(portMsg, portBackgroundMsg) {
    
        if (portMsg.newArr) {
          const allComponents = {}
          portMsg.newArr.forEach((e) => {
            if (e.source) {
              // const compileOutput = compile(e.source)
              // console.log('compileOutput: ', compileOutput)
              const ast = parse(e.source)
              if (
                ast.instance &&
                ast.instance.content &&
                ast.instance.content.body
              ) {
                const name = getComponentName(e.url)
                if (!allComponents[name]) {
                  allComponents[name] = []
                }
                ast.instance.content.body.forEach((el) => {
                  if (
                    el.type === 'ImportDeclaration' &&
                    el.source.value.match(/.svelte$/)
                  ) {
                    allComponents[name].push(getComponentName(el.source.value))
                  }
                })
              }
            }
          })
          // console.log('allComponents: ', allComponents)
          const allComponentsParents = createParentObj(allComponents)
          // console.log('allComponentsParents: ', allComponentsParents)
          headNodes = updateHeadNodes(
            allComponents,
            allComponentsParents,
            headNodes,
            getNode,
          )
          console.log('headNodes: ', headNodes)
          currentComponents = headNodes
        }
         
            console.log(
              'message received in App.svelte from background.js: ',
              portBackgroundMsg,
            )
            renderedComponentsArr = portBackgroundMsg
            getRenderedNode = getRenderedComponentNode();
            renderedComponentsArr.forEach((component, index) => {
              // renderedComponents = new ComponentNode(component);
              renderedComponents = getRenderedNode(component[0], index, component[1])
              const parent = getRenderedComponentParent(
                renderedComponentsArr,
                component[0],
                index,
                getNode,
              )
              
              if (parent) {
                // renderedComponents.parents = [new ComponentNode(parent)];
                renderedComponents.parents = [
                  getRenderedNode(parent[0], parent[1], parent[0].renderTime),
                ]
              } else {
                renderedComponents.parents = null
              }
              const children = getRenderedComponentChildren(
                renderedComponentsArr,
                component[0],
                index,
                getNode,
                getRenderedNode,
              )
              if (children.length) {
                children.forEach((child) => {
                  // renderedComponents.children.push(new ComponentNode(child));
                  renderedComponents.children.push(
                    getRenderedNode(child[0], child[1], child[0].renderTime),
                  )
                })
              }
            })
            console.log('renderedComponents: ', renderedComponents)

            // console.log('currentComponents: ', )
            if (currentComponents[0]) {
              currentComponents[0] = renderedComponents
              // console.log('currentComponents[0]: ', currentComponents[0])
              arr = []
              currentComponents[0].depthFirstPre(cb, arr)
            } 
      }
  
  const [port, portBackground] = addConnections();

  onMount(() => {
    document.addEventListener('messagesReceived', (e) => {
    console.log('messages Received event listener: ', e.detail);
    buildComponentObjects(e.detail.portMsg, e.detail.portBackgroundMsg);
  })
    
    addListeners2(port, portBackground);
    port.postMessage({
      name: 'start',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });

    portBackground.postMessage({
        name: 'app mounted',
        tabId: chrome.devtools.inspectedWindow.tabId,
      });
      
  })

  

  function getRenderedComponentParent(
    renderedComponentsArr,
    component,
    index,
    getNode,
  ) {
    const node = getNode(component)
    // console.log('node: ', node);
    // console.log('node.parents: ', node.parents);
    if (node.parents === null) {
      return null
    }
    // else if (node.parents.length === 1) {
    //   return node.parents[0].componentName;
    // }
    for (let i = index + 1; i < renderedComponentsArr.length; i++) {
      for (let j = 0; j < node.parents.length; j++) {
        if (node.parents[j].componentName === renderedComponentsArr[i][0]) {
          return [renderedComponentsArr[i][0], i]
        }
      }
    }
  }

  function getRenderedComponentChildren(
    renderedComponentsArr,
    component,
    index,
    getNode,
    getRenderedNode,
  ) {
    const node = getNode(component)
    if (node.componentName === 'FeedbackItem') {
      // console.log('node: ', node)
      // console.log('node.children: ', node.children)
    }

    const children = []
    const objChildren = {}
    let count = 0
    for (let i = index - 1; i >= 0; i--) {
      count = 0
      if (
        isSiblingRenderedComponent(
          component,
          renderedComponentsArr[i][0],
          getRenderedNode,
          getNode,
        )
      ) {
        if (node.componentName === 'FeedbackItem') {
          // console.log('i am a sibling: ', renderedComponentsArr[i])
        }
        break
      }
      if (node.parents) {
        let shouldBreak = false
        for (let k = 0; k < node.parents.length; k++) {
          if (
            isSiblingRenderedComponent(
              node.parents[k].componentName,
              renderedComponentsArr[i][0],
              getRenderedNode,
              getNode,
            )
          ) {
            if (node.componentName === 'FeedbackItem') {
              // console.log(
              //   'i am here, node.parents[k]: ',
              //   node.parents[k].componentName,
              // )
              // console.log(
              //   'i am here, rederendComponentArr[i]: ',
              //   renderedComponentsArr[i],
              // )
            }
            shouldBreak = true
            break
          }
        }
        if (shouldBreak === true) break
      }

      for (let j = 0; j < node.children.length; j++) {
        if (node.children[j].componentName === renderedComponentsArr[i][0]) {
          // console.log('i am here 2');

          if (!objChildren[renderedComponentsArr[i][0]]) {
            objChildren[renderedComponentsArr[i][0]] = [i]
            children.push([renderedComponentsArr[i][0], i])
          } else if (!objChildren[renderedComponentsArr[i][0]].includes(i)) {
            objChildren[renderedComponentsArr[i][0]].push(i)
            children.push([renderedComponentsArr[i][0], i])
          }
          count++
        }
      }
    }
    if (node.componentName === 'FeedbackItem') {
      // console.log('children: ', children)
    }
    return children
  }

  function isSiblingRenderedComponent(
    component1,
    component2,
    getRenderedNode,
    getNode,
  ) {
    if (component1 === 'FeedbackItem') {
      // console.log('component2: ', component2)
    }
    if (component1 === component2) return true
    if (getNode(component1).parents && getNode(component2).parents) {
      for (const parent of getNode(component1).parents) {
        if (getNode(component2).parents.includes(parent)) return true
      }
    }
    return false
  }

  function getComponentName(filePath) {
    return filePath.slice(
      filePath.lastIndexOf('/') + 1,
      filePath.lastIndexOf('.'),
    )
  }

  function createParentObj(allComponents) {
    const allComponentsParents = {}
    Object.keys(allComponents).forEach((e) => {
      if (allComponents[e].length) {
        allComponents[e].forEach((comp) => {
          if (!allComponentsParents[comp]) {
            allComponentsParents[comp] = [e]
          } else {
            allComponentsParents[comp].push(e)
          }
        })
      }
    })
    return allComponentsParents
  }

  class ComponentNode {
    constructor(componentName, renderTime = 0) {
      this.componentName = componentName
      this.parents = []
      this.children = []
      this.renderTime = renderTime;
      this.depthFirstPre = this.depthFirstPre.bind(this)
    }
    depthFirstPre(callback, arr, index = 0, parent = null) {
      let current = this
      callback(current.componentName, arr, index, parent)
      if (current.children.length) {
        for (let i = 0; i < current.children.length; i++) {
          index += 1
          current.children[i].depthFirstPre(callback, arr, index - i, current)
        }
      }
    }
  }

  function cb(str, arr, index, parent) {
    arr.push([parent ? parent.componentName : parent, str, index])
  }

  function getRenderedComponentNode() {
    const componentObj = {}

    return function (componentName, id, renderTime = 0) {
      const key = componentName + id
      if (componentObj.hasOwnProperty(key)){
        if (renderTime !== 0){
          componentObj[key].renderTime = renderTime; 
        }
        return componentObj[key]
      }
      const node = new ComponentNode(componentName, renderTime)
      return (componentObj[key] = node)
    }
  }

  function getComponentNode() {
    const componentObj = {}

    return function (componentName) {
      if (componentObj.hasOwnProperty(componentName))
        return componentObj[componentName]
      const node = new ComponentNode(componentName)
      return (componentObj[componentName] = node)
    }
  }
  function updateHeadNodes(
    allComponents,
    allComponentsParents,
    headNodes,
    getNode,
  ) {
    Object.keys(allComponents).forEach((key) => {
      const node = getNode(key)
      allComponents[key].forEach((e) => {
        node.children.push(getNode(e))
      })
      if (!allComponentsParents.hasOwnProperty(key)) {
        headNodes.push(getNode(key))
      }
    })
    Object.keys(allComponentsParents).forEach((key) => {
      const node = getNode(key)
      allComponentsParents[key].forEach((e) => {
        node.parents.push(getNode(e))
      })
    })
    return headNodes
  }

  function handleItemClick() {
    console.log('item click: ')
  }
  function handleButtonClick(e) {
    console.log('button click: ', e.target)
  }
  function handleStoreClick(e) {
    console.log('store click: ', e.target)
  }
  export let showStores = true
  export let showTree = true
  export let showAbout = true

  function handleShowStores() {
    if (!showTree) return
    showStores = !showStores
  }

  function handleShowTree() {
    if (!showStores) return
    showTree = !showTree
  }

  function handleShowAbout() {
    if (!showStores) return
    showTree = !showTree
  }
  let storeArr = [
    [' one', ' two', ' three'],
    [' 1', ' 2', ' 3'],
    [' A', ' B', ' C'],
  ]

  import Modal from './Modal.svelte'

  let isOpenModal: boolean = false

  function openModal(): void {
    isOpenModal = true
  }

  function closeModal(): void {
    isOpenModal = false
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  .container {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
  }
</style>

<Navbar
  {handleShowStores}
  {handleShowTree}
  {handleShowAbout}
  {showStores}
  {showTree}
  {showAbout}
  {openModal}
  {closeModal}
  {isOpenModal} />
<div class="container">

  <Modal {isOpenModal} on:closeModal={closeModal} />

  {#if showStores}
    <AllStores {storeArr} />
  {/if}
  {#if showTree}
    <ElementTree {arr} {handleItemClick} {handleButtonClick} />
  {/if}
  <!-- {showStores ? <AllStores {storeArr} /> : null}
  {showTree ? <ElementTree {arr} {handleItemClick} {handleButtonClick} /> : null} -->
</div>
