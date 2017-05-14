(function (cityService) {
	var cityModel = require('../models/cityModel.js');
	var common = require('./common');
	var config = require('../config/config'),
	queryPager = require('./queryPager'),
	weatherModel = require('../models/weatherModel.js');
	err = require('./err');
	var allcities, dayCount=14; 
	cityService.bulkCityRegister = function(cities, callback) {
		console.log("In bulk City Register service");
		cityModel.insertMany(cities)
        .then(function(docs) {
             // return res.status(201).json(docs);
             callback(null, docs);return;
        })
        .catch(function(err) {
            // return res.status(500).json({
            //         message: 'Error during bulk cities Register.',
            //         error: err
            //     });
            callback(null, err);return;
        });
	}

	cityService.getCityWeather = function(page, limit, callback) {
		console.log("In function getCityWeather");
		var q="Duragpur", dayCount = 14, cities = [], c=0, weather=[];
		var url = config.cityByNameUrl+"q="+q+"&cnt="+dayCount+"&APPID="+config.APPID;
		// console.log("url : ", url);
		// common.get(url, {}, function(err, res) {
		// 	if(err) {
		// 		console.log("err in getting city weather", err);	
		// 		callback(err);
		// 		return;
		// 	}
		// 	jsonObject = JSON.parse(res.body)
		// 	callback(null, jsonObject.city.name)//res.body
		// })
		queryPager.pager(page, limit, config.defaultLimit, config.maxLimit, function (_skip, _limit) {
            skip = _skip;
            limit = _limit;
        });
        console.log("skip", typeof skip);
        console.log("limit", limit);
		cityModel
		.find()
		.skip(skip)
		.limit(Number(limit))
		.exec(function(err, listOfCities) {
			if(err) {
				callback(err); return;
			}
			console.log("listOfCities length", listOfCities.length);
			cities = listOfCities;
			for (var i = 0; i < cities.length; i++) {
				// cities[i].name;
				url = config.cityByNameUrl+"q="+cities[i].name+"&cnt="+dayCount+"&APPID="+config.APPID;
				console.log("url : ", url);				
				common.get(url, {}, function(err, res) {
					if(err) {
						console.log("err in getting city weather", err);	
						callback(err);
						return;
					}
					c++;
					weather.push(JSON.parse(res.body));
					if(c===listOfCities.length) {
						// callback(null, weather)
						arrayOfCitiesAndWeather(weather, cities, function(err, response) {
							if(err) {
								callback(err);return;
							}
							callback(null, response);
						})
					}
					// callback(null, JSON.parse(res.body))//res.body
				})
			}
			// callback(null, listOfCities);
		})
	}

	function arrayOfCitiesAndWeather(weather, cities, callback) {
		console.log("In function arrayOfCitiesAndWeather");
		var finalWeather = [], count=0, createWeatherCount=0;
		// callback(null, weather)		
		for (var i = 0; i < weather.length; i++) {

			for (var j = 0; j < cities.length; j++) {
				if(weather[i].city.name.toUpperCase() === cities[j].name.toUpperCase()) {
					console.log(weather[i].city.name.toUpperCase(),"------------------",cities[j].name.toUpperCase(), cities[j]._id)
					weather[i].cityId = cities[j]._id;
					finalWeather.push(weather[i]);
				}
			}
			// console.log("weather obj ", weather[i]);
		}
		for (var k = 0; k < finalWeather.length; k++) {
			var weatherObj = new weatherModel(finalWeather[k]);
			console.log("weatherObj before create",weatherObj );
			weatherObj.save(function(err, weatherCreateResponse) {
				if(err) {
					callback(err); return;
				}
				console.log("weatherObj after create",weatherCreateResponse.cityId );
				createWeatherCount++;
				if(createWeatherCount === finalWeather.length) {
					callback(null, weatherCreateResponse);
				}
			})
		}
		// callback(null, weather);
		// weatherModel.insertMany(finalWeather)
  //       .then(function(docs) {
  //            // return res.status(201).json(docs);
  //            callback(null, docs);//return;
  //       })
        // .catch(function(err) {
        //     // return res.status(500).json({
        //     //         message: 'Error during bulk cities Register.',
        //     //         error: err
        //     //     });
        //     callback(null, err);//return;
        // })

  		// for (var a = 0; a < finalWeather.length; a++) {
  		// 	// count++;
  		// 	console.log("finalWeather[",a,"]", finalWeather[a]);
  		// 	weatherModel
  		// 	.findOne({cityId: finalWeather[a].cityId})//finalWeather[a].cityId})
  		// 	.exec(function(err, weatherResponse) {
  		// 		console.log("weatherResponse ====>", weatherResponse);
  		// 		if(err) {
  		// 			callback(err); return;
  		// 		}
  		// 		if(!weatherResponse) {
  		// 			finalWeather[a].save(function(err, weatherCreateResponse) {
  		// 				if(err) {
  		// 					callback(err); return;
  		// 				}
  		// 				console.log("weatherCreateResponse =-=-=>", weatherCreateResponse);
  		// 				count++;
  		// 				if(count === finalWeather.length) {
  		// 					callback();
  		// 				}
  		// 			})
  		// 		}
  		// 		else {
  		// 			 weatherResponse.city = finalWeather[a].city;
  		// 			 weatherResponse.cod = finalWeather[a].cod;
  		// 			 weatherResponse.message = finalWeather[a].message;
  		// 			 weatherResponse.cnt = finalWeather[a].cnt;
  		// 			 weatherResponse.list = finalWeather[a].list;
  		// 			 weatherResponse.save(function(err, weatherCreateResponse) {
  		// 				if(err) {
  		// 					callback(err); return;
  		// 				}
  		// 				count++;
  		// 				if(count === finalWeather.length) {
  		// 					callback();
  		// 				}
  		// 			})
  		// 		}
  		// 	})
  		// }
	}

	cityService.getCityWeatherByName = function(city, callback) {
		console.log("In function getCityWeatherByName");
		console.log("city", city);
		var cityObjId, jsonObject, objOfCity={}, cityModelObj, weatherModelObj;
		for (var i = 0; i < allcities.length; i++) {
			console.log("city by name", allcities[i].name)
			if(city.toUpperCase() === allcities[i].name.toUpperCase()){
				console.log("allcities[i]._id ===", allcities[i]._id) 
				cityObjId = allcities[i]._id;

			}
		}
		console.log("cityObjId", cityObjId);
		if(cityObjId!==undefined) {
			console.log("err.scrollErr", err.scrollErr)
			callback(err.scrollErr, null);return
		}
		url = config.cityByNameUrl+"q="+city+"&cnt="+dayCount+"&APPID="+config.APPID;
		common.get(url, {}, function(err, res) {
			if(err) {
				console.log("err in getting city weather", err);	
				callback(err);
				return;
			}
			jsonObject = JSON.parse(res.body);
			objOfCity.name = city;
			cityModelObj = new cityModel(objOfCity);
			cityModelObj.save(function(err, createCityRes) {
				if(err) {
					callback(err); return;
				}
				console.log("createCityRes._id ===>", createCityRes._id);
				jsonObject.cityId = createCityRes._id;
				weatherModelObj = new weatherModel(jsonObject);
				// weatherModelObj.save(function(err, newCityWeatherObj) {
				// 	if(err) {
				// 		callback(err); return;
				// 	}
				// 	callback(null, newCityWeatherObj);
				// })
				callback(null, weatherModelObj)
			})
			// callback(null, jsonObject)//res.body

		})
	}

	cityService.getAllCities = (function() {
        cityModel
        .find()
        .exec(function(err, allCitiesResponse) {
            if(err) {
                console.log('err in getting cities in self invoke function');
            }
            allcities = allCitiesResponse;
            console.log('selfInvokeRoleResponse of getAllCities---> ', allCitiesResponse);
        })
    })();
})(module.exports);