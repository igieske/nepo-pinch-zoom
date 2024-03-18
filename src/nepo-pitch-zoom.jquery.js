(function ($) {

	$.fn.nepoPinchZoom = function () {

		// Проверка на мобильное устройство
		if (!IS_MOBILE) return this;

		// Инициализация переменных
		var $img = $(this),
			startX = 0,
			startY = 0,
			startDist = 0,
			startScale = 1,
			currentScale = 1,
			panning = false;

		// Обработчики событий

		// Начало мультитач жеста
		$img.on('touchstart', function (e) {
			let touches = e.originalEvent.touches;

			// Проверка, что количество касаний равно 2
			if (touches.length !== 2) return;
			// Проверка, что оба касания внутри изображения
			if (!checkTouchesWithin(touches, this)) return;

			e.preventDefault();
			startX = e.originalEvent.touches[0].clientX;
			startY = e.originalEvent.touches[0].clientY;
			startDist = getDistance(e);
			startScale = currentScale;
			panning = false;

			// Анимация начала зума
			$img.css({
				transition: 'transform 0.2s ease-out'
			});
		});

		// Обновление мультитач жеста
		$img.on('touchmove', function (e) {
			let touches = e.originalEvent.touches;
			if (touches.length === 2) {

				// Проверка, что оба касания внутри изображения
				if (!checkTouchesWithin(touches, this)) return;

				e.preventDefault();
				var newDist = getDistance(e);
				var deltaScale = newDist / startDist;
				currentScale = startScale * deltaScale;
				if (currentScale > 4) {
					currentScale = 4;
				} else if (currentScale < 1) {
					currentScale = 1;
				}
				if (!panning) {
					var midX = (e.originalEvent.touches[0].clientX + e.originalEvent.touches[1].clientX) / 2;
					var midY = (e.originalEvent.touches[0].clientY + e.originalEvent.touches[1].clientY) / 2;
					var dx = midX - startX;
					var dy = midY - startY;
					$img.css({
						transform: 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale(' + currentScale + ')'
					});
				} else {
					var dx = e.originalEvent.touches[0].clientX - startX;
					var dy = e.originalEvent.touches[0].clientY - startY;
					$img.css({
						transform: 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale(' + currentScale + ')'
					});
				}
			} else if (e.originalEvent.touches.length === 1) {
				panning = true;
			}
		});

		// Конец мультитач жеста
		$img.on('touchend', function (e) {
			if (e.originalEvent.touches.length === 0) {
				panning = false;

				// Анимация возвращения к исходному положению
				$img.css({
					transition: 'transform 0.2s ease-in',
					transform: 'translate3d(0, 0, 0) scale(1)'
				});

				currentScale = 1;
			}
		});

		// Функции

		function getDistance(e) {
			let dx = e.originalEvent.touches[0].clientX - e.originalEvent.touches[1].clientX;
			let dy = e.originalEvent.touches[0].clientY - e.originalEvent.touches[1].clientY;
			return Math.sqrt(dx * dx + dy * dy);
		}

		// Проверка, находятся ли оба касания в пределах элемента
		function checkTouchesWithin(touches, el) {
			let isTouch1Within = touches[0].clientX >= el.getBoundingClientRect().left &&
				touches[0].clientX <= el.getBoundingClientRect().right &&
				touches[0].clientY >= el.getBoundingClientRect().top &&
				touches[0].clientY <= el.getBoundingClientRect().bottom;
			let isTouch2Within = touches[1].clientX >= el.getBoundingClientRect().left &&
				touches[1].clientX <= el.getBoundingClientRect().right &&
				touches[1].clientY >= el.getBoundingClientRect().top &&
				touches[1].clientY <= el.getBoundingClientRect().bottom;
			return isTouch1Within && isTouch2Within;
		}

		return this;
	};

})(jQuery);