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

	//1. Similar properties in your area have sold for [sold price 2016]
	public function similarProperties($lang){
		
		$this->load->database();
	
		$sql = "SELECT
			*
			FROM
			listings";

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
			 	"fulldescription" => $fulldescription
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