(function () {

	var fa = document.getElementById('toggle-announcement'),
		fb = document.getElementById('toggle-background'),
		fm = document.getElementById('toggle-market'),
		fr = document.getElementById('toggle-read');

	document.querySelectorAll("img[data-activate]").forEach(e => {
		e.addEventListener('click', function () {
			activate(e.dataset.activate)
		});
	})

	document.querySelector(".lightbox-close").addEventListener('click', close)
	document.querySelector(".lightbox-target").addEventListener('click', close)

	function activate(src) {
		var lboxImg = document.querySelector('.lightbox-target img');
		lboxImg.setAttribute('src', lboxImg.dataset['loading']);
		document.querySelector('.lightbox-target').classList.add('active');
		lboxImg.setAttribute('src', src);
	}

	document.querySelectorAll('.tl__img').forEach(e => {
		e.addEventListener('click', function (e) {
			var n = e.target.parentNode;
			if (n) {
				if (n.dataset['filter']) {
					delete n.dataset['filter'];
				} else {
					n.dataset['filter'] = true;
				}
			}
		});
	});

	var lazyImg = document.querySelectorAll('.imgHolder img[data-activate]')


	document.addEventListener('scroll', lazyLoad);
	document.addEventListener('resize', lazyLoad);

	function lazyLoad() {
		for (var i = 0; i < lazyImg.length; i++) {
			if (isInViewport(lazyImg[i])) {
				if (lazyImg[i].dataset['activate'] && lazyImg[i].dataset['activate'] != lazyImg[i].src) {
					lazyImg[i].src = lazyImg[i].dataset['activate'];
				}
			}
		}
	}

	function isInViewport(el) {
		var rect = el.getBoundingClientRect();

		return (
			rect.bottom >= 0 &&
			rect.right >= 0 &&
			rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.left <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	document.querySelectorAll('.tl__block .link').forEach(e => {
		e.addEventListener('click', function (e) {
			var n = e.target.parentNode.parentNode.parentNode;
			url = document.getElementById('copy-url');
			url.innerHTML = "https://" + window.location.host + window.location.pathname + "#" + n.id;
			url.focus();
			url.select();
			document.execCommand("copy");
			url.innerHTML = "";

			var copied = document.createElement("span");
			copied.classList.add('copied');
			copied.addEventListener('animationend', function () {
				copied.remove();
			})
			copied.innerText = "Copied URL to Clipboard";

			e.target.parentNode.parentNode.appendChild(copied);
			copied.classList.add('fade');
		});
	});

	function getReadItems() {
		var readItems = JSON.parse(localStorage.getItem('ItemsRead'));

		if (!readItems) {
			readItems = [];
		}

		return readItems;
	}

	var currentArticles = getCurrentArticleMeta();

	document.querySelectorAll('.tl__block .read').forEach(e => {
		e.addEventListener('click', function (e) {

			var articleNode = e.target.parentNode.parentNode.parentNode;
			var articleID = articleNode.id;
			var versionID = document.querySelector('#' + articleID + ' .version').innerText;

			var itemsRead = getReadItems();

			var existing = itemsRead.find(function (e) {
				return e.id == articleID;
			});


			var unread = false;
			if (existing) {
				var existingInd = existing.versions.findIndex(function (e) {
					return e == versionID;
				});
				if (existingInd > -1) {
					existing.versions.splice(existingInd, 1);
					unread = true;
				} else {
					existing.versions.push(versionID);
				}
			} else {
				itemsRead.push({
					id: articleID,
					versions: [versionID]
				});
			}

			localStorage.setItem('ItemsRead', JSON.stringify(itemsRead));

			if (unread) {
				delete articleNode.dataset['read'];
			} else {
				articleNode.dataset['read'] = true;

				if (!fr.checked) {
					articleNode.dataset['filter'] = true;
				}
			}

			updateReadCount(currentArticles, itemsRead);
		});
	});


	function applyOnArticleMatch(currentArticles, readItems, callback) {
		readItems.forEach(function (e) {
			if (e.versions.length > 0) {
				var article = currentArticles.find(function (ce) {
					return ce.id == e.id;
				});

				if (article) {
					var isSameVer = e.versions.find(function (ce) {
						return ce == article.version;
					});

					if (isSameVer) {
						if (callback) {
							callback(article);
						}
					}
				}
			}
		});
	}

	function updateReadCount(currentArticles, readItems, callback) {

		var count = 0;
		if (readItems) {
			applyOnArticleMatch(currentArticles, readItems, function (article) {
				count++;
				if (callback) {
					callback(article);
				}
			});
		}

		document.getElementById('count-read').innerText = count;
	}

	function getCurrentArticleMeta() {
		return [].slice.call(document.querySelectorAll('.tl__block[id]')).map(function (e) {

			return {
				id: e.id,
				version: e.querySelector('.version').innerText,
				el: e,
				category: [].slice.call(e.classList)[2]
			};
		});
	}




	document.getElementById('count-announcement').innerText = currentArticles.reduce(function (a, e) {
		if (e.category == 'announcement') {
			a++
		}
		return a
	}, 0);

	document.getElementById('count-background').innerText = currentArticles.reduce(function (a, e) {
		if (e.category == 'background') {
			a++
		}
		return a
	}, 0);

	document.getElementById('count-market').innerText = currentArticles.reduce(function (a, e) {
		if (e.category == 'market') {
			a++
		}
		return a
	}, 0);


	document.getElementById('LatestPage').addEventListener('click', function () {
		location.reload(true)
	});

	function getUnfilteredCategoryArticles() {
		return currentArticles.filter(function (e) {
			switch (e.category) {
				case 'announcement':
					{
						if (fa.checked) {
							return true;
						}
					}
					break;
				case 'market':
					{
						if (fm.checked) {
							return true;
						}
					}
					break;
				case 'background':
					{
						if (fb.checked) {
							return true;
						}
					}
					break;
			}
			return false;
		});
	}

	fa.addEventListener('change', function () {
		updateFilter('announcement', !fa.checked, fr.checked);
		updateReadCount(getUnfilteredCategoryArticles(), readItems);
	});

	fb.addEventListener('change', function () {
		updateFilter('background', !fb.checked, fr.checked);
		updateReadCount(getUnfilteredCategoryArticles(), readItems);
	});

	fm.addEventListener('change', function () {
		updateFilter('market', !fm.checked, fr.checked);
		updateReadCount(getUnfilteredCategoryArticles(), readItems);
	});

	fr.addEventListener('change', function () {
		updateFilter('announcement', !fa.checked, fr.checked);
		updateFilter('background', !fb.checked, fr.checked);
		updateFilter('market', !fm.checked, fr.checked);
		updateReadCount(getUnfilteredCategoryArticles(), readItems);
	});


	function updateFilter(cat, set, showRead) {
		currentArticles.forEach(function (e) {
			if (!cat || e.category == cat) {
				if (set) {
					e.el.dataset['filter'] = true;
				} else {
					var isread = e.el.dataset['read'];

					if (isread) {
						if (showRead) {
							delete e.el.dataset['filter'];
						} else {
							e.el.dataset['filter'] = true;
						}
					} else {
						delete e.el.dataset['filter'];
					}
				}
			}
		});
	}

	function close() {
		document.querySelector(".lightbox-target").classList.remove("active");
	}

	var readItems = getReadItems();
	updateReadCount(currentArticles, readItems, function (article) {
		article.el.dataset['read'] = true;
		article.el.dataset['filter'] = true;
	});

	updateFilter('announcement', !fa.checked, fr.checked);
	updateFilter('background', !fb.checked, fr.checked);
	updateFilter('market', !fm.checked, fr.checked);
	updateReadCount(getUnfilteredCategoryArticles(), readItems);
	document.addEventListener('load', lazyLoad);

})();

function getLastNum() {
	return [].slice.call(document.querySelectorAll('.tl__block[id]')).map(e => +e.id.substr(1)).sort((a, b) => a - b).reverse()[0]
}