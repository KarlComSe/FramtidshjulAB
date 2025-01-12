<script lang="ts">
  let { polygon } = $props();
</script>

<div class="rounded-lg bg-gray-100 p-4 shadow-md">
  <h2 class="mb-4 text-xl font-bold">Polygon definition</h2>
  <!-- Original ambition : show on a map -->
  {#if polygon}
    <ul class="list-inside list-disc">
      {#each polygon[0] as point}
        <li class="text-gray-700">{point}</li>
      {/each}
    </ul>
  {/if}
</div>
