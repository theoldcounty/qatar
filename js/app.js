
var app = {
	mapHandler: function(){


		var locales = [
						{
							"location": "London",
							"posx": 651,
							"poxy": 571
						},
						{
							"location": "Edingburgh",
							"posx": 355,
							"poxy": 192
						},
						{
							"location": "xxxx",
							"posx": 450,
							"poxy": 252
						}
					];


		$('[data-type="markers"]').each(function(index) {
			$(this).addClass($(this).data("size"));
			$(this).css("left", $(this).data("pos-x")).css("top", $(this).data("pos-y"))
		});

		function getRandomNumber(s, e){
			return Math.floor(Math.random() * e) + s;
		}

		function curveme(el,index){

			var content = $(el).text();
			$(el).empty();

			var markerPointerSize = $(el).parent().find('.markerpointer').width();
			
			var diameter = markerPointerSize+32;

			//var diameter = 195;//large
			//var diameter = 125;//small
			radius = diameter/2;

			//Create the SVG
			var svg = d3.select(el).append("svg")
					.attr("width", diameter)
					.attr("height", diameter);

			var pi = Math.PI;

			var arc = d3.arc()
				    .innerRadius(radius-20)
				    .outerRadius(radius-15)
				    .startAngle(getRandomNumber(-1, 0.5))
				    .endAngle(pi);
						
			//Create an SVG path			
			svg.append("path")
				.attr("id", "wavy"+index) //very important to give the path element a unique ID to reference later
				.attr("d", arc)
				.attr("transform", "translate("+radius+","+radius+")")
				.style("fill", "none");

			//Create an SVG text element and append a textPath element
			svg.append("text")
			   .append("textPath") //append a textPath to the text element
				.attr("xlink:href", "#wavy"+index) //place the ID of the path here
				.style("text-anchor","right") //place the text right on the arc
				.attr("startOffset", "0")		
				.text(content);
		}


		$('[data-type="curve"]').each(function(index) {
			curveme(this,index);
		});
	},
	bindEvents: function(){
		var that = this;
		$('[data-type="select"]').each(function(index) {
			$(this).select2();
		});

		this.packers = new Array();
		$('[data-type="packery"]').each(function(index) {
			var pckry = new Packery(this, {
				itemSelector: '.grid-item',
				gutter: 10
			});
			that.packers.push(pckry);
		});

		this.swipers = new Array();
		$('[data-type="swiper"]').each(function(index) {
			var mySwiper = new Swiper (this, {
				// Optional parameters
				direction: 'horizontal',
				// Navigation arrows

			    spaceBetween: 50,
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev'
		    });
		    that.swipers.push(mySwiper);
		});		
	},
	init: function(){
		console.log("test");
		var that = this;

		$(".grid-item").click(function() {
		  var isUnselected = $(this).hasClass("unselected");

		  if(isUnselected){
		  	//remove unselected class -- add selected class
			$(this).removeClass("unselected").addClass("selected");
			$(this).find("input[type='checkbox']").prop('checked', true); 
		  }else{
		  	//remove selected class -- add unselected class
			$(this).removeClass("selected").addClass("unselected");
			$(this).find("input[type='checkbox']").prop('checked', false);
		  }

		});

		that.togglePage("#page1");

		this.validateForm1(function(msg){
			console.log("next step", msg);
			that.togglePage("#page2");
			
			that.bindEvents();

			$("#selectionForm").submit(function(){
				event.preventDefault();
			    console.log("Submitted");

				that.togglePage("#page3");

				that.mapHandler();
			});

			//app.packers[0].layout();
			//pckry.reloadItems();
		})

	},
	validateForm1: function(callback){

		// validate signup form on keyup and submit
		$("#signupForm").validate({
			rules: {
				firstname: "required",
				lastname: "required",
				email: {
					required: true,
					email: true
				}
			},
			messages: {
				firstname: "Please enter your firstname",
				lastname: "Please enter your lastname",
				email: "Please enter a valid email address"
			},
			submitHandler: function() {
				callback("submitted!");
			}
		});

	},
	togglePage: function(page){
		$(".pages").hide();
		$(page).fadeIn(400);
	}
};


$(document).ready(function() {
	app.init();
});