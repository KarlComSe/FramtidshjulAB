<script lang="ts">
  import type { Bike } from '$lib/models/bike.svelte';
  import { bikeSyncService } from '$lib/services/bikeSync.svelte';

  // Styling and helper function geenrated partially by AI

  const { selectedBike } = $props<{
    selectedBike: Bike;
  }>();

  // Helper function to determine battery status color
  function getBatteryColor(level: string | number): string {
    if (level === 'N/A') return 'text-gray-400';
    const numLevel = Number(level);
    if (numLevel > 70) return 'text-green-500';
    if (numLevel > 30) return 'text-yellow-500';
    return 'text-red-500';
  }

  // Helper function to format coordinates
  function formatCoordinate(coord: string | number): string {
    return coord === 'N/A' ? 'N/A' : Number(coord).toFixed(6);
  }

  const showLowBatteryWarning = $derived(selectedBike.batteryLevel < 20);
  const isEquipmentOn = $derived(selectedBike.isEquipmentOn);
  const isTravelling = $derived(selectedBike.isTravelling);
  let syncStatus = $state(false);

  $effect(() => {
    return bikeSyncService.subscribe(selectedBike.id, (status) => {
      syncStatus = status;
    });
  });
</script>

<div class="my-2 rounded-lg bg-white p-4 shadow-md">
  <div class="flex items-center justify-between">
    <div class="py-2 text-lg font-semibold text-gray-800">Vald cykel</div>
    <div class="flex gap-2">
      {#if showLowBatteryWarning}
        <div class="rounded-lg bg-red-100 p-2 text-red-800">
          <span class="font-semibold">Lågt batteri!</span>
        </div>
      {/if}
      {#if isTravelling}
        <div class="rounded-lg bg-blue-100 p-2 text-blue-800">
          <span class="font-semibold">Startad</span>
        </div>
      {:else}
        <div class="rounded-lg bg-gray-100 p-2 text-gray-800">
          <span class="font-semibold">Pausad</span>
        </div>
      {/if}
      {#if isEquipmentOn}
        <div class="rounded-lg bg-green-100 p-2 text-green-800">
          <span class="font-semibold">På</span>
        </div>
      {:else}
        <div class="rounded-lg bg-red-100 p-2 text-red-800">
          <span class="font-semibold">Av</span>
        </div>
      {/if}
    </div>
  </div>

  <div class="space-y-3">
    <!-- Status Badge -->
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-600">Status</span>
      <span
        class="rounded-full px-2 py-1 text-xs {selectedBike.status === 'Service'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-green-100 text-green-800'}"
      >
        {selectedBike.status}
      </span>
    </div>

    <!-- Battery Level -->
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-600">Batteri</span>
      <span class="text-sm font-medium {getBatteryColor(selectedBike.batteryLevel)}">
        {selectedBike.batteryLevel === 'N/A' ? 'N/A' : `${selectedBike.batteryLevel}%`}
      </span>
    </div>

    <!-- Location -->
    <div class="border-t border-gray-100 pt-3">
      <div class="mb-1 text-sm text-gray-600">Position</div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="justify-self-start">
          <span class="text-gray-500">Lat: </span>
          <span class="font-medium">{formatCoordinate(selectedBike.latitude)}</span>
        </div>
        <div class="justify-self-end">
          <span class="text-gray-500">Long: </span>
          <span class="font-medium">{formatCoordinate(selectedBike.longitude)}</span>
        </div>
      </div>
    </div>

    <!-- Movement Info -->
    <div class="border-t border-gray-100 pt-3">
      <div class="grid grid-cols-2 gap-2">
        <div class="text-s justify-self-start">
          <span class="text-gray-500">Hastighet: </span>
          <span class="font-medium">
            {selectedBike.speed === undefined ? 'N/A' : `${selectedBike.speed} km/h`}
          </span>
        </div>
        <div class="justify-self-end text-sm">
          <span class="text-gray-500">Rör sig: </span>
          <span class="font-medium">
            {selectedBike.moving === 'N/A' ? 'N/A' : selectedBike.moving ? 'Ja' : 'Nej'}
          </span>
        </div>
      </div>
    </div>

    <!-- Speed Limit Info -->
    <div class="border-t border-gray-100 pt-3">
      <div class="grid grid-cols-2 gap-2">
        <div class="text-s justify-self-start">
          <span class="text-gray-500">Hastighetsgräns: </span>
          <span class="font-medium">
            {selectedBike.speedlimit === undefined ? 'N/A' : `${selectedBike.speedlimit} km/h`}
          </span>
        </div>
        <div class="justify-self-end text-sm">
          <span class="text-gray-500">Över gränsen: </span>
          <span class="font-medium">
            {selectedBike.speed !== undefined && selectedBike.speedlimit !== undefined
              ? selectedBike.speed > selectedBike.speedlimit
                ? 'Ja'
                : 'Nej'
              : 'N/A'}
          </span>
        </div>
      </div>
    </div>

    <!-- ID at bottom -->
    <div class="border-t border-gray-100 pt-3">
      <div class="grid grid-cols-2 gap-2">
        <div class="text-xs text-gray-500">
          ID: <span class="font-mono">{selectedBike.id}</span>
        </div>
        <div class="justify-self-end text-xs text-gray-500">
          {#if syncStatus}
            <span class="font-semibold text-green-500">Syncing</span>
          {:else}
            <span class="font-semibold text-red-500">Not syncing</span>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
</style>
