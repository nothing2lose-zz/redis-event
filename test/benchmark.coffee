# mocha -t 5s -R spec --compilers coffee:coffee-script/register benchmark_test.coffee

ctrler = undefined

#debug = require('debug')('exmpale');
app = require('../app');
app.set('port',3000);

time = undefined

describe "benchmark", ()->
  before (done) ->
    ctrler = require('../controllers/redis_controller')
    server = app.listen app.get('port'), () ->
#      debug('Express server listening on port ' + server.address().port);
      console.log("== server ready")
      done()
  beforeEach (done) ->
    time = new Date().getTime()
    done()
  afterEach (done) ->
    duringTime = new Date().getTime() - time
    console.log("during time : " + duringTime)
    done()

  it "input users", (done) ->
    failCounter = 0
    numOfReq = 100000
    for i in [0 ... numOfReq]
      ((index) ->
        ctrler.addRandomEventMember index, (result) ->
          if result.code isnt 0 then failCounter = failCounter + 1
          if index is numOfReq - 1 then done()
      )(i)

  it "get all event users", (done) ->
    ctrler.allRandomEventMemebers (result) ->
      console.log result.members.length
      done();

  it "pick random users", (done) ->
    ctrler.pickRandomEventMember 300, (result) ->
      console.log result.members.length
      # assert equal 300, result.members.length
      done()
  it "rank of all users!", (done) ->
    numOfReq = 100000
    for i in [0 ... numOfReq]
      ((index) ->
        ctrler.firstServedEvent index, (result) ->
          if index is numOfReq - 1 then done()
      )(i)





