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

function checkCode(rsvpCode){
  return rsvpCode === "LLAP041919";
}

function checkNames($form){
  var isValid = true;
  var currentName = "";
  $form.find(".input-group.name input").each(function(){
    var name = $(this).val();
    if(currentName === name){
      isValid = false;
    }
    currentName = name;
  });
  return isValid;
}

function checkForm($form) {
  if(null === sessionStorage.getItem("formSubmitted")){
    var rsvpCode = $form.find("input[name='code']").val();
    if($form[0].checkValidity()){
      var isValidNames = checkNames($form);
      var isValidCode = checkCode(rsvpCode);
      var isValidForm = isValidNames && isValidCode;

      if(!isValidCode){
        window.navigator.vibrate([100,75,100,75,100]);
        alert("Incorrect RSVP Code");
      }
      if(!isValidNames){
        window.navigator.vibrate([100,75,100,75,100]);
        alert("Dulicate Attendee Names");
      }
      if(isValidForm){
        submitForm($form, "?rsvp=true");
      }
    }else{
      window.navigator.vibrate([100,75,100,75,100]);
    }
  }else{
    alert("Thanks, but you've already submitted your RSVP today. Try again tomorrow!");
  }
}

function submitForm($form, formAppend){  
  $.ajax({
    type: "POST",
    url: window.location.port === "1337" ? "mockSubmission" : $form.attr("action") + formAppend,
    data: $form.serialize(),
    dataType: "json",
    timeout: 10000
  }).fail(function(){
    alert("We're sorry, please try again later");
  }).done(function(json){
    $.ajax({
      type: "POST",
      url: "https://script.google.com/macros/s/AKfycbz4xmgPpda8btvU18YjcFOfFHfaxQq5874fpgTe5rAt5j_s0ss/exec",
      data: new FormData($form[0]),
      dataType: "json",
      processData: false,
      contentType: false,
      timeout: 10000
    }).fail(function(){
      alert("We're sorry, please try again later");
    }).done(function(json){
      sessionStorage.setItem("formSubmitted", true);
      alert("Thanks for the update!");
    });
  });
}

function createNewAttendanceRows($form, totalRows){
  var $defaultRow = $form.find(".row.default");
  var currentRows = $form.find(".rsvp-info .row.dynamic").length + 1;

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
  var $formButton = $form.find("button.rsvp");

  $form.find("input[name='attendance']").click(function(){
    var willAttend = $(this).val() === "Yes" ? true : false;

    $form.find("> .row.hidden").removeClass("hidden");
    $rsvpInfo.removeClass("hidden");
    $formButton.removeClass("hidden");

    if(willAttend){
      $form.find(".notesLabel").html($form.find(".notesLabel").attr("data-attending"));
      $form.attr("data-attend", "true");
      $rsvpInfo.find(".row.numberAttending").removeClass("hidden");
      $rsvpInfo.find(".input-group.meal").removeClass("hidden");
      $rsvpInfo.find(".attendanceDependant").each(function(){
        $(this).removeAttr("disabled");
      });
      $form.find("select[name='numberAttending']").prop("selectedIndex", 0);
    }else{
      $form.find(".notesLabel").html($form.find(".notesLabel").attr("data-notAttending"));
      $form.attr("data-attend", "false");
      $rsvpInfo.find(".row.numberAttending").addClass("hidden");
      $rsvpInfo.find(".input-group.meal").addClass("hidden");
      $rsvpInfo.remove(".row.dynamic");

      $rsvpInfo.find(".row.dynamic").each(function(){
        $(this).remove();
      });

      $rsvpInfo.find(".attendanceDependant").each(function(){
        $(this).attr("disabled", "true");
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

  $formButton.click(function() {
    $form.find("textarea#notes").val($form.find("textarea#notes").val().trim());

    checkForm($form);
  });
}

setDaysLeft("2019-04-19");
handleMenu();
handleForm();