<script lang="ts">
    let { polygon } = $props();

</script>

<div class="p-4 bg-gray-100 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Polygon definition</h2>
    <!-- Original ambition : show on a map -->
    {#if polygon}
        <ul class="list-disc list-inside">
            {#each polygon[0] as point}
                <li class="text-gray-700">{point}</li>
            {/each}
        </ul>
    {/if}
</div>
