(function () {


	document.querySelectorAll("img[data-activate]").forEach(e => {
		e.addEventListener('click', function () {
			activate(e.dataset.activate)
		});
	})

	document.querySelector(".lightbox-close").addEventListener('click', close)

	function activate(id) {
		document.querySelector(".lightbox-target").classList.add("active");

		document.querySelectorAll(".lightbox-target img").forEach(e => {
			if (e.id === id) {
				e.classList.add('vis');
			} else {
				e.classList.remove('vis');
			}
		});
	}

	document.querySelectorAll('.tl__img').forEach(e => {
		e.addEventListener('click', function (e) {
			var n = e.target.parentNode;
			if (n) {
				updateFilter([n], !n.dataset['filter']);
			}
		})
	});

	var ta = document.querySelectorAll('.announcement'),
		tb = document.querySelectorAll('.background'),
		tm = document.querySelectorAll('.market');

	var fa = document.getElementById('toggle-announcement'),
		fb = document.getElementById('toggle-background'),
		fm = document.getElementById('toggle-market');


	document.getElementById('count-announcement').innerText = ta.length;
	document.getElementById('count-background').innerText = tb.length;
	document.getElementById('count-market').innerText = tm.length;

	document.getElementById('LatestPage').addEventListener('click', function () {
		location.reload(true)
	});

	fa.addEventListener('change', function (e) {
		updateFilter(ta, !e.target.checked);
	});

	fb.addEventListener('change', function (e) {
		updateFilter(tb, !e.target.checked);
	});

	fm.addEventListener('change', function (e) {
		updateFilter(tm, !e.target.checked);
	});

	function updateFilter(arr, set) {
		if (arr && arr.forEach) {
			arr.forEach(e => {
				if (set) {
					e.setAttribute('data-filter', 'on')
				} else {
					e.removeAttribute('data-filter')
				}
			});
		}

	}

	updateFilter(ta, !fa.checked);
	updateFilter(tb, !fb.checked);
	updateFilter(tm, !fm.checked);

	function close() {
		document.querySelector(".lightbox-target").classList.remove("active");
	}
})();

function getLastNum() {
	return [].slice.call(document.querySelectorAll('h3[id]')).map(e => +e.id.substr(1)).sort((a, b) => a - b).reverse()[0]
}