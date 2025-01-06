function main() {
	initLoadAnimations();
	initNestedLoadAnimations();

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
		console.log(data);
		return data;
	}

	function initLoadAnimations() {
		const elements = gsap.utils.toArray(".anim-load");

		elements.forEach((el) => {
			// check for any overrides
			let settings = getAnimLoadSettings(el);

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
						markers: true, // Uncomment for debugging
					},
				}
			);
		});
	}

	function initNestedLoadAnimations() {
		const parents = gsap.utils.toArray(".anim-load-parent");

		parents.forEach((parent) => {
			const children = parent.querySelectorAll(".anim-load-child");

			// check for any overrides
			let settings = getAnimLoadSettings(parent);

			// timeline
			let tl = gsap.timeline();

			// animate in parent if enabled
			if (settings.enabled) {
				tl.fromTo(
					parent,
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
						stagger: settings.stagger,
						scrollTrigger: {
							trigger: parent,
							start: settings.start,
							// end: settings.end,
							// toggleActions: "play none none none",
						},
					}
				);
			}

			// animate in children
			tl.fromTo(
				children,

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
					stagger: settings.stagger,
				},
				"<50%" // start child animation halfway through parent animation
			);
		});
	}
}
