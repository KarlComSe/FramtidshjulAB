<script lang="ts">
  import BikeSelector from '$lib/components/BikeSelector.svelte';
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import { bikeSyncService } from '$lib/services/bikeSync.svelte';
  import Bike from '$lib/components/Bike.svelte';

  const selectedBikeId = $derived(bikeStore.selectedBikeId);

  $effect(() => {
    if (selectedBikeId) {
      bikeSyncService.startSync(selectedBikeId); // Start syncing this bike
    }
  });
</script>

<div class="">
  <BikeSelector />
  <Bike />
</div>

<style>
</style>
