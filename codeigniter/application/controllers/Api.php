<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */

	public function index(){
		echo "in api controller constructor";
	}

	//en
	//ar

	public function registerUser(){
		$this->load->database();

		$data = $_POST;

		$id = $data['sessionId'];

		$this->db->where('sessionId',$id);
		$q = $this->db->get('register');

		if ($q->num_rows() > 0) 
		{
			$this->db->where('sessionId',$id);
			$this->db->update('register',$data);

			$this->sendEmail();//send an email
		} else {
			$this->db->set('sessionId', $id);
			$this->db->insert('register',$data);
		}

		$response = array(
		    "register" => array(
							    	"result" => $query
								)
		);

		print_r(json_encode($response));

		return $response;
	}


	public function sendEmail(){
		$to = 'rob.shan.lone@gmail.com';
		$subject = "Thanks for Entering the competition";

		$htmlContent = '
		    <html>
		    <head>
		        <title>Welcome to CodexWorld</title>
		    </head>
		    <body>
		        <h1>Thanks you for joining with us!</h1>
		        <table cellspacing="0" style="border: 2px dashed #FB4314; width: 300px; height: 200px;">
		            <tr>
		                <th>Name:</th><td>CodexWorld</td>
		            </tr>
		            <tr style="background-color: #e0e0e0;">
		                <th>Email:</th><td>contact@codexworld.com</td>
		            </tr>
		            <tr>
		                <th>Website:</th><td><a href="http://www.codexworld.com">www.codexworld.com</a></td>
		            </tr>
		        </table>
		    </body>
		    </html>';

		// Set content-type header for sending HTML email
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

		// Additional headers
		$headers .= 'From: Visit Britain<sender@example.com>' . "\r\n";
		//$headers .= 'Cc: welcome@example.com' . "\r\n";
		//$headers .= 'Bcc: welcome2@example.com' . "\r\n";

		// Send email
		if(mail($to,$subject,$htmlContent,$headers)):
		    $successMsg = 'Email has sent successfully.';
		else:
		    $errorMsg = 'Email sending fail.';
		endif;

	}


	public function getListings($lang){
		 
		$this->load->database();
	
		$sql = "SELECT * FROM listings ORDER BY markerSize ASC";

		/*	
		$sql = "SELECT 
			AVG(`160812 - land registry avg soldprice jan 2010 - mar 2016`.`Value`) AS 'average'
			FROM
			`160812 - land registry avg soldprice jan 2010 - mar 2016`
			WHERE `160812 - land registry avg soldprice jan 2010 - mar 2016`.`Area` LIKE ?
			AND `160812 - land registry avg soldprice jan 2010 - mar 2016`.`Property` = ?
			AND `160812 - land registry avg soldprice jan 2010 - mar 2016`.`Year` = ?
			GROUP BY `160812 - land registry avg soldprice jan 2010 - mar 2016`.Property,`160812 - land registry avg soldprice jan 2010 - mar 2016`.Year
			ORDER BY
			`160812 - land registry avg soldprice jan 2010 - mar 2016`.Property ASC";

		*/

		//$query = $this->db->query($sql, array("%".$postcode."%", $propertyshort, $year));

		$query = $this->db->query($sql, array());

		//name the resource
		$results = array();

		foreach ($query->result_array() as $row){
			$id = $row['id'];

			if($lang == "ar"){
				$description = $row['roll-over-description-arabic'];
				$fulldescription = $row['full-description-arabic'];
			}else{
				$description = $row['roll-over-description-english'];
				$fulldescription = $row['full-description-english'];
			}

			$results[] = array(
			 	"id" => $id,
			 	"description" => $description,
			 	"fulldescription" => $fulldescription,
			 	"location" => $row['location'],
			 	"posx" => $row['posx'],
			 	"posy" => $row['posy'],
			 	"markerSize" => $row['markerSize']
			);
		}
		
		$response = array(
			"listings" => $results
		);

		//if called directly print out the response
		//if($this->is_called_via_master($this)){
			print_r(json_encode($response));
		//}

		//return response
		return $response;
	}

	/*
	public function index()
	{
		$this->load->view('welcome_message');
	}
	*/
}