const campaings = [
	{
		name: "campaignName", description: "campaignDescription",
		missions: [
			{ name: "missionName", completed: false, area: {} }
		]
	}
]

window.onload = () => {
	initMap(map)
	const campaingsContent = document.getElementById('campaigns-content')
	const mapperContnent = document.getElementById('mapper-content')
}

function initMap(_map) {
	var map = L.map('map').setView([51.505, -0.09], 13);

	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
	}).addTo(map);

	L.control.sidebar({
		autopan: false,
		closeButton: true,
		container: 'sidebar',
		position: 'left',
	}).addTo(map);

	return map
}

function paneTitle(content) {
	const title = document.createElement("h1")
	title.innerText = content
	return title
}