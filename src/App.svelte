<script lang="ts">
  import { onMount, afterUpdate } from 'svelte'
  import { compile, parse, walk } from 'svelte/compiler'
  import Container from './Container.svelte'
  export let headNodes: any = []
  // export let currentComponents = headNodes;
  export let currentComponents: any
  export let arr = []

  onMount(() => {
    console.log('sending message from app mount')
    const getNode = getComponentNode()
    const port = chrome.runtime.connect({ name: 'svelte-devtools-connection' })
    port.postMessage({
      name: 'start',
      tabId: chrome.devtools.inspectedWindow.tabId,
    })
    port.onMessage.addListener((msg) => {
      console.log('msg received: ', msg)
      if (msg.newArr) {
        const allComponents = {}
        msg.newArr.forEach((e) => {
          if (e.source) {
            const compileOutput = compile(e.source)
            console.log('compileOutput: ', compileOutput)
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
        console.log('allComponents: ', allComponents)
        const allComponentsParents = createParentObj(allComponents)
        console.log('allComponentsParents: ', allComponentsParents)
        headNodes = updateHeadNodes(
          allComponents,
          allComponentsParents,
          headNodes,
          getNode,
        )
        console.log('headNodes: ', headNodes)
        currentComponents = headNodes

        if (currentComponents[0]) {
          console.log('currentComponents[0]: ', currentComponents[0])
          arr = []
          currentComponents[0].depthFirstPre(cb, arr)
        }
      }
    })
  })

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
    constructor(componentName) {
      this.componentName = componentName
      this.parents = []
      this.children = []
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
  function handleButtonClick() {
    console.log('button click: ')
  }
</script>

<style>

</style>

<div>
  <h1>The Components:</h1>
  {#each arr as item, i}
    <Container
      name={item[1]}
      parent={item[0]}
      id={item[2]}
      {handleItemClick}
      {handleButtonClick}
      --leftMargin="{item[2] * 5}rem" />
  {/each}
</div>
