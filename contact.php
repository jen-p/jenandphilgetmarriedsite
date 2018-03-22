<?php
	function sanitize($val){
		$val = trim($val);
		$val = strip_tags($val, "<h1><h2><h3><p><img><a><strong><em><ol><ul><li>");
		$val = stripslashes($val);
		return $val;
	}
	function json_response($code = 200, $message = null) {
	    header_remove();
	    http_response_code($code);
	    header("Cache-Control: no-cache");
	    header('Content-Type: application/json');
	    $status = array(
	        200 => '200 OK',
	        400 => '400 Bad Request',
	        422 => 'Unprocessable Entity',
	        500 => '500 Internal Server Error'
	    );
	    header('Status: '.$status[$code]);
	    return json_encode(array(
	        'status' => $code < 300,
	        'message' => $message
	    ));
	}
	function exception_error_handler($errno, $errstr, $errfile, $errline ) {
		echo json_response(500, $errstr);
	    exit();
	}
	set_error_handler("exception_error_handler");

	if(isset($_GET['rsvp'])){
		$to = "phil.sobus@gmail.com";
		$from = "us@jenandphilgetmarried.com";
		$subject = "RSVP From - ";
		$headers = 'From: '.$from;

		$subject .= sanitize($_POST['name']);

		$email = sanitize($_POST['email']);
		$output = "Email: ".$email."\n";

		$attendance = sanitize($_POST['attendance']);
		$output .= "Attending?: ".$attendance."\n\n";
		
		if(isset($_POST['notes'])){
			$notes = sanitize($_POST['notes']);
			$output .= "Notes: ".$notes."\n\n";
		}		
		if(isset($_POST['number'])){
			$number = sanitize($_POST['number']);
			$output .= "Number Attending: ".$number."\n";
		}
		if(isset($_POST['name']) && isset($_POST['meal'])){
			$name = sanitize($_POST['name']);
			$meal = sanitize($_POST['meal']);
			$output .= "Name: ".$name."\n";
			$output .= "Meal: ".$meal."\n\n";
		}
		
		for ($count=1; $count < 10; $count++) {
			if(isset($_POST['name-'.$count]) && isset($_POST['meal-'.$count])){
				$currentName = sanitize($_POST['name-'.$count]);
				$currentMeal = sanitize($_POST['meal-'.$count]);
				$output .= "Name: ".$currentName."\n";
				$output .= "Meal: ".$currentMeal."\n\n";
			}else{
				break;
			}
		}

		mail($to, $subject, $output, $headers);
		echo json_response(200, 'email sent'); 
	}	
?>