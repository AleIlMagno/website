// TODO: Individual files compilation!

// Theme Switcher
//! Thanks to https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
function settingsThemeHandler({localStorageTheme, systemSettingDark}) {
	if (localStorageTheme !== null) {
		return localStorageTheme
	}

	if (systemSettingDark.matches) {
		return "dark"
	}

	return "light"
}

function updateButton({buttonEl, isDark}) {
	const newCta = isDark ? "Change to light theme" : "Change to dark theme"
	const themeStatus = isDark ? "js-dark-is-active" : "js-light-is-active"
	buttonEl.setAttribute("aria-label", newCta)
	buttonEl.setAttribute("data-active-theme", themeStatus)
}

function updateThemeOnHtmlEl({theme}) {
	document.querySelector("html").setAttribute("data-theme", theme)
}

const buttonSwitcher = document.querySelector("[data-theme-toggle]")
const localStorageTheme = localStorage.getItem("theme")
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)")

let currentThemeSetting = settingsThemeHandler({localStorageTheme, systemSettingDark})

updateButton({buttonEl: buttonSwitcher, isDark: currentThemeSetting === "dark"})
updateThemeOnHtmlEl({theme: currentThemeSetting})

buttonSwitcher.addEventListener("click", (e) => {
	const newTheme = currentThemeSetting === "dark" ? "light" : "dark"

	localStorage.setItem("theme", newTheme)
	updateButton({buttonEl: buttonSwitcher, isDark: newTheme === "dark"})
	updateThemeOnHtmlEl({theme: newTheme})

	currentThemeSetting = newTheme
})


/**
 * @overview Generates a list of topics on a Discourse forum.
 * @author Jonah Aragon <jonah@triplebit.net>
 * @version 2.1.0
 * @license
 * Copyright (c) 2023 Jonah Aragon
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const getDiscussData = async (url) => {
	try {
		const response = await fetch(url);
		return await response.json();

	} catch (e) {
		console.warn(`Error: ${e}`);

	}
}

const discussTopicsConstructor = async () => {
	const lists = document.querySelectorAll('ul[data-forum]')

	for (const ul of lists) {
		const dataset = ul.dataset
		const data = await getDiscussData(dataset.feed)
		const topics = data?.topic_list.topics
		const users = data?.users

		topics.forEach((topic) => {
			// --- Data
			const title = topic.title
			const id = topic.id
			const link = dataset.forum + '/t/' + data.slug + '/' + id
			const lastPosted = data.last_posted_at
			const views = data.views

			// --- HTML elements
			const li = document.createElement('li')
			const link = document.createElement('a')
			const avatar = document.createElement('img')
			const textWrapper = document.createElement('span')
			const title = document.createElement('span')
			const footer = document.createElement('span')
			const views = document.createElement('span')
			const lastPoster = document.createElement('span')

			// li.appendChild(link);


			/*
			<li class="topic-list__item">
				<a href="" class="topic-list__link is-flex is-flex-direction-row is-gap-2 is-align-items-flex-start is-justify-content-flex-start">
					<img src="https://placehold.co/48x48" alt="Placeholder image" class="topic-list__avatar _is-skeleton">

					<span class="topic-list__text is-flex is-flex-direction-column">
						<span class="topic-list__title _is-skeleton">Check out that four by four. That is hot. Someday, Jennifer, someday.</span>

						<span class="topic-list__footer mt-1 is-flex is-gap-3">
							<span class="topic-list__views _is-skeleton">
								(o) 5
							</span>
							<span class="topic-list__last-poster _is-skeleton">
								Nov 12, 1955, 22:04 by Biff
							</span>
						</span>
					</span>
				</a>
			</li>
			*/


			console.log('topic', topic);
		})

	}
}


discussTopicsConstructor()

async function main() {
	const elements = document.querySelectorAll("ul[data-forum]");


	for (let j = 0; j < elements.length; j++) {

		var ul = elements[j];
		var dataset = ul.dataset;

		console.log("Fetching data from " + dataset.feed)
		const data = await getDiscussData(dataset.feed);
		var list = data['topic_list']['topics'];

		for (var i = 0; i < dataset.count; i++) {

			var title = list[i]['title'];
			var id = list[i]['id'];
			var featured_link = list[i]['featured_link'];
			var excerpt = list[i]['excerpt']
			excerpt = excerpt.replace(/(\r\n|\n|\r)/gm, "");
			var image = list[i]['image_url'];

			if (excerpt == "") {
				var reply_count = list[i]['reply_count'];
				if (reply_count > 1) {
					excerpt = "Read " + reply_count + " replies on our forum:"
				} else if (reply_count == 1) {
					excerpt = "Read one reply on our forum:"
				} else {
					excerpt = "Learn more about this on our forum:"
				}
			}

			var li = document.createElement("li");

			if (dataset.type == "image") {
				var a = document.createElement('a');

				if (dataset.link == "featured") {
					a.href = featured_link;
				} else {
					a.href = dataset.forum + '/t/' + id;
				}

				a.title = title;
				a.className = "discourse-image-link";

				var img = document.createElement('img');
				img.src = image;
				img.className = "discourse-image";
				img.alt = title;

				var p = document.createElement('p');
				p.className = "discourse-title"
				p.innerText = title;

				a.appendChild(img);
				a.appendChild(p);
				li.appendChild(a);

			} else {
				var h3 = document.createElement('h3');
				var a1 = document.createElement('a');
				a1.className = "discourse-title";

				if (dataset.link == "featured") {
					a1.href = featured_link;
				} else {
					a1.href = dataset.forum + '/t/' + id;
				}

				a1.innerText = title;
				h3.appendChild(a1);

				var p = document.createElement('p');
				p.className = "discourse-excerpt";
				p.innerHTML = excerpt + ' ';

				var a2 = document.createElement('a');
				a2.className = "discourse-more-link";
				a2.href = dataset.forum + '/t/' + id;
				a2.innerText = "Read more...";
				p.appendChild(a2);

				li.appendChild(h3);
				li.appendChild(p);
			}
			ul.appendChild(li);
		}
	}
}

_main();
