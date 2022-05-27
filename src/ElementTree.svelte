<script>
  import Element from './Element.svelte'
  export let handleItemClick
  export let handleButtonClick
  export let arr
</script>

<style>
  .container {
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    min-width: 55vw;
    /* background-color: rgb(52, 54, 62); */
    background-color: #232323;
    padding-top: 45px;
    border-left: 2px solid rgb(115, 117, 126);
    display: flex;
    flex-direction: column;
  }
  .elementTree {
    width: 80%;
    padding-left: 15px;
  }
</style>

<div class="container">
  <div class="elementTree">
    <!-- <h2>Components:</h2> -->
    {#each arr as item, i}
      <Element
        name={item[1]}
        parent={item[0]}
        elemId={item[2]}
        key={i}
        {handleItemClick}
        {handleButtonClick}
        --leftMargin="{item[2] * 2.7}rem" />
    {/each}
  </div>
</div>