<script>
  export let key
  export let data
</script>

<style>
  .store {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* background-color: #3e4c59; */
    background-color: rgb(62, 62, 62);
    padding: 2px 15px;
    margin: 20px;
    border-radius: 6px;
    /* font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif, */
    font-family: 'Encode Sans', sans-serif;
    /* border: 2px solid red; */
    cursor: pointer;
    color: #eee;
    min-width: 60%;
    width: 260px;
    /* border: 1px solid rgb(115, 117, 126); */
    border: 1px transparent solid
  }
  .store:hover {
    filter: brightness(85%);
    border: 1px solid orange;
  }
  p {
    font-size: 1.4em;
  }
</style>

<div class="store">
  <p>Store: {key}</p>
  <p>Data: {data}</p>
</div>
