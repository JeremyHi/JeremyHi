let arrowBounce = function () {
  let arrow = $('#arrow-down');
  let arrowHeight = '32vh';
  let arrowHeightInt = parseInt(arrowHeight);
  while (true) {


    arrow.css('font-size', arrowHeightInt);
  }
}

var up = true;
var value = 24;
var increment = 0.1;
var ceiling = 25;

function PerformCalc() {
  if (up == true && value <= ceiling) {
    value += increment

    if (value == ceiling) {
      up = false;
    }
  } else {
      up = false
      value -= increment;

      if (value == 0) {
        up = true;
      }
  }

  document.getElementById('arrow-down').innerHTML = 'Value: ' + value + '<br />';
}
