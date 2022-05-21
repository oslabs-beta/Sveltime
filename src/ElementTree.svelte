<script>
  import Element from './Element.svelte'
  export let handleItemClick
  export let handleButtonClick
  export let arr
</script>

<style>
  .elementTree {
    height: 100vh;
    width: 100%;
    background-color: #bcd2d9;
    padding-left: 30px;
  }
</style>

<div class="elementTree">
  <!-- <h2>Components:</h2> -->
  {#each arr as item, i}
    <Element
      name={item[1]}
      parent={item[0]}
      id={item[2]}
      {handleItemClick}
      {handleButtonClick}
      --leftMargin="{item[2] * 3}rem" />
  {/each}
</div>
