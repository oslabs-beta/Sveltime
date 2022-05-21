<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let isOpenModal

  function closeModal() {
    isOpenModal = false
    dispatch('closeModal', { isOpenModal })
  }
</script>

<style>
  #background {
    display: var(--display);
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  #modal {
    display: var(--display);
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    filter: drop-shadow(0 0 20px #333);
    padding: 15px;
    border-radius: 5px;
  }
</style>

<div
  id="background"
  style="--display: {isOpenModal ? 'block' : 'none'};"
  on:click={closeModal} />

<div id="modal" style="--display: {isOpenModal ? 'block' : 'none'};">
  <h2>
    Thank you for using Sveltime, a unique tool that lets Svelte developers
    examine not just the components that make up their sites, but view changes
    to state, and analyze render times. Please visit our GitHub page:
    <a href="https://github.com/oslabs-beta/Sveltime" target="_blank">
      Sveltime
    </a>
  </h2>
</div>
