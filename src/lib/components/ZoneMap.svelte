<script lang="ts">
    let { polygon } = $props();

</script>

<div class="p-4 bg-gray-100 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Fancy point map</h2>
    {#if polygon}
        <ul class="list-disc list-inside">
            {#each polygon as point}
                <li class="text-gray-700">{point.lat}, {point.lng}</li>
            {/each}
        </ul>
    {/if}
</div>
