/*! tableOfContents.js v1.0.0 | (c) 2020 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/table-of-contents */

/*
 * Automatically generate a table of contents from the headings on the page
 * @param  {String} content A selector for the element that the content is in
 * @param  {String} target  The selector for the container to render the table of contents into
 * @param  {Object} options An object of user options [optional]
 */
var tableOfContents = function (content, target, options, beforeScroll, afterScroll) {
	//
	// Variables
	//

	// Get content
	var contentWrap = document.querySelector(content);
	var toc = document.querySelector(target);
	if (!contentWrap || !toc) return;

	// Settings & Defaults
	var defaults = {
		levels: 'h2, h3, h4, h5, h6',
		heading: null,
		headingLevel: 'h2',
		headerOffset: 0,
		listType: 'ul',
		smooth: true,
	};
	var settings = {};

	// Placeholder for headings
	var headings;

	//
	// Methods
	//

	/**
	 * Merge user options into defaults
	 * @param  {Object} obj The user options
	 */
	var merge = function (obj) {
		for (var key in defaults) {
			if (Object.prototype.hasOwnProperty.call(defaults, key)) {
				settings[key] = Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : defaults[key];
			}
		}
	};

	/**
	 * Create an ID for a heading if one does not exist
	 * @param  {Node} heading The heading element
	 */
	var createID = function (heading) {
		if (heading.id.length) return;
		heading.id = 'toc_' + heading.textContent.replace(/[^A-Za-z0-9]/g, '-');
	};

	/**
	 * Get the HTML to indent a list a specific number of levels
	 * @param  {Integer} count The number of times to indent the list
	 * @return {String}        The HTML
	 */
	var getIndent = function (count) {
		var html = '';
		for (var i = 0; i < count; i++) {
			html += '<' + settings.listType + '>';
		}
		return html;
	};

	/**
	 * Get the HTML to close an indented list a specific number of levels
	 * @param  {Integer} count The number of times to "outdent" the list
	 * @return {String}        The HTML
	 */
	var getOutdent = function (count) {
		var html = '';
		for (var i = 0; i < count; i++) {
			html += '</' + settings.listType + '></li>';
		}
		return html;
	};

	/**
	 * Get the HTML string to start a new list of headings
	 * @param  {Integer} diff  The number of levels in or out from the current level the list is
	 * @param  {Integer} index The index of the heading in the "headings" NodeList
	 * @return {String}        The HTML
	 */
	var getStartingHTML = function (diff, index) {
		// If indenting
		if (diff > 0) {
			return getIndent(diff);
		}

		// If outdenting
		if (diff < 0) {
			return getOutdent(Math.abs(diff));
		}

		// If it's not the first item and there's no difference
		if (index && !diff) {
			return '</li>';
		}

		return '';
	};

	var addTopMargin = function (element) {
		element.style.scrollMarginTop = settings.headerOffset + 'px';
	}

	/**
	 * Inject the table of contents into the DOM
	 */
	var injectTOC = function () {
		// Track the current heading level
		var level = headings[0].tagName.slice(1);
		var startingLevel = level;

		// Cache the number of headings
		var len = headings.length - 1;
		var heading;
		if (typeof settings.heading === 'undefined' || !settings.heading) {
			heading = '';
		} else {
			heading = '<' + settings.heading.headingLevel + '>' + settings.heading.text + '</' + settings.heading.headingLevel + '>'
		}

		if (settings.smooth) {
			addSmoothScroll(heading);
		}


		//Inject the HTML into the DOM
		toc.innerHTML = heading +
			'<' + settings.listType + '>' +
			Array.prototype.map.call(headings, function (heading, index) {
				// Add an ID if one is missing
				createID(heading);

				// Check the heading level vs. the current list
				var currentLevel = heading.tagName.slice(1);
				var levelDifference = currentLevel - level;
				level = currentLevel;
				var html = getStartingHTML(levelDifference, index);

				// Generate the HTML
				if (settings.headerOffset) {
					addTopMargin(heading);
				}

				html
					+= '<li>' +
					'<a href="#' + heading.id + '">' +
					heading.innerHTML.trim() +
					'</a>';

				// If the last item, close it all out
				if (index === len) {
					html += getOutdent(Math.abs(startingLevel - currentLevel));
				}

				return html;
			}).join('') +
			'</' + settings.listType + '>';
	};

	/**
	 * Initialize the script
	 */
	var init = function () {
		// Merge any user settings into the defaults
		merge(options || {});

		// Get the headings
		// If none are found, don't render a list
		headings = contentWrap.querySelectorAll(settings.levels);
		if (!headings.length) return;

		// Inject the table of contents
		injectTOC();
	};

	function addSmoothScroll() {
		document.querySelector("html").style.scrollBehavior = "smooth";
	}

	function addScrollMargin() {

	}

	/**  
	* Implements the smooth scroll option
	*/
	// function addSmoothScroll() {
	// 	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	// 		anchor.addEventListener('click', function (e) {
	// 			e.preventDefault();
	// 			beforeScroll();
	// 			const anchor = e.target.href
	// 			const element = document.getElementById(anchor.split('#')[1]);
	// 			const headerOffset = options.headerOffset;
	// 			const elementPosition = element.getBoundingClientRect().top;
	// 			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
	// 			// We're not using scrollIntoView because we want to apply an offset
	// 			window.scrollTo({
	// 				top: offsetPosition,
	// 				behavior: options.smooth ? "smooth" : "auto",
	// 			});
	// 			scrollEndListener();

	// 		});
	// 	});
	// }

	/**
	 * Listens for the end of the scroll
	 */
	function scrollEndListener() {
		let position = null
		const checkIfScrollIsStatic = setInterval(() => {
			if (position === window.scrollY) {
				clearInterval(checkIfScrollIsStatic)
				afterScroll();
			}
			position = window.scrollY
		}, 50)
	}

	/**
	 * Execute the script initialization, after that, add the smooth scrolls to each anchor
	 */
	init();

};