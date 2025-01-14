<!-- AI generated component -->
<script lang="ts">
  import { toaster } from '$lib/stores/toastSTore.svelte';
</script>

<div class="fixed right-4 top-4 z-50 flex flex-col gap-2">
  {#each toaster.toasts as toast (toast.id)}
    <div
      class="animate-slide-in rounded px-4 py-2 text-white"
      class:bg-red-500={toast.type === 'error'}
      class:bg-green-500={toast.type === 'success'}
      class:bg-blue-500={toast.type === 'info'}
    >
      {toast.message}
    </div>
  {/each}
</div>

<style>
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slide-in 0.2s ease-out;
  }
</style>
