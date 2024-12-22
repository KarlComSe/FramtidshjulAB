<script lang="ts">
	export let selectedBike = {
		id: 'N/A',
		status: 'N/A',
		batteryLevel: 'N/A',
		latitude: 'N/A',
		longitude: 'N/A',
		speed: 'N/A',
		moving: 'N/A'
	};
</script>

<div>
	<h3>Vald cykel</h3>
    <ul class="list-disc pl-5 space-y-2">
        <li class="text-xs font-small">Cykel-id: {selectedBike.id}</li>
        <li class="text-xs font-small">Status: {selectedBike.status}</li>
        <li class="text-xs font-small">Batteri: {selectedBike.batteryLevel}</li>
        <li class="text-xs font-small">Latitude: {selectedBike.latitude}</li>
        <li class="text-xs font-small">Longitude: {selectedBike.longitude}</li>
        <li class="text-xs font-small">Speed: {selectedBike.speed}</li>
        <li class="text-xs font-small">Moving: {selectedBike.moving}</li>
    </ul>
</div>
