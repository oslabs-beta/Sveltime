<script>
  export let name
  export let handleItemClick
  export let currentNode
	// import CollapsibleSection from './CollapsibleSection.svelte'
  let isStateShowing = false
</script>

<style>
  .componentItem {
    display: flex;
    flex-direction: column;
    align-items: flex-start;


    
    /* display: flex;
    justify-content: space-between;
    align-items: center; */
    background-color: #3e4c59;
    color: #eee;
    padding: 2px 10px;
    margin: 10px;
    border: 1px solid rgb(115, 117, 126);
    border-radius: 6px;
    /* font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif, sans-serif; */
    font-family: 'Encode Sans', sans-serif;
    font-size: 1.5em;
    cursor: pointer;
    margin-left: var(--leftMargin, 4rem);
    width: 60%;
  }
  .componentItem:hover {
    /* filter: brightness(85%); */
    border: 1px solid orange;
    z-index: 1;
  }

  .showBtn {
    border-radius: 20px 20px;
    background-color: rgba(255, 166, 0, 0.80);
    cursor: pointer;
    color: black;
    min-width: 50%;
    max-width: 100px;
  }
  .hidden {
    display: none;
  }

  .hiddenChildrenArrow {
    font-size: 1em;
  }
  /* button {
    border: none;
  } */
  p {
    letter-spacing: 0.08em;

  }
  .hiddenState {
    background-color: rgb(255, 255, 255);
    color: black;
    width: 100%;
    margin-bottom: 10px;
    /* padding-left:15px; */
  }
  
  .showHideState {
    background-color: green;
    color: white;
    border-radius: 5px;
    height: 30px;
    width: 100px;
    border-radius: 8px;
  }
  #firstDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
  }
  .hiddenState > p {
    padding-left: 15px;
    font-size: 1em;
    font-family: monospace;
    letter-spacing: 0;
  }
</style>

<div
  class={currentNode.visibility ? 'componentItem' : 'componentItem hidden'}
  on:click|stopPropagation={() => handleItemClick(currentNode)}
  >
  <div id="firstDiv">
    <p class="hiddenChildrenArrow">
      <strong>
        {!currentNode.children.length ? '' : currentNode.hasHiddenChildren ? '►' : '▼'}
        Render Time: {currentNode.renderTime}ms
      </strong>
      {name}
    </p>
    <button class="showHideState" on:click|stopPropagation={()=>{isStateShowing = !isStateShowing}}>Show State</button>
  </div>
  <!-- <CollapsibleSection headerText={'State'} >
    Here is state for this component.
  </CollapsibleSection> -->
  <div class="hiddenState" hidden={!isStateShowing}>
    <p>Hidden State Information</p>
    <p>Hidden State Information</p>
    <p>Hidden State Information</p>
  </div>
</div>

