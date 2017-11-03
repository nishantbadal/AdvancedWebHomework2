// Global variables
let myjson;
let dateString;
const key = "49zkCd7Z3bP0Ja4u0u45dReLJbGxFkiV50DgkFcJ";
let checked = false;
let date;
let speed;

// Load data when page is ready
$(document).ready(function () {
    speed = 0;
    date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    dateString = year + "-" + month + "-" + day;
    
    // Get data and store it
    $.getJSON("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + dateString + "&api_key=" + key, function (json) {
        myjson = json;
        notHazardous(speed);
    });
    
    // Function to track whether hazardous objects is checked
    $('#isHazSelected').click(function () {
        if (checked == false) {
            checked = true;
        }
        else {
            checked = false;
        }
        if (checked == true) {
            hazardous(speed);
        }
        else {
            notHazardous(speed);
        }
    });
});

// If hazardous is not checked
function hazardous(minSpeed) {
    $("tbody").empty();
    let tr;
    for (let i = 0; i < 7; i++) {
        let neo = myjson["near_earth_objects"];
        let tempDate = new Date();
        tempDate.setDate(date.getDate() + i);
        day = tempDate.getDate();
        month = tempDate.getMonth() + 1;
        year = tempDate.getFullYear();
        if (day < 10) {
            dateString = year + "-" + month + "-0" + day;
        }
        else {
            dateString = year + "-" + month + "-" + day;
        }
        let dayArr = neo[dateString];
        for (var j = 0; j < dayArr.length; j++) {
            if (dayArr[j]["is_potentially_hazardous_asteroid"] == true && dayArr[j]["close_approach_data"][0]["relative_velocity"]["miles_per_hour"] >= minSpeed) {
                let tr = $('<tr/>');
                tr.append("<td>" + dayArr[j]["close_approach_data"][0]["close_approach_date"] + "</td>");
                tr.append("<td>" + dayArr[j]["is_potentially_hazardous_asteroid"] + "</td>");
                tr.append("<td>" + dayArr[j]["close_approach_data"][0]["relative_velocity"]["miles_per_hour"] + "</td>");
                tr.append("<td>" + dayArr[j]["estimated_diameter"]["feet"]["estimated_diameter_max"] + "</td>");
                $('tbody').append(tr);
            }
        }
    }
}

// If hazardous is checked
function notHazardous(minSpeed) {
    $("tbody").empty();
    let tr;
    for (let i = 0; i < 7; i++) {
        let neo = myjson["near_earth_objects"];
        let tempDate = new Date();
        tempDate.setDate(date.getDate() + i);
        day = tempDate.getDate();
        month = tempDate.getMonth() + 1;
        year = tempDate.getFullYear();
        if (day < 10) {
            dateString = year + "-" + month + "-0" + day;
        }
        else {
            dateString = year + "-" + month + "-" + day;
        }
        let dayArr = neo[dateString];
        for (var j = 0; j < dayArr.length; j++) {
            if (dayArr[j]["close_approach_data"][0]["relative_velocity"]["miles_per_hour"] >= minSpeed) {
                let tr = $('<tr/>');
                tr.append("<td>" + dayArr[j]["close_approach_data"][0]["close_approach_date"] + "</td>");
                tr.append("<td>" + dayArr[j]["is_potentially_hazardous_asteroid"] + "</td>");
                tr.append("<td>" + dayArr[j]["close_approach_data"][0]["relative_velocity"]["miles_per_hour"] + "</td>");
                tr.append("<td>" + dayArr[j]["estimated_diameter"]["feet"]["estimated_diameter_max"] + "</td>");
                // Highlight dangerous NEOs
                if (dayArr[j]["is_potentially_hazardous_asteroid"] == true) {
                    tr.css("background-color", "#ffff00");
                }
                $('tbody').append(tr);
            }
        }
    }
}

// Sets min speed using slider
$(function () {
    $("#slider-range-min").slider({
        range: "min"
        , value: 0
        , min: 0
        , max: 60000
        , slide: function (event, ui) {
            $("#amount").val(ui.value);
            speed = ui.value;
            if (checked) {
                hazardous(speed);
            }
            else {
                notHazardous(speed);
            }
        }
    });
    $("#amount").val($("#slider-range-min").slider("value") + " mph");
});