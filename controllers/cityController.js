var cityModel = require('../models/cityModel.js');
var cityService = require('../service/cityService');

/**
 * cityController.js
 *
 * @description :: Server-side logic for managing citys.
 */
module.exports = {

    /**
     * cityController.list()
     */
    list: function (req, res) {
        cityModel.find(function (err, citys) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting city.',
                    error: err
                });
            }
            return res.json(citys);
        });
    },

    /**
     * cityController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        cityModel.findOne({_id: id}, function (err, city) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting city.',
                    error: err
                });
            }
            if (!city) {
                return res.status(404).json({
                    message: 'No such city'
                });
            }
            return res.json(city);
        });
    },

    /**
     * cityController.create()
     */
    create: function (req, res) {
        var city = new cityModel({
			name : req.body.name
        });

        city.save(function (err, city) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating city',
                    error: err
                });
            }
            return res.status(201).json(city);
        });
    },

    /**
     * cityController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        cityModel.findOne({_id: id}, function (err, city) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting city',
                    error: err
                });
            }
            if (!city) {
                return res.status(404).json({
                    message: 'No such city'
                });
            }

            city.name = req.body.name ? req.body.name : city.name;
			
            city.save(function (err, city) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating city.',
                        error: err
                    });
                }

                return res.json(city);
            });
        });
    },

    /**
     * cityController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        cityModel.findByIdAndRemove(id, function (err, city) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the city.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
    bulkCityRegister: function(req, res, next) {
        console.log("In bulk City Register Controller");
        var cities = req.body;
        cityService.bulkCityRegister(cities, function(err, bulkCreateResponse) {
            if(err) {
                next(err); return;
            }
            return res.status(201).json(bulkCreateResponse);
        })
    },
    getCityWeather: function(req, res, next) {
        console.log("In getCityWeather");
        var page = req.query.page;
        var limit = req.query.limit;
        var city = req.query.city;
        if(city ===undefined) {
             cityService.getCityWeather(page, limit, function(err, response) {
                if(err) {
                    next(err); return;
                }
                return res.status(200).json(response);
            })
        }
        else {
            cityService.getCityWeatherByName(city, function(err, response) {
                if(err) {
                    console.log("err", err)
                    // next(err); return;
                    return res.status(500).json(err);
                }
                return res.status(200).json(response);
            })
        }
       
    }
};
