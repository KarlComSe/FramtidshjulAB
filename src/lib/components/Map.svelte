<script lang="ts">
  // mostly AI generated code
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import type { Map, Marker } from 'leaflet';

  let map: Map;
  let marker: Marker;
  let mapElement: HTMLElement;

  // Derive the position using $derived
  let position = $derived.by(() => {
    const bike = bikeStore.selectedBike();
    console.log('Position updated:', bike?.latitude, bike?.longitude);
    return {
      lat: bike?.latitude ?? 51.505,
      lng: bike?.longitude ?? -0.09
    }
  });

  // Update marker when position changes
  $effect(() => {
    // not sure why reactivity didn't work without this.
    const currentLat = position.lat;
    const currentLng = position.lng;
    if (marker && position) {
      marker.setLatLng([position.lat, position.lng]);
      map?.setView([position.lat, position.lng]);
    }
  });
  

  onMount(() => {
    const initMap = async () => {
      // Dynamic import of Leaflet
      const L = (await import('leaflet')).default;

      // Initialize map
      map = L.map(mapElement).setView([position.lat, position.lng], 18);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add marker
      marker = L.marker([position.lat, position.lng]).addTo(map);
    };

    initMap();

    // Cleanup on component destruction
    return () => {
      if (map) {
        map.remove();
      }
    };
  });
</script>

<div class="map-container">
  <div bind:this={mapElement} class="map"></div>
</div>

<style>
  .map-container {
    width: 100%;
    height: 400px;
  }
  .map {
    height: 100%;
    width: 100%;
  }
</style>