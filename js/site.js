function setDaysLeft(endtime){
  var timeleft = Date.parse(endtime) - Date.parse(new Date());
  var days = Math.floor( timeleft/(1000*60*60*24) );

  var daysDiv = document.getElementById("days");
  daysDiv.innerHTML = days;

  if(timeleft<=0){
    var togo = document.getElementById("togo");
    daysDiv.innerHTML = "We've done it!!";
    togo.innerHTML = "You've missed the party!!!";
  }
}
setDaysLeft("2019-04-19");