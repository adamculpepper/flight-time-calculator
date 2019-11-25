// Flight Time Calculator
// https://github.com/adamculpepper/flight-time-calculator

if (!window.Promise){
	alert('old browser, upgrade');
}

if (!navigator.onLine) {
	alert('offline');
}

$(function() {
	$('.form-control').on('keyup', function() {
		calculateWidths($(this));
	});

	$('.form-control').on('change', function() {
		calculateResult();
	});

	var calculateWidths = function(field) {
		var value = field.val();
		var ghost = field.next('.ghost-value');
		ghost.text(value);

		var width = ghost.width() + 10;
		field.width(width);
	}

	$('.form-control').each(function() {
		calculateWidths($(this));
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
	});

	var calculateResult = function() {
		var timeBoarding = $('#time-boarding').val();
		var timeDrive = $('#time-drive').val();
		var timeDriveType = $('#time-drive').parent().find('.toggle-hours-minutes').attr('data-time-type');
		var timeSecurity = $('#time-security').val();
		var timeSecurityType = $('#time-security').parent().find('.toggle-hours-minutes').attr('data-time-type');
		var result = moment(timeBoarding, 'HH:mm A').subtract(timeDrive, timeDriveType).subtract(timeSecurity, timeSecurityType).format('H:mm A');

		$('#time-result').text('Leave by ' + result);
	}

	calculateResult();
});
