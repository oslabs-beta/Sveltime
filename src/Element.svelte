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
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif,
      sans-serif;
    font-size: 1.5em;
    cursor: pointer;
    margin-left: var(--leftMargin, 4rem);
    min-width: 50%;
    max-width: 100px;
  }
  .hidden {
    display: none;
  }

  .hiddenChildrenArrow {
    font-size: 1em;
  }

  p {
    letter-spacing: 0.75px;
  }
</style>

<div
  class={currentNode.visibility ? 'componentItem' : 'componentItem hidden'}
  on:click={() => handleItemClick(currentNode)}>
  <p class="hiddenChildrenArrow">
    <strong>
      {!currentNode.children.length ? '' : currentNode.hasHiddenChildren ? '►' : '▼'}
    </strong>
    {name.toUpperCase()}
  </p>
</div>
