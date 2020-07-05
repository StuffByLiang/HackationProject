var base_color = "white";
var active_color = "rgb(237, 40, 70)";

var child = 1;
var length = $(".form section").length - 1;
$("#prev").hide();
$("#submit").hide();

$(".form section").not("section:nth-of-type(1)").hide();
$(".form section").not("section:nth-of-type(1)").css('transform','translateX(100px)');

var svgWidth = length * 200 + 24;
$("#svg_wrap").html(
  '<svg version="1.1" id="svg_form_time" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ' +
    svgWidth +
    ' 24" xml:space="preserve"></svg>'
);

function makeSVG(tag, attrs) {
  var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (var k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

for (i = 0; i < length; i++) {
  var positionX = 12 + i * 200;
  var rect = makeSVG("rect", { x: positionX, y: 9, width: 200, height: 6 });
  document.getElementById("svg_form_time").appendChild(rect);
  // <g><rect x="12" y="9" width="200" height="6"></rect></g>'
  var circle = makeSVG("circle", {
    cx: positionX,
    cy: 12,
    r: 12,
    width: positionX,
    height: 6
  });
  document.getElementById("svg_form_time").appendChild(circle);
}

var circle = makeSVG("circle", {
  cx: positionX + 200,
  cy: 12,
  r: 12,
  width: positionX,
  height: 6
});
document.getElementById("svg_form_time").appendChild(circle);

$("circle:nth-of-type(1)").css("fill", active_color);

$(".form .button").click(function () {
  $("#svg_form_time rect").css("fill", active_color);
  $("#svg_form_time circle").css("fill", active_color);
  var id = $(this).attr("id");
  if (id == "next") {
    $("#prev").show();

    if(child == length-1) {
      $("#next").hide();
      $("#submit").show();
    }

    if (child <= length) {
      child++;
    }
  } else if (id == "prev") {
    $("#next").show();
    if (child > 1){
      child--;
    }

    if(child == 1) {
      $("#prev").hide();
    }

    if (child == length-1) {
      $("#submit").hide();
      $("#next").show();
    }
  } 
  showNew();
});

let submitted = 0;

$(".form #submit").click(function () {
  if(submitted) return;
  submitted = 1;

  if(window.location.pathname.includes("survey")) {
    surveyFormSubmit();
  } else {
    hostFormSubmit();
  }

  $("#prev").hide();
  $("#submit").hide();
});

function surveyFormSubmit() {
  let restaurants = [];
  let activities = [];
  let dietaryRestrictions = [];

  $(".food :checkbox").each((i, element) => {
    if(element.checked) {
      restaurants.push(element.id);
    }
  });

  if ($("#otherRestrictions").val()) {
    dietaryRestrictions.push($("#otherRestrictions").val())
  }

  $(".restrictions :checkbox").each((i, element) => {
    if(element.checked) {
      dietaryRestrictions.push(element.id);
    }
  });

  if ($("#otherPreferances").val()) {
    restaurants.push($("#otherPreferances").val())
  }

  $(".activities :checkbox").each((i, element) => {
    if(element.checked) {
      activities.push(element.id);
    }
  });

  if ($("#otherToDos").val()) {
    activities.push($("#otherToDos").val())
  }

  let sendData = {
    "age": parseInt($("#ageSelector").val()),
    "dietaryRestrictions": dietaryRestrictions,
    "restaurants": restaurants,
    "activities": activities
  }

  console.log(sendData);

  $.post(`/api/${slug}/surveydata`, sendData)
    .done(function(data) {
      $("#link").text(`${window.location.origin}/${slug}/itinerary`);
      $("#link").attr("href", `${window.location.origin}/${slug}/itinerary`);

      $("#svg_form_time rect").css("fill", active_color);
      $("#svg_form_time circle").css("fill", active_color);
      child++;
      showNew();
  })
}

function hostFormSubmit() {
  let dates = $("#daterange").val();
  dates = dates === undefined ? "-" : dates;

  dates = dates.split("-");
  let startDate = dates[0];
  let endDate = dates[1];
  let stayLength = moment.duration(moment(dates[1]).diff(moment(dates[0]))).asDays() + 1;
  
  let sendData = {
    email: $("#email").val(),
    startDate,
    endDate,
    stayLength: parseInt(stayLength),
    groupBudget: parseInt($("#groupBudget").val()),
    location: $("#location").val(),
    groupSize: $("#groupSize").val(),
    latitude: $("#cityLat").val(), 
    longitude: $("#cityLng").val()
  }

  console.log(sendData);

  $.post("/api/hostdata", sendData)
    .done(function(data) {
        let slug = data.slug;
        $("#link").text(`${window.location.origin}/${slug}/survey`);
        $("#link").attr("href", `${window.location.origin}/${slug}/survey`);

        $("#svg_form_time rect").css("fill", active_color);
        $("#svg_form_time circle").css("fill", active_color);
        child++;
        showNew();
    })
}

function showNew() {
  var circle_child = child + 1;
  $("#svg_form_time rect:nth-of-type(n + " + child + ")").css(
    "fill",
    base_color
  );
  $("#svg_form_time circle:nth-of-type(n + " + circle_child + ")").css(
    "fill",
    base_color
  );
  var currentSection = $("section:nth-of-type(" + child + ")");
  currentSection.fadeIn();
  currentSection.css('transform','translateX(0)');
  currentSection.prevAll('section').css('transform','translateX(-100px)');
  currentSection.nextAll('section').css('transform','translateX(100px)');
  $('section').not(currentSection).hide();
}