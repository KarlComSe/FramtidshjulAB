<script lang="ts">
    // AI contributed in making this code
    import { bikeStore } from "$lib/stores/bikeStore.svelte";
    import "leaflet/dist/leaflet.css";
    import type { Map } from "leaflet";
    import { onMount } from "svelte";

    let bikes = bikeStore.bikes;

    let map: Map;
    let L: typeof import("leaflet");
    let markerLayer: L.LayerGroup;
    let markers: Record<string, L.Marker> = {};
    let mapInitialized = $state(false);

    onMount(async () => {
        L = await import("leaflet");
        map = L.map("map").setView([57.7089, 11.9746], 13);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        markerLayer = L.layerGroup().addTo(map);
        mapInitialized = true;
        if (bikes.size > 0) {
            handleMarkers();
        }
    });

    $effect(() => {
        if (mapInitialized && bikes.size > 0) {
            handleMarkers();
        }
    });

    function handleMarkers() {
        if (!markerLayer || !L) return;
        
        const bikeArray = Array.from(bikes.values());
        
        for (const bike of bikeArray) {
            if (bike.latitude && bike.longitude) {
                if (markers[bike.id]) {
                    markers[bike.id].setLatLng([bike.latitude, bike.longitude]);
                } else {
                    const marker = L.marker([bike.latitude, bike.longitude], {
                        title: `Bike ${bike.id}`
                    });
                    markers[bike.id] = marker;
                    marker.addTo(markerLayer);
                }
            }
        }
    }
</script>

<div class="bg-white rounded-lg shadow-md p-4 my-2">
    <div class="h-96" id="map"></div>
</div>
