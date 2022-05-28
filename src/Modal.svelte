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
    background: rgba(0, 0, 0, 0.66);
  }

  #modal {
    display: var(--display);
    position: fixed;
    width: 60%;
    height: 75%;
    max-width: 500px;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    filter: drop-shadow(0 0 20px #333);
    padding: 15px;
    border-radius: 5px;
    overflow: auto;
    padding: 20px 50px 20px 20px;
  }
  button {
    padding: 0;
    border: none;
    background:none

  }
  .close {
  position: absolute;
  right: 30px;
  top: 5px;
  width: 10px;
  height: 10px;
  opacity: 0.5;
}
  .close:hover {
    opacity: 1;
  }
  .close:before, .close:after {
    position: absolute;
    left: 15px;
    content: '';
    height: 1.4rem;
    width: 1px;
    background-color: #333;
  }
  .close:before {
    transform: rotate(45deg);
  }
  .close:after {
    transform: rotate(-45deg);
  }
  #container {
    overflow-y: auto;
  }
</style>

<div
  id="background"
  style="--display: {isOpenModal ? 'block' : 'none'};"
  on:click={closeModal} />

<div id="modal" style="--display: {isOpenModal ? 'block' : 'none'};">
  <div id="container">
    <button on:click={closeModal} class="close"></button>
    <h2>
      Thank you for using Sveltime, a unique tool that lets Svelte developers
      examine not just the components that make up their sites, but view changes
      to state, and analyze render times. Please visit our GitHub page:
      <a href="https://github.com/oslabs-beta/Sveltime" target="_blank">
        Sveltime
      </a>
    </h2>
  </div>
</div>
