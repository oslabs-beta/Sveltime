<script>
  export let handleShowStores
  export let handleShowTree
  export let handleShowAbout
  export let showStores
  export let showTree
  export let showAbout
</script>

<style>
  .navbar {
    height: 65px;
    background-color: #627d98;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 15px;
  }
  .stores,
  .tree {
    height: 40px;
    background-color: brown;
    color: white;
    border-radius: 12px;
    width: 66px;
    margin-left: 15px;
    border: none;
  }
  .storesAlt,
  .treeAlt {
    height: 40px;
    background-color: rgba(165, 42, 42, 0.41);
    color: white;
    border-radius: 12px;
    width: 66px;
    margin-left: 15px;
  }

  .storesAlt:hover,
  .treeAlt:hover,
  .stores:hover,
  .treeAlt:hover {
    transform: scale(1.05);
  }

  h1 {
    font-size: 20px;
    margin-left: 20px;
    border: none;
  }
  .buttonBox {
    display: flex;
    justify-content: space-between;
    margin-right: 20px;
  }
  .logoTitle {
    color: rgb(250, 136, 36);
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
      class={showStores ? 'stores' : 'storesAlt'}
      on:click={() => handleShowStores()}>
      Stores
    </button>
    <button
      class={showTree ? 'tree' : 'treeAlt'}
      on:click={() => handleShowTree()}>
      Tree
    </button>
    <button
      class={showAbout ? 'about' : 'aboutAlt'}
      on:click={() => handleShowAbout()}>
      Tree
    </button>
  </div>
</div>
