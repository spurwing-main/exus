function main() {
	initLoadAnimations();
	initNestedLoadAnimations();

	function getAnimLoadSettings(el) {
		if (!el) {
			return;
		}
		let data = {};
		data.opacity = el.dataset.animLoadOpacity || 0;
		data.x = el.dataset.animLoadX || 0;
		data.y = el.dataset.animLoadY || 0;
		data.duration = el.dataset.animLoadDuration || 1;
		data.ease = el.dataset.animLoadEase || "power2.out";
		data.start = el.dataset.animLoadStart || "top 80%";
		data.end = el.dataset.animLoadEnd || "top 30%";
		data.stagger = el.dataset.animLoadstagger || 0;
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
					opacity: settings.opacity,
					x: settings.x,
					y: settings.y,
				},
				{
					opacity: 1,
					x: 0,
					y: 0,
					duration: parseFloat(settings.duration),
					ease: settings.ease,
					scrollTrigger: {
						trigger: el,
						start: settings.start,
						end: settings.end,
						toggleActions: "play none none none",
						// markers: true, // Uncomment for debugging
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
			let settings = getAnimLoadSettings(el);

			gsap.fromTo(
				children,
				{
					opacity: settings.opacity,
					x: settings.x,
					y: settings.y,
				},
				{
					opacity: 1,
					x: 0,
					y: 0,
					duration: parseFloat(settings.duration),
					ease: settings.ease,
					stagger: settings.stagger,
					scrollTrigger: {
						trigger: el,
						start: settings.start,
						end: settings.end,
						toggleActions: "play none none none",
						// markers: true, // Uncomment for debugging
					},
				}
			);
		});
	}
}
