var express = require('express');
var router = express.Router();

var client = global.RC;
var f_event_name = 'fs';
/* GET home page. */

var genText = function (user_id, rank) {
    return { title: '선착순 결과! id ['+ user_id +']: ' + (rank + 1) + " 등" };
}
router.post('/first-served', function(req, res) {


    var time = new Date().getTime();
    var user_id = req.param('user_id', undefined);

    if (user_id) {
    } else {
        res.send(400);
    }
    client.zscore(f_event_name, user_id, function(err, reply){

        if (reply === null) {

            client.zadd(f_event_name,time, user_id, function(err, reply) {

                if (!err && reply !== null) {

                    client.zrank(f_event_name, user_id, function(err, reply) {

                        if (!err && reply !== null) {
                            res.render('index', genText(user_id, reply + 1));
                        }

                    });
                }
            });
        } else {

            client.zrank(f_event_name, user_id, function(err, reply) {
                if (!err && reply !== null) {
                    res.render('index', genText(user_id, reply));
                }
            });
        }
    });



});


router.post('/random', function(req, res) {
    res.render('index', { title: '랜덤 결과!' });
});
module.exports = router;
