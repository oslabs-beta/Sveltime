<script>
  export let parent
  export let name
  export let id
  export let handleItemClick
  export let handleButtonClick
</script>

<style>
  .componentItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: beige;
    padding: 2px 10px;
    margin: 10px;
    border-radius: 6px;
    border: 2px solid brown;
    cursor: pointer;
    margin-left: var(--leftMargin, 4rem);
    width: 200px;
  }
  .showBtn {
    border-radius: 20px 20px;
    background-color: rgb(84, 154, 84);
    cursor: pointer;
    color: white;
  }
</style>

<div class="componentItem" on:click={() => handleItemClick()}>
  <h3>{name}</h3>
  <button class="showBtn" on:click|stopPropagation={() => handleButtonClick()}>
    +
  </button>
</div>
