<script lang="ts">
// mostly AI generated.
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import type { Map, TileLayer, Marker, Circle, LeafletMouseEvent } from 'leaflet';
  
  // Props with default values
  export let zoom = 13;
  export let lat = 51.505;
  export let lng = -0.09;
  
  let mapElement: HTMLDivElement;
  let map: Map;
  let tileLayer: TileLayer;
  let userMarker: Marker;
  let accuracyCircle: Circle;
  let L: any;
  
  async function initializeMap() {
    if (!browser || !mapElement) return;
     
    if (map) {
        map.remove();
    }
        if (!L) {
      L = await import('leaflet');
    }
    
    // Initialize the map
    map = L.map(mapElement);
    map.locate({setView: true, maxZoom: 16, watch: true});
    
    // Add the OpenStreetMap tiles
    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Handle successful location detection
    function onLocationFound(e: any) {
      const radius = e.accuracy;
      console.log(`Location found at ${e.latlng.lat}, ${e.latlng.lng} (accuracy: ${radius}m)`);
      
      // Remove previous marker and circle if they exist
      if (userMarker) map.removeLayer(userMarker);
      if (accuracyCircle) map.removeLayer(accuracyCircle);
      
      // Add new marker and accuracy circle
      userMarker = L.marker(e.latlng).addTo(map)
        .bindPopup(`You are within ${radius} meters from this point`).openPopup();
      accuracyCircle = L.circle(e.latlng, radius).addTo(map);
    }

    // Handle location detection errors
    function onLocationError(e: any) {
      console.error('Error detecting location:', e.message);
    }

    // Track map movement
    function onMapMove(e: LeafletMouseEvent) {
      const center = map.getCenter();
      console.log(`Map center: ${center.lat}, ${center.lng}, Zoom: ${map.getZoom()}`);
    }

    // Add event listeners
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.on('moveend', onMapMove);
  }
  // Initialize on mount
  onMount(() => {
    initializeMap();
  });

  // Cleanup on destroy
  onDestroy(() => {
    if (map) {
      map.stopLocate();
      map.remove();
    }
  });

  // Re-initialize when the element becomes visible
  $: if (mapElement) {
    initializeMap();
  }
</script>

<svelte:head>
  {#if browser}
    <link 
      rel="stylesheet" 
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    />
  {/if}
</svelte:head>

<div 
  bind:this={mapElement}
  class="map-container"
>
</div>

<style>
  .map-container {
    height: 400px;
    width: 100%;
    z-index: 1;
  }
</style>