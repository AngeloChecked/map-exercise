const campaings = [
	{
		name: "campaignName", description: "campaignDescription",
		missions: [
			{ name: "missionName", completed: false, area: [[51.509, -0.08], [51.503, -0.06], [51.51, -0.047]] },
			{ name: "missionName2", completed: false, area: [[51.519, -0.08], [51.513, -0.06], [51.52, -0.047]] }
		]
	},
	{
		name: "campaignName2", description: "campaignDescription",
		missions: [
			{ name: "missionName2", completed: false, area: [[51.509, -0.18], [51.503, -0.16], [51.51, -0.147]] },
			{ name: "missionName22", completed: false, area: [[51.519, -0.18], [51.513, -0.16], [51.52, -0.147]] }
		]
	}
]

window.onload = () => {
	const map = initMap()
	const campaingsContent = document.getElementById('campaigns-content')
	map.whenReady(() => {
		initCampaigns(campaingsContent, map, campaings)
	})
	const mapperContnent = document.getElementById('mapper-content')
}

function initMap() {
	const map = L.map('map').setView([51.505, -0.09], 13)

	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
	}).addTo(map);

	L.control.sidebar({
		autopan: false,
		closeButton: true,
		container: 'sidebar',
		position: 'left',
	}).addTo(map)

	return map
}

function initCampaigns(element, map, campaingsData) {
	const campaignsBox = document.createElement("ul")

	const campaignLayers = []
	for (const campaign of campaingsData) {
		const campaignLayer = L.layerGroup().addTo(map)
		campaignLayers.push(campaignLayer)
		campaignsBox.appendChild(campaignContainer(campaign, campaignLayer, campaignLayers, map))
	}

	element.appendChild(campaignsBox)

	return campaignLayers
}

function campaignContainer({ name, description, missions }, layerGroup, allGroups, map) {
	const campaignItem = document.createElement("li")

	const campaignInfo = campaignInfoContainer(name, description, layerGroup, allGroups, map)
	campaignItem.appendChild(campaignInfo)
	campaignInfo.appendChild(missionsContainer(missions, layerGroup, allGroups, map))

	return campaignItem
}

function campaignInfoContainer(name, description, layerGroup, allGroups, map) {
	const campaignInfo = document.createElement("div")

	const campaignTitle = document.createElement("p")
	campaignTitle.innerHTML = `campaign: ${name}`
	const campaignDesc = document.createElement("p")
	campaignDesc.innerHTML = `description: ${description}`
	campaignInfo.appendChild(campaignTitle)
	campaignInfo.appendChild(campaignDesc)

	campaignInfo.appendChild(showCampaignButton(allGroups, map, layerGroup))

	return campaignInfo
}


function missionsContainer(missions, layerGroup, allGroups, map) {
	const missionsBox = document.createElement("ul")

	for (const mission of missions) {
		const missionItem = document.createElement("li")
		let missionInfo = document.createElement("div")
		missionInfo.innerHTML = `mission: ${mission.name} <br> completed: ${mission.completed}`
		missionItem.appendChild(missionInfo)

		missionItem.appendChild(showMissionButton(mission, layerGroup, allGroups, map))

		missionsBox.appendChild(missionItem)
	}

	return missionsBox
}

function showCampaignButton(allGroups, map, layerGroup) {
	const campaignVisualizeButton = document.createElement("button")

	campaignVisualizeButton.innerText = "show campaign in map"
	campaignVisualizeButton.onclick = () => {
		for (let group of allGroups) {
			group.eachLayer(layer => { map.removeLayer(layer) })
			layerGroup.eachLayer(layer => { map.addLayer(layer) })
		}
	}

	return campaignVisualizeButton
}

function showMissionButton(mission, layerGroup, allGroups, map) {
	const missionVisualizeButton = document.createElement("button")

	missionVisualizeButton.innerText = "show in map"

	const randomColor = Math.floor(Math.random() * 16777215).toString(16)
	const polygon = L.polygon([...mission.area], { color: `#${randomColor}` })
	layerGroup.addLayer(polygon)
	missionVisualizeButton.onclick = () => {
		for (let group of allGroups){
			group.eachLayer(layer => { map.removeLayer(layer) })
		}
		map.addLayer(polygon)
	}

	return missionVisualizeButton
}

