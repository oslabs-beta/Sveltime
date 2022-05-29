<script>
  import Element from './Element.svelte'
  export let handleItemClick
  export let arr
</script>

<style>
  .container {
    height: 100vh;
    width: 100%;
    min-width: 55vw;
    /* background-color: rgb(52, 54, 62); */
    background-color: #222222;
    padding-top: 75px;
    border-left: 2px solid rgb(115, 117, 126);
    display: flex;
    flex-direction: column;
    margin-bottom: 150px;
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
        stateData={item[3]}
        name={item[1]}
        key={i}
        currentNode={item[4]}
        {handleItemClick}
        --leftMargin="{item[2] * 2.7}rem" />
    {/each}
  </div>
</div>
