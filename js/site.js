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

  $(".currentYear").text(new Date().getFullYear());
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

function submitForm($form){
  if(null === sessionStorage.getItem("formSubmitted")){
    $.ajax({
      type: "POST",
      url: window.location.port === "1337" ? "mockSubmission" : $form.attr("action") + "?rsvp=true",
      data: $form.serialize(),
      dataType: "json",
      timeout: 10000
    }).fail(function(){
      alert("We're sorry, please try again later");
    }).done(function(json){
      sessionStorage.setItem("formSubmitted", true);
      alert("Thanks for the update!");
    });
  }else{
    alert("Thanks, but you've already submitted your RSVP today. Try again tomorrow!");
  }
}

function createNewAttendanceRows($form, totalRows){
  var $defaultRow = $form.find(".row.default");
  var currentRows = $form.find(".rsvp-info .row").length;

  if(currentRows > totalRows){
    var removedCount = 0;
    $($form.find(".rsvp-info .row.dynamic").get().reverse()).each(function(){
      if(removedCount < (currentRows - totalRows)){
        $(this).remove();
      }
      removedCount++;
    });
  }else{
    for(var i=currentRows; i<totalRows; i++){
      var $newRow = $defaultRow.clone();
      
      $newRow.removeClass("default");
      $newRow.addClass("dynamic");
      $newRow.attr("count", i);
      $newRow.find("fieldset.input-group.attendance label").remove();
      $newRow.find("fieldset.input-group.attendance select").remove();
      $newRow.find("label").each(function() {
        $label = $(this);
        $label.attr("for", $label.attr("for") + "-" + i);
      })
      $newRow.find("input, select").each(function() {
        $input = $(this);
        $input.attr("id", $input.attr("id") + "-" + i);
        $input.attr("name", $input.attr("name") + "-" + i);
      })
      
      $defaultRow.parent().append($newRow);
    }
   }
}

function handleForm(){
  var $form = $("form.rsvp-form");
  var $rsvpInfo = $form.find(".rsvp-info");

  $form.find("input[name='attendance']").click(function(){
    var willAttend = $(this).val() === "Yes" ? true : false;

    if(willAttend){
      $rsvpInfo.removeClass("hidden");
      $rsvpInfo.find(".attendanceDependant").each(function(){
        $(this).removeAttr("disabled");
      });
    }else{
      $rsvpInfo.addClass("hidden");
      $rsvpInfo.remove(".row.dynamic");

      $rsvpInfo.find(".row.dynamic").each(function(){
        $(this).remove();
      });

      $rsvpInfo.find(".attendanceDependant").each(function(){
        $(this).attr("disabled", "true");
        $(this).val("");
      });
    }
  });

  $form.find("select[name='numberAttending']").change(function(){
    var totalRows = parseInt($(this).val());

    if(totalRows !== 1){
      createNewAttendanceRows($form, totalRows);
    }else{
      $rsvpInfo.find(".row.dynamic").each(function(){
        $(this).remove();
      });
    }
  });

  $form.find("button.rsvp").click(function() {
    $form.find("textarea#notes").val($form.find("textarea#notes").val().trim());

    if($form[0].checkValidity()){
      submitForm($form);
    }else{
      console.log("form is invalid");
    }
  });
}

setDaysLeft("2019-04-19");
handleMenu();
handleForm();