var database = firebase.database();
var locationsRef = database.ref("/locations");

$(document).on("click", ".formSubmit", submitForm);

function submitForm(event){
    event.preventDefault()

    var location = {
        lat:$("#lat").val(), 
        lng:$("#lng").val(), 
        id:$("#id").val(),
        site:$("#site").val(),
        clues:[$("#clue1").val()]
    };
    location.clues.push($("#clue2").val())
    location.clues.push($("#clue3").val())

    locationsRef.push(location)


}