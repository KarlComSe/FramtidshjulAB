<script lang="ts">
    import { bikeStore } from "$lib/stores/bikeStore.svelte";
    import QrCode from "$lib/components/QrCode.svelte";
    let bikes = $derived([...bikeStore.bikes.values()]);
    let selectedBikeId = $derived(bikeStore.selectedBikeId);
    let showBikeSelector = $state(true);

    function handleSelect(event: Event) {
        const select = event.target as HTMLSelectElement;
        bikeStore.selectBike(select.value);
    }
</script>

<div class="bg-white rounded-lg shadow-md p-4 relative">
    <div class="font-small text-xs">
        <button class="text-blue-500" onclick={() => showBikeSelector = !showBikeSelector}>
            {showBikeSelector ? "Dölj" : "Visa"} cykelväljare
        </button>
    </div>
    {#if showBikeSelector}
        <div class="flex flex-row items-center gap-4 flex-wrap min-h-44 justify-center">
            <div>
                <span class="text-gray-600">Vilken cykel är du:</span>
                <select
                    value={selectedBikeId ?? ""}
                    onchange={handleSelect}
                    class="p-1 border border-gray-200 rounded w-auto"
                >
                    {#each bikes as bike, i}
                        <option value={bike.id}
                            >{i + 1} : {bike.id.slice(0, 10)}... {bike.status !==
                            "Available"
                                ? bike.status == "Service"
                                    ? "(Service)"
                                    : "(Uthyrd)"
                                : "(Tillgänglig)"}</option
                        >
                    {/each}
                </select>
            </div>
            <div>
                <QrCode data={selectedBikeId} />
            </div>
        </div>
    {/if}
</div>

<style>
    select {
        min-width: 250px;
    }
</style>
