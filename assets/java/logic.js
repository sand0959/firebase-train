var config = {
    apiKey: "AIzaSyADUPi3hRwoj3wigT7jn3ES2sfiT_MQpjo",
    authDomain: "fir-trainproject-58db0.firebaseapp.com",
    databaseURL: "https://fir-trainproject-58db0.firebaseio.com",
    projectId: "fir-trainproject-58db0",
    storageBucket: "fir-trainproject-58db0.appspot.com",
    messagingSenderId: "514266022613"
  };


  firebase.initializeApp(config);

var database = firebase.database();
var firstTrainTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainFormatted = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var tRemainder = '';
var minutesTillTrain = '';
var keyHolder = '';
var getKey = '';
var name = '';
var destination = '';

$(document).ready(function() {

    $("#add-train").on("click", function() {

        name = $('#name-input').val().trim();
        destination = $('#destination-input').val().trim();
        firstTrainTime = $('#first-train-time-input').val().trim();
        frequency = $('#frequency-input').val().trim();
        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        tRemainder = diffTime % frequency;
        minutesTillTrain = frequency - tRemainder;
        nextTrain = moment().add(minutesTillTrain, "minutes");
        nextTrainFormatted = moment(nextTrain).format("hh:mm");

        database.ref().push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime, 
            frequency: frequency,
            nextTrainFormatted: nextTrainFormatted,
            minutesTillTrain: minutesTillTrain
        });

        $('#name-input').val('');
        $('#destination-input').val('');
        $('#first-train-time-input').val('');
        $('#frequency-input').val('');

        return false;
    });
    database.ref().on("child_added", function(childSnapshot) {


        $('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.val() + "'" + ">" +
            "<td class='col-xs-3'>" + childSnapshot.val().name +
            "</td>" +
            "<td class='col-xs-2'>" + childSnapshot.val().destination +
            "</td>" +
            "<td class='col-xs-2'>" + childSnapshot.val().frequency +
            "</td>" +
            "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted + 
            "</td>" +
            "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain +
            "</td>" +
            "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-danger btn-sm'>" + "</td>" +
            "</tr>");
    }, function(errorObject) {
        console.log("Errors: " + errorObject.code)
    });

    $("body").on("click", ".remove-train", function() {
        $(this).closest('tr').remove();
        getKey = $(this).parent().parent().attr('id');
        database.child(getKey).remove();
    });

});
