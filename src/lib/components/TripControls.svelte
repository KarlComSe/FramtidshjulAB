<script lang="ts">
  import { bikeStore } from '$lib/stores/bikeStore.svelte';

  let selectedBikeId = $derived(bikeStore.selectedBikeId);
  let selectedBike = $derived(bikeStore.selectedBike());
  let isEquipmentOn = $derived(selectedBike?.isEquipmentOn ?? false);
  let isTravelling = $derived(selectedBike?.isTravelling ?? false);
</script>

<div class="rounded-lg bg-white p-4 shadow-md">
  <div class="mt-3 flex flex-col gap-3 sm:flex-row">
    <button
      class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
      onclick={() => selectedBike?.toggleIsTravelling()}
    >
      {isTravelling ? 'Pausa' : 'Starta'} resa
    </button>
    <button
      class="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      onclick={() => selectedBike?.endRide()}
    >
      Avsluta resa
    </button>
  </div>
  <!-- // /*
        // Taken from and slightly modified:
        // https://www.material-tailwind.com/docs/html/switch
        // Doesn't fully work, when the user toggle and the switch is active, the bg-color isn't applied instantly. Future fix is to tie the class to a reactive variable.
        // */ -->
  <div class="inline-flex items-center gap-2 p-4">
    <label for="switch-component-on" class="cursor-pointer text-sm text-slate-600">Av</label>

    <div class="relative inline-block h-5 w-11">
      <input
        checked={isEquipmentOn}
        id="switch-component-on"
        type="checkbox"
        class="peer h-5 w-11 cursor-pointer appearance-none rounded-full bg-red-700 transition-colors duration-300 checked:bg-green-700"
        onchange={() => selectedBike?.toggleEquipment()}
      />
      <label
        for="switch-component-on"
        class="absolute left-0 top-0 h-5 w-5 cursor-pointer rounded-full border border-slate-300 bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800"
      >
      </label>
    </div>

    <label for="switch-component-on" class="cursor-pointer text-sm text-slate-600">På</label>
  </div>
</div>

<style>
</style>
