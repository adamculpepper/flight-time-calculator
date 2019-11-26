// Flight Time Calculator
// https://adamculpepper.github.io/flight-time-calculator
// https://github.com/adamculpepper/flight-time-calculator

// if (!window.Promise){
// 	alert('old browser, upgrade');
// }

if (!navigator.onLine) {
	alert('offline');
}

$(function() {
	var today = moment();
	var tomorrow = moment().add(1, 'day');

	var isToday = function(input) {
		return moment(input).isSame(today, 'day');
	};

	var isTomorrow = function(input) {
		return moment(input).isSame(tomorrow, 'day');
	};

	var calculateWidths = function(field) {
		var value = field.val();
		var ghost = field.next('.ghost-value');
		ghost.text(value);

		var width = ghost.width() + 10;
		field.width(width);
	}

	var calculateResult = function() {
		var dateFlight = $('#date-flight-dummy').val();
		var timeBoarding = $('#time-boarding').val();
		var timeDrive = $('#time-drive').val();
		var timeDriveType = $('#time-drive').parent().find('.toggle-hours-minutes').attr('data-time-type');
		var timeSecurity = $('#time-security').val();
		var timeSecurityType = $('#time-security').parent().find('.toggle-hours-minutes').attr('data-time-type');
		var datetime = dateFlight + ' ' + timeBoarding;

		if (isToday(dateFlight)) {
			var result = 'today @ ' + moment(timeBoarding, 'HH:mm A').subtract(timeDrive, timeDriveType).subtract(timeSecurity, timeSecurityType).format('h:mm A');
		} else if (isTomorrow(dateFlight)) {
			var result = 'tomorrow @ ' + moment(timeBoarding, 'HH:mm A').subtract(timeDrive, timeDriveType).subtract(timeSecurity, timeSecurityType).format('h:mm A');
		} else {
			var result = moment(datetime, 'MM/DD/YYYY HH:mm A').subtract(timeDrive, timeDriveType).subtract(timeSecurity, timeSecurityType).format('MM/DD/YYYY @ h:mm A');
		}

		$('#time-result').text('Leave by ' + result);
	}

	var init = function() {
		$('.datepicker').val(moment().add(1, 'days').format('MM/DD/YYYY'));

		calculateResult();
	}

	$('.form-control').on('keyup', function() {
		calculateWidths($(this));
	});

	$('.form-control').on('change', function() {
		calculateResult();
	});

	$('.form-control').each(function() {
		calculateWidths($(this));
	});

	$('#date-flight').on('click', function() {
		$(".datepicker").datetimepicker("show");
	});

	$('.toggle-hours-minutes').on('click', function() {
		var oldValue = $(this).attr('data-time-type');

		if (oldValue == 'minutes') {
			var newValue = 'hours';
		} else if (oldValue == 'hours') {
			var newValue = 'minutes';
		}

		$(this).text(newValue);
		$(this).attr('data-time-type', newValue);
		calculateResult();
	});

	$('.timepicker').datetimepicker({
		format: 'HH:mm A',
		format: 'LT'
	}).on('dp.change', function(e) {
		calculateResult();
	});

	$('.datepicker').datetimepicker({
		format: 'MM/DD/YYYY',
		format: 'L',
		//widgetParent: 'body',
		minDate: moment().millisecond(0).second(0).minute(0).hour(0), // crazy fix: https://github.com/Eonasdan/bootstrap-datetimepicker/issues/1302#issuecomment-141923309
	}).on('dp.change', function(e) {
		var date = moment(e.date).format('MM/DD/YYYY');
		$('#date-flight').val(date);

		if (isToday(e.date)) {
			$('#date-flight').val('today');
		} else if (isTomorrow(e.date)) {
			$('#date-flight').val('tomorrow');
		}

		calculateResult();
	}).on('dp.show', function (e) {
		var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last');
		var target = $('#date-flight');
		var position = target.offset();
		var parent = target.parent();
		var parentPos = target.offset();
		var width = target.width();
		var parentWid = target.width();
		var targetHeight = target.outerHeight();

		datepicker.appendTo('body');
		datepicker.css({
			position: 'absolute',
			top: position.top + targetHeight,
			bottom: 'auto',
			left: position.left,
			right: 'auto'
		});

		// if datepicker is wider than the thing it is attached to then move it so the centers line up
		if (parentPos.left + parentWid < position.left + width) {
			var newLeft = parentPos.left;
			newLeft += parentWid / 2;
			newLeft -= width / 2;
			datepicker.css({left: newLeft});
		}
	});

	init();
});
