var express = require('express');
var router = express.Router();
var cityController = require('../controllers/cityController.js');

/*
 * GET
 */
router.get('/', cityController.list);

/*
 * GET
 */
router.get('/:id', cityController.show);

/*
 * POST
 */
router.post('/', cityController.create);

/*
 * PUT
 */
router.put('/:id', cityController.update);

/*
 * DELETE
 */
router.delete('/:id', cityController.remove);

/*
* POST
*/
router.post('/bulkCityRegister', cityController.bulkCityRegister);

/*
* GET
*/
router.get('/getCity/Weather', cityController.getCityWeather);
module.exports = router;
