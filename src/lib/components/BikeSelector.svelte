<script lang="ts">
    import { bikeStore } from "$lib/stores/bikeStore.svelte";
    import QrCode from "$lib/components/QrCode.svelte";
    let filter = $state("");
    let bikes = $derived(
        [...bikeStore.bikes.values()].filter((bike) =>
            bike.id.includes(filter),
        ),
    );
    let selectedBikeId = $derived(bikeStore.selectedBikeId);
    let showBikeSelector = $state(true);

    function handleSelect(event: Event) {
        const select = event.target as HTMLSelectElement;
        bikeStore.selectBike(select.value);
    }
    function filterBikes(event: Event) {
        const input = event.target as HTMLInputElement;
        filter = input.value;
    }
</script>

<div class="bg-white rounded-lg shadow-md p-4 relative">
    <div class="font-small text-xs">
        <button
            class="text-blue-500"
            onclick={() => (showBikeSelector = !showBikeSelector)}
        >
            {showBikeSelector ? "Dölj" : "Visa"} cykelväljare
        </button>
    </div>
    {#if showBikeSelector}
        <div
            class="flex flex-row items-center gap-4 flex-wrap min-h-44 justify-center"
        >
            <div>
                <div class="grid grid-cols-2 gap-2 items-center">
                    <label for="bikeInput" class="text-gray-600 text-right">Filtrera cykel-ID:</label>
                    <input
                        id="bikeInput"
                        type="text"
                        class="p-1 border border-gray-200 rounded w-full"
                        oninput={filterBikes}
                    />
                </div>
                <div class="grid grid-cols-2 gap-2 items-center mt-2">
                    <label for="bikeSelect" class="text-gray-600 text-right">Vilken cykel är du:</label>
                    <select
                        id="bikeSelect"
                        value={selectedBikeId ?? ""}
                        onchange={handleSelect}
                        class="p-1 border border-gray-200 rounded w-full"
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
            </div>
            <div>
                <QrCode data={selectedBikeId} />
            </div>
        </div>
        <div></div>
    {/if}
</div>

<style>
    select {
        min-width: 250px;
    }
</style>
