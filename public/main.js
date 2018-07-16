var socket = io.connect("http://localhost:5000", {
  'forceNew': true
});

function editName() {
  var source = event.target || event.srcElement;
  alert($(source).parent().html())
}

function changeType() {
  var source = event.target || event.srcElement;

  if ($(source).attr('class').indexOf("unknown") >= 0) {
    $(source).attr('class', "fas fa-shield-alt known")
  } else {
    $(source).attr('class', "fa fa-question unknown")
  }
}


$(document).ready(function() {
  $('#device').editable();
});
