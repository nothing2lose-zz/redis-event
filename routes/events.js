var express = require('express');
var router = express.Router();
var ctrler = require('../controllers/redis_controller');

/* GET home page. */

var genResult = function (title, picked_users, cb) {
    if ( undefined === picked_users ) picked_users = [];

    ctrler.allRandomEventMemebers( function(result){

        cb({ title: title, random_users:result.members, picked_users:picked_users });
    });


}


router.post('/test/first-served', function(req, res){
    var user_id = req.param('user_id', undefined);
    if (user_id) {
    } else {
        res.send(400);
    }
    ctrler.firstServedEvent(user_id, function (result) {
        res.send(200, result.rank);
    });
});

router.post('/first-served', function(req, res) {

    var user_id = req.param('user_id', undefined);
    if (user_id) {
    } else {
        res.send(400);
    }
    ctrler.firstServedEvent(user_id, function (result) {
        if (result.code !== 0) {
            res.send(500);
        } else {
            var title = '선착순 결과! id ['+ user_id +']: ' + (result.rank + 1) + " 등";
            genResult(title, undefined, function (result){
                res.render('index', result);
            })

        }
    })

});

router.post('/random-pick', function(req, res) {
    ctrler.pickRandomEventMember(1, function(result){
        if (result.code !== 0) {
            res.send(500);
        } else {
            var picked_memebers = result.members;
            genResult("뽑기 결과", picked_memebers, function (result){
                res.render('index', result);
            })
        }
    });
});

router.post('/random', function(req, res) {
    var user_id = req.param('user_id', undefined);
    if (user_id) {
    } else {
        res.send(400);
    }
    ctrler.addRandomEventMember(user_id, function (result) {
        if (result.code !== 0) {
            res.send(500);
        } else {
            genResult("등록 성공", undefined, function (result){
                res.render('index', result);
            })
        }

    });
});


module.exports = router;
