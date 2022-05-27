<script>
  export let name
  export let handleItemClick
  export let currentNode
</script>

<style>
  .componentItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    filter: brightness(85%);
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
</style>

<div
  class={currentNode.visibility ? 'componentItem' : 'componentItem hidden'}
  on:click={() => handleItemClick(currentNode)}>
  <p class="hiddenChildrenArrow">
    <strong>
      {!currentNode.children.length ? '' : currentNode.hasHiddenChildren ? '►' : '▼'}
    </strong>
    {name}
  </p>
</div>
