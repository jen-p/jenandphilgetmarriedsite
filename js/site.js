function setDaysLeft(endtime){
  var timeleft = (new Date(endtime)).getTime() - (new Date()).getTime();
  var days = Math.ceil(timeleft / (1000*60*60*24));

  var daysDiv = document.getElementById("days");
  var togo = document.getElementById("togo");
  daysDiv.innerHTML = days;

  if(timeleft <= 0){
    daysDiv.innerHTML = "We've done it!!";
    togo.innerHTML = "You've missed the party!!!";
  }else if(days === 1){
    togo.innerHTML = "day to go";
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
