<?php
	echo "text";

 	//this function sanitizes the inputs to make sure nothing terrible is happening
	function sanitize($val){
		$val = trim($val);
		$val = strip_tags($val, "<h1><h2><h3><p><img><a><strong><em><ol><ul><li>");
		$val = stripslashes($val);
	}
	if(isset($_POST['rsvp'])){
		$to = "phil.sobus@gmail.com";
		$from = "us@jenandphilgetmarried.com";
		$subject = "RSVP";
		$attendance = sanitize($_POST['attendance']);
		$name = sanitize($_POST['name']);
		$meal = sanitize($_POST['meal']);
		$number = sanitize($_POST['number']);
		$email = sanitize($_POST['email']);

		$output = "Name: ".$name."\n";
		$output = "Status: ".$attendance."\n";
		$output .= "Meal: ".$meal."\n";
		$output .= "Number Attending: ".$number."\n";
		$output .= "Email: ".$email."\n";

		$headers = 'From: '.$from;

		if($_GET['test'] == 'test') {
			echo $output;
		}else{
		//	mail($to, $subject, $output, $headers);
		}
	}
?>