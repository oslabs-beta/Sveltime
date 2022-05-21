<script>
  import OneStore from './oneStore.svelte'
  export let storeArr
</script>

<style>
  .allStores {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    left: 50px;
    background-color: #bcd2d9;
    width: 100%;
    height: 100vh;
    padding-left: 30px;
  }
  h2 {
    padding: 4px;
  }
</style>

<div class="allStores">
  <!-- <h2>Stores</h2> -->
  {#each storeArr as store, i}
    <OneStore data={store} key={i} />
  {/each}
</div>
