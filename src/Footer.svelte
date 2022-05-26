<script>
  export let arr
</script>

<style>
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: rgba(42, 44, 52, 1);
    gap: 20px;
    border-top: 1px solid rgb(115, 117, 126);
    padding: 5px;
  }

  .counter {
    margin-left: 30px;
    margin-bottom: 20px;
    margin-top: 10px;
    bottom: 0;
    color: white;
    font-size: 1.3em;
  }
</style>

<div class="footer">
  <h5 class="counter">Number of Svelte Components: {arr.length}</h5>
</div>
