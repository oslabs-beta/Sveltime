<script>
  import Element from './Element.svelte'
  export let handleItemClick
  export let arr
  setTimeout(()=> console.log('arr from element tree', arr), 1000);
</script>

<style>
  .container {
    height: 100%;
    width: 100%;
    min-width: 55vw;
    background-color: rgb(52, 54, 62);
    padding-top: 75px;
    border-left: 2px solid rgb(115, 117, 126);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .elementTree {
    width: 80%;
    padding-left: 15px;
  }
</style>

<div class="container">
  <div class="elementTree">
    {#each arr as item, i}
      <Element
        name={item[1]}
        key={i}
        currentNode={item[4]}
        {handleItemClick}
        --leftMargin="{item[2] * 3}rem" />
    {/each}
  </div>
</div>
