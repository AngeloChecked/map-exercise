const campaings = [
	{
		name: "campaignName", description: "campaignDescription",
		missions: [
			{ name: "missionName", completed: true, area: [[51.509, -0.08], [51.503, -0.06], [51.51, -0.047]] },
			{ name: "missionName2", completed: false, area: [[51.519, -0.08], [51.513, -0.06], [51.52, -0.047]] }
		]
	},
	{
		name: "campaignName2", description: "campaignDescription",
		missions: [
			{ name: "missionName2", completed: false, area: [[51.509, -0.18], [51.503, -0.16], [51.51, -0.147]] },
			{ name: "missionName22", completed: false, area: [[51.519, -0.18], [51.513, -0.16], [51.52, -0.147]] }
		]
	},
	{
		name: "campaignName3", description: "campaignDescription",
		missions: [
			{ name: "missionName2", completed: false, area: [[51.509, -0.13], [51.503, -0.11], [51.51, -0.142]] },
			{ name: "missionName22", completed: true, area: [[51.519, -0.13], [51.513, -0.11], [51.52, -0.142]] }
		]
	}
]

window.onload = () => {
	const map = initMap()
	const campaingsContent = document.getElementById('campaigns-content')
	const mapperContnent = document.getElementById('mapper-content')
	map.whenReady(() => {
		const allGroups = L.layerGroup().addTo(map)
		initCampaignsSection(campaingsContent, map, allGroups, campaings)
		initMapperSection(mapperContnent, map, allGroups, campaings)
	})
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

function initMapperSection(element, map, allGroups, campaingsData) {
	const mapperBox = document.createElement("ul")

	const completedMissionLayer = L.layerGroup().addTo(allGroups)
	const completedMissions = campaingsData.map(campaingn => campaingn.missions).flat(1).filter(mission=> mission.completed)
	for (const completedMission of completedMissions) {
		const completedMissionItem = document.createElement("li")
		let completedMissionInfo = document.createElement("div")

		completedMissionInfo.innerHTML = `mission: ${completedMission.name}`
		const polygon = randomColorPolygon(completedMission.area)		
		completedMissionLayer.addLayer(polygon)
		map.removeLayer(polygon)
		completedMissionItem.appendChild(completedMissionInfo)
		mapperBox.appendChild(completedMissionItem)
	}

	element.appendChild(showAllCompletedMissionsButton(completedMissionLayer, allGroups, map))
	element.appendChild(mapperBox)
}

function initCampaignsSection(element, map, allGroups, campaingsData) {
	const campaignsBox = document.createElement("ul")
	campaignsBox.className = "campaigns-box"

	for (const campaign of campaingsData) {
		const campaignLayer = L.layerGroup().addTo(allGroups)
		campaignsBox.appendChild(campaignContainer(campaign, campaignLayer, allGroups, map))
	}

	element.appendChild(showAllCampaignsButton(allGroups, map))
	element.appendChild(campaignsBox)

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
		allGroups.eachLayer( group=>{
			group.eachLayer(layer => { map.removeLayer(layer) })
		})
		layerGroup.eachLayer(layer => { map.addLayer(layer) })
	}

	return campaignVisualizeButton
}
function showAllCampaignsButton(allGroups, map) {
	const campaignsVisualizeButton = document.createElement("button")

	campaignsVisualizeButton.innerText = "show all campaigns in map"
	campaignsVisualizeButton.onclick = () => {
		allGroups.eachLayer( group=>{
			group.eachLayer(layer => { map.addLayer(layer) })
		})
	}
	return campaignsVisualizeButton
}

function showMissionButton(mission, layerGroup, allGroups, map) {
	const missionVisualizeButton = document.createElement("button")

	missionVisualizeButton.innerText = "show in map"

  const polygon = randomColorPolygon(mission.area)	
	layerGroup.addLayer(polygon)
	missionVisualizeButton.onclick = () => {
		allGroups.eachLayer( group=>{
			group.eachLayer(layer => { map.removeLayer(layer) })
		})
		map.addLayer(polygon)
	}

	return missionVisualizeButton
}

function showAllCompletedMissionsButton(completedMissionLayer, allGroups, map){
	const completeMissionsVisualizeButton = document.createElement("button")

	completeMissionsVisualizeButton.innerText = "show all completed missions in map"
	completeMissionsVisualizeButton.onclick = () => {
		allGroups.eachLayer( group=>{
			group.eachLayer(layer => { map.removeLayer(layer) })
		})
		completedMissionLayer.eachLayer(layer => { map.addLayer(layer) })
	}
	return completeMissionsVisualizeButton
	 
}

function randomColorPolygon(area) {
	const randomColor = Math.floor(Math.random() * 16777215).toString(16)
	const polygon = L.polygon([...area], { color: `#${randomColor}` })
	return polygon
}

