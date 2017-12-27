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

function handleMenu() {
  var menuToggle = document.getElementById("open-menu");
  var menu = document.getElementById("menu")

  window.onclick = function(event) {
    if(!event.target.matches("#open-menu")) {
        menu.classList.remove("active");
    }
  }
  menuToggle.onclick = function() {
      menu.classList.toggle("active");
  };
}

setDaysLeft("2019-04-19");
handleMenu();
