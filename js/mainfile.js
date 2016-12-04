var rest_result = {}
function fire(){
	var cityname = document.getElementById("cityname").value
	console.log(cityname);
	
	//Restaurant Rating
	r_rate_query = ""
	var rest_rate = null;
	if (document.getElementById("rr1star").checked){
		rest_rate = document.getElementById("rr1star").value;
		r_rate_query = "?stars <=\"1\" " ;
	}
	if (document.getElementById("rr2star").checked){
		rest_rate = document.getElementById("rr2star").value;
		r_rate_query = "?stars > \"1\" && ?stars <=\"2\"" ;
	}
	if (document.getElementById("rr3star").checked){
		rest_rate = document.getElementById("rr3star").value;
		r_rate_query = "?stars > \"2\" && ?stars <=\"3\"" ;
	}
	if (document.getElementById("rr4star").checked){
		rest_rate = document.getElementById("rr4star").value;
		r_rate_query = "?stars > \"3\" && ?stars <=\"4\"" ;
	}
	if (document.getElementById("rr5star").checked){
		rest_rate = document.getElementById("rr5star").value;
		r_rate_query = "?stars > \"4\" && ?stars <=\"5\"" ;
	}
	console.log("Restaurant Rating:" + rest_rate)
	
	// Restaurant category cuisine
	var cuisine = [];
	var r_cui_query 
	if (document.getElementById("c-amer").checked){
		cuisine.push(document.getElementById("c-amer").value);
	}
	if (document.getElementById("c-asia").checked){
		cuisine.push(document.getElementById("c-asia").value);
	}
	if (document.getElementById("c-fren").checked){
		cuisine.push(document.getElementById("c-fren").value);
	}
	if (document.getElementById("c-engl").checked){
		cuisine.push(document.getElementById("c-engl").value);
	}
	console.log("Cuisine: " + cuisine)
	
	
	
	// HOTEL
	// Hotel Rating
	var hotel_rate = null;
	var h_rate_query = "";
	if (document.getElementById("hr1star").checked){
		hotel_rate = document.getElementById("hr1star").value;
		h_rate_query = "?rating <=\"1\" " ;
	}
	if (document.getElementById("hr2star").checked){
		hotel_rate = document.getElementById("hr2star").value;
		h_rate_query = "?rating > \"1\" && ?rating <=\"2\"" ;
	}
	if (document.getElementById("hr3star").checked){
		hotel_rate = document.getElementById("hr3star").value;
		h_rate_query = "?rating > \"2\" && ?rating <=\"3\"" ;
	}
	if (document.getElementById("hr4star").checked){
		hotel_rate = document.getElementById("hr4star").value;
		h_rate_query = "?rating > \"3\" && ?rating <=\"4\"" ;
	}
	if (document.getElementById("hr5star").checked){
		hotel_rate = document.getElementById("hr5star").value;
		h_rate_query = "?rating > \"4\" && ?rating <=\"5\"" ;
	}
	console.log("Hotel Rating:" + hotel_rate)
	
	
	//Hotel Budget
	var budget = null;
	var h_budget_query = "";
	if (document.getElementById("1dol").checked){
		budget = document.getElementById("1dol").value;
		h_budget_query = "xsd:integer(?price) < 50 && xsd:integer(?price) > 0";
	}
	if (document.getElementById("2dol").checked){
		budget = document.getElementById("2dol").value;
		h_budget_query = "xsd:integer(?price) < 100 && xsd:integer(?price) > 50"
	}
	if (document.getElementById("3dol").checked){
		budget = document.getElementById("3dol").value;
		h_budget_query = "xsd:integer(?price) < 150 && xsd:integer(?price) > 100";
	}
	if (document.getElementById("4dol").checked){
		budget = document.getElementById("4dol").value;
		h_budget_query = "xsd:integer(?price) < 200 && xsd:integer(?price) > 150";
	}
	if (document.getElementById("5dol").checked){
		budget = document.getElementById("5dol").value;
		h_budget_query = "xsd:integer(?price) > 200";
	}
	console.log("Budget:" + budget)
	
	
	//Nearby Attractions
	
	var radius = null;
	if (document.getElementById("10m").checked){
		radius = document.getElementById("10m").value;
	}
	if (document.getElementById("20m").checked){
		radius = document.getElementById("20m").value;
	}
	if (document.getElementById("50m").checked){
		radius = document.getElementById("50m").value;
	}
	if (document.getElementById("100m").checked){
		radius = document.getElementById("100m").value;
	}
	
	console.log("Radius:" + radius)
	
	
	function httpGet(theUrl)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}
	
	/*
	function processResponse(result)
	{
		console.log(result);
	}
	
	function httpGetAsync(theUrl, callback)
	{
		console.log("In funcc")
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", theUrl, true);
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200){
				console.log("In if")
				callback(xmlHttp.responseText);
				}
		}
		 // true for asynchronous 
		xmlHttp.send(null);
	}
	*/
	
	
	var query = "";
	
	//query = query.concat("./s-query --service http://localhost:3030/ds/query '");
	
	query= query.concat("PREFIX app: <http://semanticweb.org/team1/app#> ");
	
	var query_rest = "PREFIX app: <http://semanticweb.org/team1/app#> \
						SELECT ?name ?addr ?stars ?cuisine \
						{ \
						?rest app:type \"yelp_restaurant\" ;	\
							  app:city \"" + cityname + "\" ; \
							  app:full_address ?addr ; app:stars ?stars ;	\ app:categories ?cuisine;  app:name ?name.		\
						FILTER(" + r_rate_query + "&& regex(?cuisine, \"American*\", \"i\")) 	\
						} 	\
						ORDER BY DESC(?stars) \
						LIMIT 10";
	
	
	
	var query_hotel = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \
						PREFIX app: <http://semanticweb.org/team1/app#> \
						SELECT ?link ?rating ?price \
						{ \
						?hotel app:type \"accomodation\" ; \
							  app:city \"" + cityname + "\" ; \
							  app:valuerating 	?rating ;		\
							  app:price ?price ;			\
							  app:url ?link.		\
						FILTER(" + h_budget_query + " && " + h_rate_query + ")	\
						}	\
						LIMIT 10";	
	
	var query_crime = "PREFIX app: <http://semanticweb.org/team1/app#>  \
						SELECT ?murder ?rape ?robbery ?theft ?violent_crime	\
						{	\
						?crimestats app:type \"crime\" ; 	\
								 app:city \"" + cityname + "\" ; \
								 app:murder ?murder;	\
								 app:rape ?rape;	\
								 app:robbery ?robbery;	\
								 app:theft ?theft;	\
								 app:violent_crime ?violent_crime.	\
						}";
	/*
	var myQuery = 'PREFIX app: <http://semanticweb.org/team1/app#> SELECT ?rest{?rest app:type "yelp_restaurant";app:city "Scottsdale" .}';
	*/
	
	var myUrl_rest = 
	"https://fuseki.herokuapp.com/ds/query?query=" + encodeURIComponent(query_rest) + "&output=json";
	//console.log(myUrl_rest)
	
	var myUrl_hotel = 
	"https://fuseki.herokuapp.com/ds/query?query=" + encodeURIComponent(query_hotel) + "&output=json";
	console.log(myUrl_hotel)
	
	var myUrl_crime = 
	"https://fuseki.herokuapp.com/ds/query?query=" + encodeURIComponent(query_crime) + "&output=json";
	console.log(myUrl_crime) 


	/*************************** Restaurent populating UI starts here *******************/
	rest_result = httpGet(myUrl_rest)
	console.log("Restaurant: " + rest_result);
	var result_object = JSON.parse(rest_result);
	var len = result_object.results.bindings.length;
	//console.log(result_object.results.bindings)
	//console.log("result by nitesh: " + result_object.results.bindings[0].name.value)
	for(var i=1; i<=len; i++){
		
		if (i == 5)
			break;
		var str = "#r-name" + i;
		console.log(result_object.results.bindings[i-1]);
		console.log($(str));
		$(str).text(result_object.results.bindings[i-1].name.value);
		str = "#r-add" + i
		$(str).text(result_object.results.bindings[i-1].addr.value);
		str = "#r-str" + i
		$(str).text(result_object.results.bindings[i-1].stars.value);
		str = "#r-csn" + i
		$(str).text(result_object.results.bindings[i-1].cuisine.value);
	}
	/********************** Restaurent populating UI ends here ******************************/



	/********************** Hotel populating UI starts here ********************************/
	var hotel_result = httpGet(myUrl_hotel)
	console.log("Hotel Reslt : " + hotel_result);
	/* Hotel populating UI ends here */
	var hotel_object = JSON.parse(hotel_result);
	console.log("Hotel :  " + hotel_object.results.bindings)
	//console.log("result by nitesh: " + result_object.results.bindings[0].name.value)
	len = hotel_object.results.bindings.length;
	for(var i=1; i<=len; i++){
		if (i == 5)
			break;
		var link = hotel_object.results.bindings[i-1].link.value;
		var name = link.split('-')[4];
		str = "#h-name" + i;
		$(str).text(name);
	 	str = "#h-bgt" + i
		$(str).text('$' + hotel_object.results.bindings[i-1].price.value);
		str = "#h-rat" + i
		$(str).text(Number(hotel_object.results.bindings[i-1].rating.value).toFixed(2));
		str = "#h-l" + i
		$(str).attr('href','http://tripadvisor.com/' + link);
	 }
	 /************************ Hotel populating UI ends here ******************************/

	var crime_result = httpGet(myUrl_crime)
	console.log("Hotel Reslt : " + crime_result);
	var crime_object = JSON.parse(crime_result);
	console.log("Crime :  " + crime_object.results.bindings[0].murder)
	str = "#c-1";
	$(str).text(crime_object.results.bindings[0].murder.value);
	str = "#c-2"; 
	$(str).text(crime_object.results.bindings[0].rape.value);
	str = "#c-3";
	$(str).text(crime_object.results.bindings[0].robbery.value);
	str = "#c-4";
	$(str).text(crime_object.results.bindings[0].theft.value);
	str = "#c-5";
	$(str).text(crime_object.results.bindings[0].violent_crime.value);
	/************************ Crime populating UI ends here ******************************/
	 
	$("html, body").animate({ scrollTop: $('#results').offset().top }, 500);
	 if(cityname == "Las Vegas")
		$("#tab3").css("visibility", "visible");
	else
		$("#tab3").css("visibility", "hidden");

	return false;
	
}