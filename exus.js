function main() {
	gsap.registerPlugin(ScrollTrigger);
	initLoadAnimations();
	// initNestedLoadAnimations();
	// initNestedLoadAnimations_2();
	initTabAnimations();

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
}
