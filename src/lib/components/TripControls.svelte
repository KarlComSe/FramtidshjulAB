<script lang="ts">
    import { bikeStore } from "$lib/stores/bikeStore.svelte";

    let selectedBikeId = $derived(bikeStore.selectedBikeId);
    let selectedBike = $derived(bikeStore.selectedBike());
    let isEquipmentOn = $derived(selectedBike?.isEquipmentOn ?? false);
    let isTravelling = $derived(selectedBike?.isTravelling ?? false);
</script>

<div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex flex-col sm:flex-row gap-3 mt-3">
        <button
            class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            onclick={() => selectedBike?.toggleIsTravelling()}
        >
            {isTravelling ? "Pausa" : "Starta"} resa
        </button>
        <button
            class="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
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
        <label
            for="switch-component-on"
            class="text-slate-600 text-sm cursor-pointer">Av</label
        >

        <div class="relative inline-block w-11 h-5">
            <input
                checked={isEquipmentOn}
                id="switch-component-on"
                type="checkbox"
                class="peer appearance-none w-11 h-5 rounded-full bg-red-700 checked:bg-green-700 cursor-pointer transition-colors duration-300"
                onchange={() => selectedBike?.toggleEquipment()}
            />
            <label
                for="switch-component-on"
                class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
            >
            </label>
        </div>

        <label
            for="switch-component-on"
            class="text-slate-600 text-sm cursor-pointer">På</label
        >
    </div>
</div>

<style>
</style>
