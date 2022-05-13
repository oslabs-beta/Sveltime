<script lang='ts'>
  import { onMount } from 'svelte';
  import { parse } from 'svelte/compiler';
  export let name:string;
  onMount(() => {
    console.log("sending message from app mount");
    const port = chrome.runtime.connect({name: "svelte-devtools-connection"});
    port.postMessage({
    name: "start",
    tabId: chrome.devtools.inspectedWindow.tabId,
    });
    port.onMessage.addListener(msg => {
        if (msg.source){
           console.log('source received from devtools: ', msg.source);
           const ast = parse(msg.source);
           console.log('ast after parse: ', ast);
        }
      });
  });
   
  </script>
  
  <p>Hello and Goodbye {name}</p>
  