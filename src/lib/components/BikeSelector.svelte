<script lang="ts">
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import QrCode from '$lib/components/QrCode.svelte';
  let filter = $state('');
  let bikes = $derived([...bikeStore.bikes.values()].filter((bike) => bike.id.includes(filter)));
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

<div class="relative rounded-lg bg-white p-4 shadow-md">
  <div class="font-small text-xs">
    <button class="text-blue-500" onclick={() => (showBikeSelector = !showBikeSelector)}>
      {showBikeSelector ? 'Dölj' : 'Visa'} cykelväljare
    </button>
  </div>
  {#if showBikeSelector}
    <div class="flex min-h-44 flex-row flex-wrap items-center justify-center gap-4">
      <div>
        <div class="grid grid-cols-2 items-center gap-2">
          <label for="bikeInput" class="text-right text-gray-600">Filtrera cykel-ID:</label>
          <input
            id="bikeInput"
            type="text"
            class="w-full rounded border border-gray-200 p-1"
            oninput={filterBikes}
          />
        </div>
        <div class="mt-2 grid grid-cols-2 items-center gap-2">
          <label for="bikeSelect" class="text-right text-gray-600">Vilken cykel är du:</label>
          <select
            id="bikeSelect"
            value={selectedBikeId ?? ''}
            onchange={handleSelect}
            class="w-full rounded border border-gray-200 p-1"
          >
            {#each bikes as bike, i}
              <option value={bike.id}
                >{i + 1} : {bike.id.slice(0, 10)}... {bike.status !== 'Available'
                  ? bike.status == 'Service'
                    ? '(Service)'
                    : '(Uthyrd)'
                  : '(Tillgänglig)'}</option
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
</style>
