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
    padding: 2px 15px;
    margin: 20px;
    border-radius: 6px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif,
      sans-serif;
    /* border: 2px solid red; */
    cursor: pointer;
    color: #eee;
    min-width: 60%;
    width: 260px;
    border: 1px solid rgb(115, 117, 126);
  }
  p {
    font-size: 1.5em;
    letter-spacing: 0.75px;
  }
</style>

<div class="store">
  <p>Store: {key}</p>
  <p>Data: {data}</p>
</div>
