<script lang="ts">
	import type { Bike } from "$lib/models/bike.svelte";
	import { bikeSyncService } from "$lib/services/bikeSync.svelte";

	// Styling and helper function geenrated partially by AI

	let { selectedBike } = $props<{
		selectedBike: Bike;
	}>();

	// Helper function to determine battery status color
	function getBatteryColor(level: string | number): string {
		if (level === "N/A") return "text-gray-400";
		const numLevel = Number(level);
		if (numLevel > 70) return "text-green-500";
		if (numLevel > 30) return "text-yellow-500";
		return "text-red-500";
	}

	// Helper function to format coordinates
	function formatCoordinate(coord: string | number): string {
		return coord === "N/A" ? "N/A" : Number(coord).toFixed(6);
	}

	const showLowBatteryWarning = $derived(selectedBike.batteryLevel < 20);
	const isEquipmentOn = $derived(selectedBike.isEquipmentOn);
	const isTravelling = $derived(selectedBike.isTravelling);
	let syncStatus = $state(false);

	$effect(() => {
		const unsubscribe = bikeSyncService.subscribe(
			selectedBike.id,
			(status) => {
				syncStatus = status;
			},
		);

		return unsubscribe;
	});
</script>

<div class="bg-white rounded-lg shadow-md p-4 my-2">
	<div class="flex justify-between items-center">
		<div class="text-lg font-semibold text-gray-800 py-2">Vald cykel</div>
		<div class="flex gap-2">
			{#if showLowBatteryWarning}
				<div class="bg-red-100 text-red-800 rounded-lg p-2">
					<span class="font-semibold">Lågt batteri!</span>
				</div>
			{/if}
			{#if isTravelling}
				<div class="bg-blue-100 text-blue-800 p-2 rounded-lg">
					<span class="font-semibold">Startad</span>
				</div>
			{:else}
				<div class="bg-gray-100 text-gray-800 p-2 rounded-lg">
					<span class="font-semibold">Pausad</span>
				</div>
			{/if}
			{#if isEquipmentOn}
				<div class="bg-green-100 text-green-800 p-2 rounded-lg">
					<span class="font-semibold">På</span>
				</div>
			{:else}
				<div class="bg-red-100 text-red-800 rounded-lg p-2">
					<span class="font-semibold">Av</span>
				</div>
			{/if}
		</div>
	</div>

	<div class="space-y-3">
		<!-- Status Badge -->
		<div class="flex justify-between items-center">
			<span class="text-sm text-gray-600">Status</span>
			<span
				class="px-2 py-1 rounded-full text-xs {selectedBike.status ===
				'Service'
					? 'bg-yellow-100 text-yellow-800'
					: 'bg-green-100 text-green-800'}"
			>
				{selectedBike.status}
			</span>
		</div>

		<!-- Battery Level -->
		<div class="flex justify-between items-center">
			<span class="text-sm text-gray-600">Batteri</span>
			<span
				class="text-sm font-medium {getBatteryColor(
					selectedBike.batteryLevel,
				)}"
			>
				{selectedBike.batteryLevel === "N/A"
					? "N/A"
					: `${selectedBike.batteryLevel}%`}
			</span>
		</div>

		<!-- Location -->
		<div class="border-t border-gray-100 pt-3">
			<div class="text-sm text-gray-600 mb-1">Position</div>
			<div class="grid grid-cols-2 gap-2 text-xs">
				<div class="justify-self-start">
					<span class="text-gray-500">Lat: </span>
					<span class="font-medium"
						>{formatCoordinate(selectedBike.latitude)}</span
					>
				</div>
				<div class="justify-self-end">
					<span class="text-gray-500">Long: </span>
					<span class="font-medium"
						>{formatCoordinate(selectedBike.longitude)}</span
					>
				</div>
			</div>
		</div>

		<!-- Movement Info -->
		<div class="border-t border-gray-100 pt-3">
			<div class="grid grid-cols-2 gap-2">
				<div class="text-s justify-self-start">
					<span class="text-gray-500">Hastighet: </span>
					<span class="font-medium">
						{selectedBike.speed === undefined
							? "N/A"
							: `${selectedBike.speed} km/h`}
					</span>
				</div>
				<div class="text-sm justify-self-end">
					<span class="text-gray-500">Rör sig: </span>
					<span class="font-medium">
						{selectedBike.moving === "N/A"
							? "N/A"
							: selectedBike.moving
								? "Ja"
								: "Nej"}
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
				<div class="text-xs text-gray-500 justify-self-end">
					{#if syncStatus}
						<span class="font-semibold text-green-500">Syncing</span
						>
					{:else}
						<span class="font-semibold text-red-500"
							>Not syncing</span
						>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
</style>
