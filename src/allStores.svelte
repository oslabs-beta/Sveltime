<script>
  import OneStore from './oneStore.svelte'
  export let storeArr
</script>

<style>
  .allStores {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    left: 50px;
    /* background-color: rgb(52, 54, 62); */
    background-color: #121212;
    width: 100%;
    height: 100vh;
    /* padding-left: 30px; */
    padding-top: 40px;
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
