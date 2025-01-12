<script lang="ts">
  // Heavily AI generated code.
  import { bikeStore } from '$lib/stores/bikeStore.svelte';
  import 'leaflet/dist/leaflet.css';
  import type { Map as LeafletMap } from 'leaflet'; // Renamed to avoid conflict
  import { onMount } from 'svelte';

  let bikes = bikeStore.bikes;

  let map: LeafletMap;
  let L: typeof import('leaflet');
  let markerLayer: L.LayerGroup;
  let markers: Record<string, L.Marker> = {};
  let mapInitialized = $state(false);

  // Specify the type for pendingUpdates
  let pendingUpdates = new Map<string, [number, number]>();
  let updateScheduled = false;

  let mapBounds: L.LatLngBounds | null = null;
  let visibleBikes = $derived(getVisibleBikes());

  function getVisibleBikes() {
    if (!mapBounds || !bikes.size) return [];
    return Array.from(bikes.values()).filter((bike) =>
      mapBounds?.contains([bike.latitude, bike.longitude])
    );
  }

  onMount(async () => {
    L = await import('leaflet');
    map = L.map('map').setView([57.7089, 11.9746], 13);

    map.on('moveend', () => {
      mapBounds = map.getBounds();
    });
    mapBounds = map.getBounds();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markerLayer = L.layerGroup().addTo(map);
    mapInitialized = true;
    if (bikes.size > 0) {
      processMarkers();
    }
  });

  function createMarker(bikeId: string, lat: number, lng: number) {
    const marker = L.marker([lat, lng], {
      title: `Bike ${bikeId}`,
    });
    markers[bikeId] = marker;
    marker.addTo(markerLayer);
  }

  function queueMarkerUpdate(bikeId: string, lat: number, lng: number) {
    pendingUpdates.set(bikeId, [lat, lng]);

    if (!updateScheduled) {
      updateScheduled = true;
      requestAnimationFrame(() => flushUpdates());
    }
  }

  function flushUpdates() {
    updateScheduled = false;

    for (const [bikeId, [lat, lng]] of pendingUpdates.entries()) {
      const marker = markers[bikeId];
      if (marker) {
        marker.setLatLng([lat, lng]);
      }
    }

    pendingUpdates.clear();
  }

  function processMarkers() {
    if (!markerLayer || !L) return;

    const currentBikes = Array.from(bikes.values());
    const bikeIds = new Set(currentBikes.map((bike) => bike.id));

    // Remove markers for bikes that no longer exist
    Object.keys(markers).forEach((id) => {
      if (!bikeIds.has(id)) {
        markers[id].remove();
        delete markers[id];
      }
    });

    // Update or create markers
    for (const bike of visibleBikes) {
      if (bike.latitude && bike.longitude) {
        if (markers[bike.id]) {
          queueMarkerUpdate(bike.id, bike.latitude, bike.longitude);
        } else {
          createMarker(bike.id, bike.latitude, bike.longitude);
        }
      }
    }
    Object.keys(markers).forEach((id) => {
      const marker = markers[id];
      if (!mapBounds?.contains(marker.getLatLng())) {
        marker.remove();
        delete markers[id];
      }
    });
  }

  $effect(() => {
    if (mapInitialized && bikes.size > 0) {
      processMarkers();
    }
  });
</script>

<div class="my-2 rounded-lg bg-white p-4 shadow-md">
  <div class="h-96" id="map"></div>
</div>
