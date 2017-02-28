
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var app = {
	getSelections(choices){
		var newData = Array();
		var that = this;

		$.each(that.data, function(i, v) {
			if (choices.indexOf(v.id) !== -1) {
				newData.push(v);
			}
		});

		return newData;
	},
	mapHandler: function(choices){
		//'.listingresults row'
		var data = this.getSelections(choices);
		
		//marker holder
		var markerHolder = $('.markerholder');
		var	markerTemplate = markerHolder.find('.marker').eq(0).clone(true);

		//empty old dom
		markerHolder.empty();
		$.each(data, function(key, value) {
			$(markerTemplate).find('.coverimg img').attr("src", "assets/images/assets/square/"+key+".jpg");
			$(markerTemplate).find('[data-type="curve"]').text(value["description"]);

			//markerTemplate
			markerHolder.append('<div class="marker" data-type="markers" data-size="'+value["markerSize"]+'" data-pos-x="'+value["posx"]+'%" data-pos-y="'+value["posy"]+'%" data-id="'+value["id"]+'">'+$(markerTemplate).html()+'</div>');
		});

		//listing holder
		var listingHolder = $('.listingresults .list');
		var	rowTemplate = listingHolder.find('.row').eq(0).clone(true);
	
		//empty old dom
		listingHolder.empty();

		$.each(data, function(key, value) {
			$(rowTemplate).find('.imgwrap img').attr("src", "assets/images/assets/landscape/"+key+".jpg");
			$(rowTemplate).find('h2').text(value["description"]);
			$(rowTemplate).find('p').text(value["fulldescription"]);

			//console.log("value", value);
			//rowTemplate
			listingHolder.append('<div class="row">'+$(rowTemplate).html()+'</div>');
		});

		$('[data-type="markers"]').each(function(index) {
			$(this).addClass($(this).data("size"));
			$(this).css("left", $(this).data("pos-x")).css("top", $(this).data("pos-y")).css("z-index", index);
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
	count:0,
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

		$(".grid-item").click(function() {
		  var isUnselected = $(this).hasClass("unselected");

		  if(that.count + 1 > 5){
		  	$('.selection .error').fadeIn();
		  }else{
		  	$('.selection .error').fadeOut();
		  }

		  if(isUnselected){
		  	//remove unselected class -- add selected class
			$(this).removeClass("unselected").addClass("selected");
			$(this).find("input[type='checkbox']").prop('checked', true);
			that.count++;
		  }else{
		  	//remove selected class -- add unselected class
			$(this).removeClass("selected").addClass("unselected");
			$(this).find("input[type='checkbox']").prop('checked', false);
			that.count--;
		  }

		  $('.selection .count').text(that.count);
		});

	},
	getItems: function(callback){
		//ar or en
		var api = "Api/getListings/"+this.lang;
		$.getJSON(api, function(data) {
			callback(data);
		});
	},
	registerUser: function(data){
		data["sessionId"] = this.sessionId;

		var dataType = "string";

		var url = "Api/registerUser/";
		$.ajax({
		  type: "POST",
		  url: url,
		  data: data,
		  success: function(msg){
		  	console.log("msg", msg);
		  },
		  dataType: dataType
		});
	},
	populateSelection: function(data){		
		//store data
		this.data = data["listings"];

		var swiperHolder = $('.selectionform .swiper-wrapper');

		/*
		var $elem = swiperHolder.find('.swiper-slide').eq(0).empty();
		    sldeTemplate = $elem.clone(true);
			console.log("sldeTemplate", sldeTemplate);

		var gridHolder = $('.selectionform .grid2')
		var $elem = gridHolder.find('.grid-item').eq(0).empty();
			gridTemplate = $elem.clone(true);
			console.log("gridTemplate", gridTemplate);

		console.log("gridHolder", gridHolder);
		console.log("data", data);

		//grid empty
		gridHolder.empty();
		*/

		//empty the swiper
		swiperHolder.empty();
	  
			$.each(data["listings"], function(key, val) {
				swiperHolder.append('<div class="grid-item unselected"><div class="tickholder"></div><div class="textholder">'+val.description+'</div><input type="checkbox" class="ids" name="items[]" value="'+key+'"><img src="assets/images/assets/landscape/'+key+'.jpg"/></div>');			
			});

			var a = $('.selectionform .swiper-wrapper > div');

			for( var i = 0; i < a.length; i+=9 ) {
			    a.slice(i, i+9).wrapAll('<div class="swiper-slide"><div class="grid2" data-type="packery"></div></div>');
			}
	},
	init: function(){
		var that = this;

		//set language
		this.lang = $("body").data("lang");

		//get session
		this.sessionId = $("body").data("session");

		if(this.lang == "ar"){
			//swap to arabic text
			//data-ar

			$('[data-ar]').each(function(index) {
				var arabicText = $(this).data("ar");
				//console.log("arabic text", arabicText);
				$(this).text(arabicText);
				$(this).val(arabicText);
			});
		}

		that.togglePage("#page1");

		this.validateForm1(function(data){
			that.registerUser(data);

			that.togglePage("#page2");
			that.getItems(function(d){
				that.populateSelection(d);
				that.bindEvents();
			});
			
			$("#selectionForm").submit(function(){
				event.preventDefault();

				var data = JSON.parse(JSON.stringify($(this).serializeObject()));
				
				var items = data["items[]"];
				delete data["items[]"];

				data["items"] = items.join();
				that.registerUser(data);
				
				var choices = $('.ids:checked').map(function(){ 
					// return the value, which would be the collection element
					return this.value; 
					// get it as an array
				}).get();

				that.togglePage("#page3");
				that.mapHandler(choices);
			});
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
			submitHandler: function(form) {			    
			    var data = JSON.parse(JSON.stringify($(form).serializeObject()));
				callback(data);
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