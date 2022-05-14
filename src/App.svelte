<script lang='ts'>
  import { onMount } from 'svelte';
  import { parse, walk} from 'svelte/compiler';
  export let name:string;
  onMount(() => {
    console.log("sending message from app mount");
    const port = chrome.runtime.connect({name: "svelte-devtools-connection"});
    port.postMessage({
    name: "start",
    tabId: chrome.devtools.inspectedWindow.tabId,
    });
    port.onMessage.addListener((msg) => {
      console.log('msg received: ', msg);
      if (msg.newArr){
        msg.newArr.forEach((e) => {
            if (e.source){
              console.log('file URL: ', e.url);
              const ast = parse(e.source);
              console.log('ast: ', ast);
            }
        })
      }
    });
  });
   
  </script>
  
  <p>Hello and Goodbye {name}</p>
  