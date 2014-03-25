function Timers($window) {
	var requestAnimFrame = (function () {
		return $window.requestAnimationFrame ||
			$window.webkitRequestAnimationFrame ||
			$window.mozRequestAnimationFrame ||
			$window.oRequestAnimationFrame ||
			$window.msRequestAnimationFrame ||
			function (/* function */ callback, /* DOMElement */ element) {
				$window.setTimeout(callback, 1000 / 60);
			};
	})();

	var cancelAnimFrame = (function () {
		return $window.cancelAnimationFrame ||
			$window.webkitCancelAnimationFrame ||
			$window.mozCancelRequestAnimationFrame ||
			$window.oCancelRequestAnimationFrame ||
			$window.msCancelRequestAnimationFrame ||
			function (handle) {
				$window.clearTimeout(handle);
			};
	})();

	var requestTimeout = function (fn, delay) {
		var start = new Date().getTime(),
			handle = { };

		function loop() {
			var current = new Date().getTime(),
				delta = current - start;
			delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
		}

		handle.value = requestAnimFrame(loop);
		return handle;
	};

	var clearRequestTimeout = function (handle) {
		handle && handle.value && cancelAnimFrame(handle.value);
	};

	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			clearRequestTimeout(timeout);
			timeout = requestTimeout(function() {
				args = arguments || args;
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (immediate && !timeout) func.apply(context, args);
		};
	}

	return {
		requestTimeout: requestTimeout,
		clearTimeout: clearRequestTimeout,
		debounce: debounce
	}
}

window.Timers = Timers(window);