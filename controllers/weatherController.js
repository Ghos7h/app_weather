var weatherModel = require('../models/weatherModel.js');

/**
 * weatherController.js
 *
 * @description :: Server-side logic for managing weathers.
 */
module.exports = {

    /**
     * weatherController.list()
     */
    list: function (req, res) {
        weatherModel.find(function (err, weathers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting weather.',
                    error: err
                });
            }
            return res.json(weathers);
        });
    },

    /**
     * weatherController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        weatherModel.findOne({_id: id}, function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting weather.',
                    error: err
                });
            }
            if (!weather) {
                return res.status(404).json({
                    message: 'No such weather'
                });
            }
            return res.json(weather);
        });
    },

    /**
     * weatherController.create()
     */
    create: function (req, res) {
        var weather = new weatherModel({
        });

        weather.save(function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating weather',
                    error: err
                });
            }
            return res.status(201).json(weather);
        });
    },

    /**
     * weatherController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        weatherModel.findOne({_id: id}, function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting weather',
                    error: err
                });
            }
            if (!weather) {
                return res.status(404).json({
                    message: 'No such weather'
                });
            }

            weather.cityId = req.body.cityId ? req.body.cityId : weather.cityId;
            weather.save(function (err, weather) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating weather.',
                        error: err
                    });
                }

                return res.json(weather);
            });
        });
    },

    /**
     * weatherController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        weatherModel.findByIdAndRemove(id, function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the weather.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};