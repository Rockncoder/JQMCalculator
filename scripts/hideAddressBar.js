
var RocknCoder = RocknCoder || {};

RocknCoder.HideAddressBar = function () {
	var hideUrlBar = function () {
		if (!pageYOffset) {
			window.scrollTo(0, 1);
		}
	};

	if (navigator.userAgent.match(/Android/i)) {
		window.scrollTo(0, 0); // reset in case prev not scrolled
		var docHeight = $(document).height();
		var winHeight = window.outerHeight;

		if (winHeight > docHeight) {
			winHeight = winHeight / window.devicePixelRatio;
			$('BODY').css('height', winHeight + 'px');
		}
		window.scrollTo(0, 1);
	} else {
		addEventListener("load orientationchange", function () {
			setTimeout(hideUrlBar, 0);
			setTimeout(hideUrlBar, 500);
		}, false);
	}
};