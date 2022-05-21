<script>
  export let key
  export let data
</script>

<style>
  .store {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #3e4c59;
    padding: 2px 10px;
    margin: 10px;
    border-radius: 6px;
    /* border: 2px solid red; */
    cursor: pointer;
    color: #eee;
    width: 200px;
  }
</style>

<div class="store">
  <h3>Store: {key}</h3>
  <h3>Data: {data}</h3>
</div>
