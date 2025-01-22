function main() {
	gsap.registerPlugin(ScrollTrigger);
	initLoadAnimations();
	// initNestedLoadAnimations();
	// initNestedLoadAnimations_2();
	initTabAnimations();
	// initMap();
	initMap_old();

	function getAnimLoadSettings(el) {
		if (!el) {
			return;
		}
		let data = {};
		data.x = el.dataset.animLoadX || 0;
		data.y = el.dataset.animLoadY || 0;
		data.duration = el.dataset.animLoadDuration || 1;
		data.ease = el.dataset.animLoadEase || "power2.inOut";
		data.start = el.dataset.animLoadStart || "top 60%";
		// data.end = el.dataset.animLoadEnd || "top 30%";
		data.stagger = el.dataset.animLoadstagger || 0.1;
		data.enabled = el.dataset.animLoad || true;
		return data;
	}

	function initLoadAnimations() {
		const elements = gsap.utils.toArray(":is(.anim-load, .anim-load-parent)");

		elements.forEach((el) => {
			// check for any overrides
			let settings = getAnimLoadSettings(el);

			console.log(el);

			gsap.fromTo(
				el,
				{
					autoAlpha: 0,
					x: settings.x,
					y: settings.y,
				},
				{
					autoAlpha: 1,
					x: 0,
					y: 0,
					duration: parseFloat(settings.duration),
					ease: settings.ease,
					scrollTrigger: {
						trigger: el,
						start: settings.start,
						// end: settings.end,
						// toggleActions: "play none none none",
					},
				}
			);
		});
	}

	function initNestedLoadAnimations() {
		const parents = gsap.utils.toArray(".anim-load-parent");

		parents.forEach((parent) => {
			const children = parent.querySelectorAll(".anim-load-child");

			console.log(parent);
			console.log(children);

			// check for any overrides
			let settings = getAnimLoadSettings(parent);

			// timeline
			let tl = gsap.timeline();

			// animate in parent if enabled
			tl.fromTo(
				parent,
				{
					autoAlpha: 0,
					// x: settings.x,
					// y: settings.y,
				},
				{
					autoAlpha: 1,
					// x: 0,
					// y: 0,
					duration: parseFloat(settings.duration),
					ease: settings.ease,
					scrollTrigger: {
						trigger: parent,
						start: settings.start,
						// end: settings.end,
						// toggleActions: "play none none none",
					},
				}
			);

			// animate in children
			tl.fromTo(
				children,

				{
					autoAlpha: 0,
					// x: settings.x,
					// y: settings.y,
				},
				{
					autoAlpha: 1,
					// x: 0,
					// y: 0,
					duration: parseFloat(settings.duration),
					ease: settings.ease,
					stagger: settings.stagger,
				},
				"<50%" // start child animation halfway through parent animation
			);
		});
	}

	function initNestedLoadAnimations_2() {
		ScrollTrigger.batch(".anim-load-parent", {
			start: "top 75%", // scroll location that triggers parent anim

			onEnter: (batch) => {
				batch.forEach((parent, index) => {
					let child = parent.querySelectorAll(".anim-load-child");
					let parent_tl = gsap.timeline();
					parent_tl.to(parent, 1, {
						x: "0%",
						autoAlpha: 1,
						stagger: 0.5,
					});
					parent_tl.to(
						child,
						1,
						{
							// x: "0%",
							y: "0%",
							autoAlpha: 1,
							stagger: 0.35,
						},
						"<50%"
					); // start child animation halfway through parent animation
				});
			},
		});
	}

	function initTabAnimations() {
		// Select all sections on the page
		const sections = document.querySelectorAll(".tab-5050_tabs-menu");

		// Function to calculate and update bar height
		function updateBarHeight(section, n, menuHeight, gap) {
			const h = (menuHeight - (n - 1) * gap) / n; // Calculate height
			section.style.setProperty("--c--tabs--bar-h", `${h}px`);
		}

		// Function to calculate and update bar offset
		function updateBarOffset(section, n, menuHeight, gap) {
			const activeLink = section.querySelector("a.active"); // Find the active link
			if (!activeLink) return;

			const links = Array.from(section.querySelectorAll("a"));
			const i = links.indexOf(activeLink); // Get the index of the active link

			const y = (i / n) * (menuHeight + gap); // Calculate vertical offset
			gsap.to(section, {
				duration: 0.3,
				"--c--tabs--bar-y": `${y}px`,
				ease: "power2.out",
			});
		}

		// Function to initialize bars and attach click events
		function initBars() {
			sections.forEach((section) => {
				const links = section.querySelectorAll("a");
				if (!links.length) return;

				const n = links.length; // Number of links

				// Retrieve height and gap
				const menuHeight = section.offsetHeight;
				const gap = parseFloat(gsap.getProperty(section, "gap")) || 0;

				// Update bar height
				updateBarHeight(section, n, menuHeight, gap);

				// Attach click events to update bar position
				links.forEach((link, i) => {
					link.addEventListener("click", () => {
						// Set active class on clicked link
						links.forEach((l) => l.classList.remove("active"));
						link.classList.add("active");

						// Recalculate menu height and gap on each click
						const menuHeight = section.offsetHeight;
						const gap = parseFloat(gsap.getProperty(section, "gap")) || 0;

						updateBarOffset(section, n, menuHeight, gap);
					});
				});

				// Set the initial offset based on the active link
				updateBarOffset(section, n, menuHeight, gap);
			});
		}

		// Function to update all bars on resize
		function updateBarsOnResize() {
			sections.forEach((section) => {
				const links = section.querySelectorAll("a");
				if (!links.length) return;

				const n = links.length; // Number of links

				// Retrieve updated height and gap
				const menuHeight = section.offsetHeight;
				const gap = parseFloat(gsap.getProperty(section, "gap")) || 0;

				// Update bar height and offset
				updateBarHeight(section, n, menuHeight, gap);
				updateBarOffset(section, n, menuHeight, gap);
			});
		}

		// Initialize bars and attach resize listener
		initBars();

		window.addEventListener("resize", updateBarsOnResize);
	}

	function initMap() {
		// Initialize exusData object if not already defined
		exusData = exusData || {};
		exusData.energyTypes = exusData.energyTypes || [
			"Wind",
			"Solar",
			"Biomass",
			"Hydro",
		];

		// Create a countries lookup object
		const createCountriesLookup = (countries) => {
			const lookup = {};
			countries.forEach((country) => {
				lookup[country.properties.countryID] = country;
			});
			return lookup;
		};

		// Assign states to their corresponding countries
		const assignStatesToCountries = (states, countriesLookup) => {
			states.forEach((state) => {
				const countryID = state.properties.countryID;
				if (countryID && countriesLookup[countryID]) {
					const country = countriesLookup[countryID];
					country.properties.states = country.properties.states || [];
					country.properties.states.push(state);
				}
			});
		};

		// Initialize Leaflet map
		const initializeMap = () => {
			const mapElement = document.getElementById("map");
			if (!mapElement) return null;
			return L.map("map", { attributionControl: false });
		};

		// Add Mapbox tiles
		const addTileLayer = (map) => {
			if (!map) return;
			L.tileLayer(
				"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
				{
					attribution:
						'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 18,
					id: "mapbox/light-v10",
					tileSize: 512,
					zoomOffset: -1,
					accessToken:
						"pk.eyJ1IjoiZXh1c3BhcnRuZXJzIiwiYSI6ImNrbXhrM2kyNDBudHYzMXBmNm00dnp2eHYifQ.ji4-DweeB-OgghbdmSyp6Q",
				}
			).addTo(map);
		};

		// Create a custom marker icon
		const createMarkerIcon = () => {
			return L.icon({
				iconUrl:
					"https://uploads-ssl.webflow.com/5fc51706f820e1f30a3d5ec9/6009f6760cb9aa7941c2a0db_exus-icon-pin-02.png",
				shadowUrl:
					"https://uploads-ssl.webflow.com/5fc51706f820e1f30a3d5ec9/6009f01da1ed9aa45b97a43b_exus-icon-pin-shadow-02.png",
				iconSize: [36, 64],
				shadowSize: [53, 34],
				iconAnchor: [18, 64],
				shadowAnchor: [0, 34],
				popupAnchor: [0, -68],
			});
		};

		// Add office markers to the map
		const addOfficeMarkers = (offices, map, markerIcon) => {
			if (!offices || offices.length === 0 || !map)
				return { officeMarkers: [], layerGroup: null };

			const officeMarkers = [];
			const officeNameElements = document.querySelectorAll(
				".data-text--office-name"
			);

			offices.forEach((office) => {
				const matchingElement = Array.from(officeNameElements).find(
					(el) => el.innerHTML === office.name
				);

				if (matchingElement) {
					const addressElement = matchingElement.nextElementSibling;
					if (addressElement?.matches(".data-text--office-address")) {
						office.address = addressElement.innerHTML;
					}

					office.latlong = L.latLng(office.latitude, office.longitude);
					const marker = L.marker(office.latlong, {
						icon: markerIcon,
					}).bindPopup(
						`<div class='exus-popup__content'>
								<div class='exus-popup__head'>${office.name}</div>
								<a href='/contact' class='exus-popup__link'>Contact</a>
							</div>`,
						{ maxWidth: 500, className: "exus-popup" }
					);

					officeMarkers.push(marker);
				}
			});

			const layerGroup = L.layerGroup(officeMarkers).addTo(map);
			return { officeMarkers, layerGroup };
		};

		// Initialize capacity control
		const initializeCapacityControl = (energyTypes) => {
			const capControl = L.control({ position: "bottomleft" });

			capControl.onAdd = function () {
				this.div = L.DomUtil.create("div", "capControl");
				this.name = L.DomUtil.create("div", "capControl__name", this.div);
				this.name.innerHTML = "Select a country to see capacity";

				this.capacity = L.DomUtil.create("div", "capControl__cap", this.div);
				this.capacity.style.display = "none";

				energyTypes.forEach((type) => {
					this[`capacityRow_${type}`] = L.DomUtil.create(
						"div",
						"capControl__capRow",
						this.div
					);
					this[`capacityType_${type}`] = L.DomUtil.create(
						"div",
						"capControl__capRow__type",
						this[`capacityRow_${type}`]
					);
					this[`capacityValue_${type}`] = L.DomUtil.create(
						"div",
						"capControl__capRow__value",
						this[`capacityRow_${type}`]
					);
					this[`capacityRow_${type}`].style.display = "none";
				});

				this.button = L.DomUtil.create("button", "capControl__btn", this.div);
				return this.div;
			};

			capControl.update = function (feature, type) {
				if (feature) {
					this.name.innerHTML = feature.name;
					this.capacity.innerHTML = `${feature.capacityTotal || 0} MW`;
					this.capacity.style.display = "block";

					energyTypes.forEach((energyType) => {
						const capacityValue = feature[`capacity${energyType}`] || 0;
						this[`capacityRow_${energyType}`].style.display = capacityValue
							? "block"
							: "none";
						this[`capacityType_${energyType}`].innerHTML = energyType;
						this[
							`capacityValue_${energyType}`
						].innerHTML = `${capacityValue} MW`;
					});

					this.button.style.display =
						type === "country" && feature.states ? "inline-block" : "none";
					this.button.innerHTML =
						type === "country" ? "See states" : "See countries";
				}
			};

			return capControl;
		};

		// Define styling for states and countries
		const styleFeature = (featureType) => {
			return {
				fillColor: featureType === "state" ? "#009cb8" : "#0057b7",
				weight: 2,
				color: "white",
				fillOpacity: 0.7,
			};
		};

		// Add interactivity to map layers
		const addInteractivity = (layer, featureType, capControl) => {
			layer.on({
				mouseover: (e) => {
					e.target.setStyle({ weight: 5, color: "#666", fillOpacity: 0.9 });
				},
				mouseout: (e) => {
					layer.resetStyle(e.target);
				},
				click: (e) => {
					map.fitBounds(e.target.getBounds());
					capControl.update(e.target.feature.properties, featureType);
				},
			});
		};

		// Main initialization function
		const initialize = () => {
			exusData.map = initializeMap();
			let map = exusData.map;
			if (!exusData.map) return;

			addTileLayer(map);

			const countriesLookup = createCountriesLookup(exusData.countries);
			assignStatesToCountries(exusData.states, countriesLookup);

			const markerIcon = createMarkerIcon();
			// const { officeMarkers, layerGroup: officeLayer } = addOfficeMarkers(
			// 	exusData.offices,
			// 	map,
			// 	markerIcon
			// );

			exusData.capControl = initializeCapacityControl(exusData.energyTypes);
			exusData.capControl.addTo(map);

			const statesLayer = L.geoJSON(exusData.states, {
				style: styleFeature("state"),
				onEachFeature: (feature, layer) =>
					addInteractivity(layer, "state", exusData.capControl),
			});

			const countriesLayer = L.geoJSON(exusData.countries, {
				style: styleFeature("country"),
				onEachFeature: (feature, layer) =>
					addInteractivity(layer, "country", exusData.capControl),
			});

			countriesLayer.addTo(map);

			// if (officeMarkers.length > 0) {
			// 	const featureGroup = L.featureGroup([...officeMarkers]);
			// 	map.fitBounds(featureGroup.getBounds().pad(0.05));
			// }

			map.fitBounds(countriesLayer.getBounds().pad(0.05));

			const overlayMaps = {
				States: statesLayer,
				Countries: countriesLayer,
				// Offices: officeLayer,
			};
			L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);
		};

		// Run initialization
		initialize();
	}

	function initMap_old() {
		// check map element exists
		const mapEl = document.querySelector("#map");
		if (!mapEl) return;

		//define our energy types
		exusData.energyTypes = exusData.energyTypes || [
			"Wind",
			"Solar",
			"Biomass",
			"Hydro",
		];

		exusData.layers = {};

		//lookup obj for countries to avoid looping through countries arr lots of times
		var countriesLookup = {};
		for (let i = 0; i < exusData.countries.length; i++) {
			countriesLookup[exusData.countries[i].properties.countryID] =
				exusData.countries[i];
		}

		//Loop through states with data and append them to their parent country - currently using countryID as the key to match by
		for (let i = 0; i < exusData.states.length; i++) {
			var myState = exusData.states[i];
			if (!myState.properties.countryID) continue; //if no countryID assigned, skip this state
			var myID = myState.properties.countryID;
			if (!countriesLookup[myID]) continue; //if no country with this countryID exists, skip this state
			countriesLookup[myID].properties.states =
				countriesLookup[myID].properties.states || []; //create arr if does not exist
			countriesLookup[myID].properties.states.push(myState); //add state to country
		}

		//initialize map
		exusData.map = L.map("map", { attributionControl: false });
		var map = exusData.map;

		// get current region
		exusData.mapRegion = mapEl.dataset.mapRegion || "world";
		if (exusData.mapRegion == "latam") {
			exusData.mapRegion = "latin-america";
		}

		//load tiles
		L.tileLayer(
			"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
			{
				attribution:
					'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: "mapbox/light-v10",
				tileSize: 512,
				zoomOffset: -1,
				accessToken:
					"pk.eyJ1Ijoic3B1cndpbmctc3AiLCJhIjoiY202N3Y3N2dlMDg3NTJ3czhqbzFweWMwMiJ9.t0VqzflzEIyan_e7033uFQ",
			}
		).addTo(map);

		//custom marker pin
		var officeIcon = L.icon({
			iconUrl:
				"https://uploads-ssl.webflow.com/5fc51706f820e1f30a3d5ec9/6009f6760cb9aa7941c2a0db_exus-icon-pin-02.png",
			shadowUrl:
				"https://uploads-ssl.webflow.com/5fc51706f820e1f30a3d5ec9/6009f01da1ed9aa45b97a43b_exus-icon-pin-shadow-02.png",
			iconSize: [36, 64], // size of the icon
			shadowSize: [53, 34], // size of the shadow
			iconAnchor: [18, 64], // point of the icon which will correspond to marker's location
			shadowAnchor: [0, 34], // the same for the shadow
			popupAnchor: [0, -68], // point from which the popup should open relative to the iconAnchor
		});

		//****************************************//
		//custom control for holding capacity information about country
		exusData.capControl = L.control({
			position: "bottomleft",
		});

		//create control
		exusData.capControl.onAdd = function (map) {
			//parent div
			this.div = L.DomUtil.create("div", "capControl");
			//heading
			this.name = L.DomUtil.create("div", "capControl__name", this.div); //header obj
			this.name.innerHTML = "Select a country to see capacity";
			//total capacity
			this.capacity = L.DomUtil.create("div", "capControl__cap", this.div); //capacity obj
			this.capacity.style.display = "none"; //hide capacity for the moment
			//create elements for each capacity type
			for (let i = 0; i < exusData.energyTypes.length; i++) {
				this["capacityRow_" + exusData.energyTypes[i]] = L.DomUtil.create(
					"div",
					"capControl__capRow",
					this.div
				);
				this["capacityType_" + exusData.energyTypes[i]] = L.DomUtil.create(
					"div",
					"capControl__capRow__type",
					this["capacityRow_" + exusData.energyTypes[i]]
				);
				this["capacityValue_" + exusData.energyTypes[i]] = L.DomUtil.create(
					"div",
					"capControl__capRow__value",
					this["capacityRow_" + exusData.energyTypes[i]]
				);
				this["capacityRow_" + exusData.energyTypes[i]].style.display = "none"; //hide row for the moment
			}
			//button to see child states
			this.button = L.DomUtil.create("button", "capControl__btn", this.div); //button obj
			return this.div; //onAdd() must return an instance of HTML Element representing the control
		};

		//update control when a state or country is clicked on
		exusData.capControl.update = function (countryOrState, featureType) {
			if (countryOrState) {
				this.name.innerHTML = countryOrState.name;
				this.capacity.innerHTML = countryOrState.capacityTotal + " MW";
				this.capacity.style.display = ""; //show
				for (let i = 0; i < exusData.energyTypes.length; i++) {
					this["capacityRow_" + exusData.energyTypes[i]].style.display = ""; //show
					this["capacityType_" + exusData.energyTypes[i]].innerHTML =
						exusData.energyTypes[i];
					this["capacityValue_" + exusData.energyTypes[i]].innerHTML =
						countryOrState["capacity" + exusData.energyTypes[i]] + " MW";
					//if no capacity for this energy type, hide
					if (countryOrState["capacity" + exusData.energyTypes[i]] == 0) {
						this["capacityRow_" + exusData.energyTypes[i]].style.display =
							"none";
					}
				}

				//if we click on a country, show "see states"
				if (featureType == "country") {
					if (countryOrState.states) {
						//if this country has some states, show the button
						this.button.innerHTML = "See states";
						this.button.style.display = "inline-block";
					} else {
						//if this country has no states, hide the button
						this.button.innerHTML = "";
						this.button.style.display = "";
					}
				}
				if (featureType == "state") {
					this.button.innerHTML = "See countries";
					this.button.style.display = "inline-block";
				}
			}
		};

		//add control to map
		exusData.capControl.addTo(map);
		//****************************************//

		//****************************************//
		//styling function
		function styleStates(feature) {
			return {
				fillColor: "#009cb8",
				weight: 2,
				opacity: 1,
				color: "white",
				//dashArray: '3',
				fillOpacity: 0.7,
			};
		}
		//****************************************//

		//****************************************//
		//interactivity

		//on mouseover
		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: "#666",
				dashArray: "",
				fillOpacity: 0.7,
			});

			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				layer.bringToFront();
			}
		}

		//mouseout
		function resetHighlightState(e) {
			var layer = e.target;
			//exusData.layers.states.resetStyle(e.target);
			exusData.layers.states.setStyle(styleStates); //this is wrong, really the reset is the way to go, but it keeps resetting to the default style.
		}
		function resetHighlightCountry(e) {
			var layer = e.target;
			//exusData.layers.countries.resetStyle(e.target);
			exusData.layers.countries.setStyle(styleStates);
			//put states back on top
			exusData.layers.states.bringToFront();
		}

		//click to zoom
		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		//function for country click
		function clickOnCountry(e) {
			//zoom to country
			zoomToFeature(e);
			//hide offices
			//map.removeLayer(exusData.layers.offices);
			//update control. This passes a properties obj back to update function for control element, and we also tell the update function this is a country
			exusData.capControl.update(e.target.feature.properties, "country");
		}

		//function for country click
		function clickOnState(e) {
			//zoom to state - we've turned this off since it makes moving quickly between many states difficult
			//zoomToFeature(e);
			//hide offices - turning this off to simplify map behaviour
			//map.removeLayer(exusData.layers.offices);
			//update control. This passes a properties obj back to update function for control element, and we also tell the update function this is a state
			exusData.capControl.update(e.target.feature.properties, "state");
		}

		//click on button to show states
		function showStatesHideCountries() {
			if (map.hasLayer(exusData.layers.countries))
				map.removeLayer(exusData.layers.countries);
			if (!map.hasLayer(exusData.layers.states))
				map.addLayer(exusData.layers.states);
			//toggle button back to countries
			exusData.capControl.button.innerHTML = "See countries";
		}

		//click on button to show countries
		function showCountriesHideStates() {
			if (map.hasLayer(exusData.layers.states))
				map.removeLayer(exusData.layers.states);
			if (!map.hasLayer(exusData.layers.countries))
				map.addLayer(exusData.layers.countries);
			//toggle button back to states
			exusData.capControl.button.innerHTML = "See states";
		}

		//event handler for button
		exusData.capControl.button.onclick = function (e) {
			if (exusData.capControl.button.innerHTML == "See states")
				showStatesHideCountries();
			else if (exusData.capControl.button.innerHTML == "See countries")
				showCountriesHideStates();
			console.log(exusData.capControl.button.value);
			e.stopPropagation(); //stop click action bubbling to map behind control
		};

		//listeners
		function onEachFeatureState(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlightState,
				click: clickOnState,
			});
		}

		function onEachFeatureCountry(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlightCountry,
				click: clickOnCountry,
			});
		}
		//****************************************//

		//****************************************//
		//create layers and pass data

		//new GeoJSON layers for states and countries
		exusData.layers.states = L.geoJSON(
			false, //no data yet
			{
				onEachFeature: onEachFeatureState,
			}
		); //don't add states layer yet

		exusData.layers.countries = L.geoJSON(
			false, //no data yet
			{
				onEachFeature: onEachFeatureCountry,
			}
		).addTo(map);

		exusData.layers.region = L.geoJSON(
			false, //no data yet
			{}
		).addTo(map);
		exusData.layers.region.options.interactive = false;

		//add geojson objects to layers
		for (let i = 0; i < exusData.states.length; i++) {
			exusData.layers.states.addData(exusData.states[i]);
		}
		for (let i = 0; i < exusData.countries.length; i++) {
			exusData.layers.countries.addData(exusData.countries[i]);

			// add countries to region
			if (exusData.countries[i].properties.region == exusData.mapRegion) {
				exusData.layers.region.addData(exusData.countries[i]);
			}
		}

		//at the moment both layers the same col, will change
		exusData.layers.states.setStyle(styleStates);
		exusData.layers.countries.setStyle(styleStates);

		//we could have defined this second, but just to demonstrate method
		exusData.layers.countries.bringToFront();
		exusData.layers.states.bringToFront();
		//****************************************//

		//****************************************//
		//Layer control element

		//create obj containing all layers we wish to control, and add a control element. If layer has already been added to map, this will be autoticked.
		var overlayMaps = {
			States: exusData.layers.states,
			Countries: exusData.layers.countries,
			Offices: exusData.layers.offices,
		};
		//var layerControl = L.control.layers(null, overlayMaps, {collapsed: false}).addTo(map);
		//layerControl.collapsed = false;
		//****************************************//

		// if a region, fit to that region, else fit to all countries
		if (exusData.mapRegion != "world") {
			map.fitBounds(exusData.layers.region.getBounds());
		} else {
			map.fitBounds(exusData.layers.countries.getBounds());
		}
	}
}
