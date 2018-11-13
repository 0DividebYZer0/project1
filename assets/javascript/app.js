$(document).ready(function(){
    var database = firebase.database();
    var gameStats = database.ref("/stats");

    $('.modal').modal({
        dismissible: false,
        onCloseEnd: function(){timer.run()}
    });
    $('.modal').modal('open');  
    $("#timerNum").text(timer.startNumber);
  });

  var timer = {
    startNumber: 120,
    intervalId: '',
    run: function () {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.decrement, 1000);
    },
    decrement: function () {
        timer.startNumber--;
        $("#timerNum").text(timer.startNumber);
        if (timer.startNumber === 0) {
            this.stop();
            //do something here after timer hits zero
        }
    },
    stop: function () {
        clearInterval(this.intervalId);
    }
};