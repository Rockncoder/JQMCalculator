/*
** jQuery Mobile Calculator
**
 */

var RocknCoder = RocknCoder || {};
RocknCoder.Pages = RocknCoder.Pages || {};

// handles all of the page events and dispatches them to a handler, if one exists
RocknCoder.Pages.Kernel = function (event) {
	var that = this,
		eventType = event.type,
		pageName = $(this).attr("data-rockncoder-jspage");

	// if you want to see jQuery Mobile's page event lifecycle, uncomment the line below
	//console.log("Kernel: "+pageName+", "+eventType);
	if (RocknCoder && RocknCoder.Pages && pageName && RocknCoder.Pages[pageName] && RocknCoder.Pages[pageName][eventType]) {
		RocknCoder.Pages[pageName][eventType].call(that);
	}};

// hooks all of the page events
// uses "live" so that the event will stay hooked even if new elements are added later
RocknCoder.Events = function () {
	$("div[data-rockncoder-jspage]").on(
		'pagebeforecreate pagecreate pagebeforeload pagebeforeshow pageshow pagebeforechange pagechange pagebeforehide pagehide pageinit',
		RocknCoder.Pages.Kernel).on(
		"pageinit", RocknCoder.hideAddressBar);
}();

// this is the handler for all page events
RocknCoder.Pages.calculator = function(){
	var pageshow = function () {
		RocknCoder.Display.init($("#displayControl")[0]);
		$("button").tap(function(event){
			var key = $(this).attr("data-rockncoder-tag"),
				id = this.id;
			event.preventDefault();

			switch(id){
				case "key0":
				case "key1":
				case "key2":
				case "key3":
				case "key4":
				case "key5":
				case "key6":
				case "key7":
				case "key8":
				case "key9":
				case "keyDecimalPoint":
					RocknCoder.Display.enterDigit(key);
					break;
				case "keyC":
					RocknCoder.Display.clearDisplay();
					break;
				case "keyCe":
					RocknCoder.Display.clearError();
					break;
				case "keyAdd":
					RocknCoder.Display.setOperator("+");
					break;
				case "keySubtract":
					RocknCoder.Display.setOperator("-");
					break;
				case "keyMultiply":
					RocknCoder.Display.setOperator("*");
					break;
				case "keyDivide":
					RocknCoder.Display.setOperator("/");
					break;
				case "keyEquals":
					RocknCoder.Display.setOperator("=");
					break;
			}
			return false;
		});
	},
	pagehide = function () {
		$("button").unbind("tap");
	};
	return {
		pageshow: pageshow,
		pagehide: pagehide
	};
}();

// Display in this case refers to the input type="text" above the buttons
RocknCoder.Display = function() {
	var $displayControl,
		operator,
		operatorSet = false,
		equalsPressed = false,
		accumulator = null,

		add = function(x, y) {
			return x + y;
		},
		divide = function(x, y) {
			if (y == 0) {
				alert("Can't divide by 0");
				return 0;
			}
			return x / y;
		},
		multiply = function(x, y) {
			return x * y;
		},
		subtract = function(x, y) {
			return x - y;
		},
		calculate = function() {
			if (!operator || accumulator == null) return;
			var currNumber = parseFloat($displayControl.value),
				newVal = 0;

			switch (operator) {
				case "+":
					newVal = add(accumulator, currNumber);
					break;
				case "-":
					newVal = subtract(accumulator, currNumber);
					break;
				case "*":
					newVal = multiply(accumulator, currNumber);
					break;
				case "/":
					newVal = divide(accumulator, currNumber);
					break;
			}
			setValue(newVal);
			accumulator = newVal;
		},
		setValue = function(val) {
			$displayControl.value = val;
		},
		getValue = function(){
			return $displayControl.value + "";
		},
		// clears all of the digits
		clearDisplay = function() {
			accumulator = null;
			equalsPressed = operatorSet = false;
			setValue("0");
		},
		// removes the last digit entered in the display
		clearError = function(){
			var display = getValue();
			// if the string is valid, remove the right most character from it
			// remember: to be valid, must have a value and length
			if(display){
				display = display.slice(0, display.length - 1);
				display = display? display: "0";
				setValue(display);
			}
		},
		// handles a numeric or decimal point key being entered
		enterDigit = function(buttonValue) {
			var currentlyDisplayed = $displayControl.value;
			// keep the max digits to a reasonable number
			if(currentlyDisplayed.length < 20){
				if (operatorSet == true || currentlyDisplayed === "0") {
					setValue("");
					operatorSet = false;
				}
				// already pressed a decimal point
				if(buttonValue === "." && currentlyDisplayed.indexOf(".")>= 0){
					return;
				}
				setValue($displayControl.value + buttonValue);
			}
		},
		setOperator = function(newOperator) {
			if (newOperator === "=") {
				equalsPressed = true;
				calculate();
				return;
			}
			if (!equalsPressed) calculate();
			equalsPressed = false;
			operator = newOperator;
			operatorSet = true;
			accumulator = parseFloat($displayControl.value);
		},
		// set the pointer to the HTML element which displays the text
		init = function(currNumber) {
			$displayControl = currNumber;
		};
	// all of the functions below are visible outside of this function
	return {
		clearDisplay: clearDisplay,
		clearError: clearError,
		enterDigit: enterDigit,
		setOperator: setOperator,
		init: init
	};
}();

