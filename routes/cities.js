const express = require('express');
const router = express.Router();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_API_KEY });

router.get('/results', (req, res) => {
    geocodingClient.forwardGeocode({ query: req.query.name + ' ' + req.query.state })
        .send().then(response => {
            let places = response.body.features.filter(result => {
                if (result['place_type'][0] === 'place') {
                    return true;
                }
            }).map(city => {
                return {
                    name: city['place_name'].split(',')[0],
                    state: city['place_name'].split(',')[1],
                    lat: city.center[1],
                    long: city.center[0]
                }
            });
            res.send(places);
        })

    //res.send('LOOK FOR A CITY');
})

/*router.get('/test', (req, res) => {
    let palces;
    geocodingClient.forwardGeocode({
        query: 'Seattle, WA'
    }).send().then(response => {
        //send array of only place
        places = response.body.features.filter(result => {
            if (result['place_type'][0] === 'place') {
                return true;
            }
        }).map(city => {
            return {
                name: city['place_name'].split(',')[0],
                state: city['place_name'].split(',')[1],
                lat: city.center[1],
                long: city.center[0]
            }
        });
        res.send(places);
    })
})*/

module.exports = router;