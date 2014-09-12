var client = global.RC;
var F_EVENT_NAME = 'fs';
var R_EVENT_NAME = 're';

var F_EVENT_NUM = 'fsn'
var R_EVENT_NUM = 'ren';

var genResult = function (title, picked_users, cb) {
    if ( undefined === picked_users ) picked_users = [];

    self.allRandomEventMemebers( function(result){
        self.numberOfAttendees(function (attendees) {
            if (attendees.first_served == null) {
                attendees.first_served = 0;
            }
            if (attendees.random == null) {
                attendees.random = 0;
            }
            cb({ title: title, random_users:result.members, picked_users:picked_users, at_random:attendees.random, at_fs:attendees.first_served});
        })
    });
};

// 선착순 및 랜덤이벤트 참석한 인원 수 얻는 함수
var numberOfAttendees = function (cb) {
    var result = {};
    result.code = 400;
    var multi = client.multi();
    multi.get(F_EVENT_NUM);
    multi.get(R_EVENT_NUM);
    multi.exec(function (err, replies) {
        if (!err && replies !== null) {
            result.first_served = replies[0];
            result.random = replies[1];
            cb(result);
        } else {
            cb(result);
        }
    });

}

// 랜덤 이벤트 등록
var addRandomEventMember = function (user_id, cb) {
    var result = {};
    result.code = 400;
    var multi = client.multi();
    multi.sadd(R_EVENT_NAME, user_id);
    multi.incr(R_EVENT_NUM);
    multi.exec(function(err, replies) {
        if (!err && replies !== null) {
            result.code = 0;
            cb(result);
        } else {
            cb(result);
        }
    });
}

// 랜던 이벤트 등록한 맴버의 id list 얻기
var allRandomEventMemebers = function (cb) {
    var result = {};
    result.code = 400;
    client.smembers(R_EVENT_NAME, function (err, replies) {
        if (!err && replies !== null) {
            result.code = 0;
            result.members = replies;
            cb(result);
        } else {
            result.members = [];
            cb(result)
        }
    });
}

// 랜덤 이벤트 임의 사용자 추출
var pickRandomEventMember = function (count, cb) {
    var result = {};
    result.code = 400;
    // 데모용 서버에 2.4.x의 redis 설치되었음. 해당 버전에 srandmember 명령어에 2번째 파라미터는 없다.
//    client.srandmember(R_EVENT_NAME, count, function (err, replies) {
    client.srandmember(R_EVENT_NAME, function (err, replies) {
        if (!err && replies !== null) {
            result.code = 0;
            result.members = replies;
            cb(result);
        } else {
            cb(result);
        }
    });
}

// 선착순 이벤트 등록 (이미 등록 된 경우 rank 반환)
var firstServedEvent = function (user_id, cb) {
    var result = {};
    result.code = 400;
    var time = new Date().getTime();
    client.zscore(F_EVENT_NAME, user_id, function(err, reply){

        if (reply === null) {
            var multi = client.multi();

            multi.zadd(F_EVENT_NAME,time, user_id);
            multi.incr(F_EVENT_NUM);
            multi.exec(function(err, replies) {

                if (!err && replies !== null) {
                    client.zrank(F_EVENT_NAME, user_id, function(err, reply) {

                        if (!err && reply !== null) {
                            result.code = 0;
                            result.rank = reply;
                            return cb(result);
                        } else {
                            return cb(result);
                        }

                    });
                } else {
                    return cb(result);
                }
            });

        } else {

            client.zrank(F_EVENT_NAME, user_id, function(err, reply) {
                if (!err && reply !== null) {
                    result.code = 0;
                    result.rank = reply;
                    return cb(result);
                } else {
                    return cb(result);
                }
            });
        }
    });
}

this.nf = {
    genResult : genResult,
    numberOfAttendees : numberOfAttendees,
    addRandomEventMember : addRandomEventMember,
    allRandomEventMemebers: allRandomEventMemebers,
    pickRandomEventMember: pickRandomEventMember,
    firstServedEvent: firstServedEvent
}
var self = this.nf;
module.exports = this.nf;