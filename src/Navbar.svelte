<script>
  export let handleShowStores
  export let handleShowTree
  export let handleShowAbout
  export let showStores
  export let showTree
  export let showAbout
  export let openModal
  export let isOpenModal
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .navbar {
    position: fixed;
    width: 100%;
    height: 65px;
    background-color: rgba(42, 44, 52, 1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid rgb(115, 117, 126);
  }
  .btn {
    min-height: 40px;
    background-color: transparent;
    color: white;
    border: none;
    width: 80px;
    margin: 0 12px;
    cursor: pointer;
    box-sizing: border-box;
    border-bottom: 2px solid transparent;
    font-size: 1em;
  }

  .on,
  .on.btn:hover {
    border-bottom: 2px solid orange;
  }

  .btn:hover {
    border-bottom: 2px solid rgba(255, 192, 203, 0.213);
  }

  h1 {
    font-size: 20px;
    margin-left: 20px;
    border: none;
  }
  .buttonBox {
    display: flex;
    justify-content: flex-start;
    margin-right: 20px;
  }
  .logoTitle {
    color: rgba(235, 80, 39, 1);
    letter-spacing: 1px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 2em;
    font-weight: 800;
    background-color: transparent;
    text-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.701);
  }
</style>

<div class="navbar" id="navbar">
  <h1 class="logoTitle">SVELTIME</h1>
  <div class="buttonBox">
    <button
      class={showStores ? 'btn on' : 'btn off'}
      on:click={() => handleShowStores()}>
      Stores
    </button>
    <button
      class={showTree ? 'btn on' : 'btn off'}
      on:click={() => handleShowTree()}>
      Components
    </button>
    <button class={isOpenModal ? 'btn on' : 'btn off'} on:click={openModal}>
      About Us
    </button>
  </div>
</div>
