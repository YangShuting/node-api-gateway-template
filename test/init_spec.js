var frisby = require('frisby');

frisby.create('Check /verify')
    .get('http://www.test.com/api/public/verify')
    .expectStatus(200)
    .inspectHeaders()
    .inspectStatus()
    .toss();

frisby.create('Check /login')
    .post('http://www.test.com/api/public/login',
        {
            username: "userTest",
            password: "passwordTest"
        },
        {json: true})
    .expectStatus(200)
    .inspectHeaders()
    .inspectBody()
    .toss();
/*
 First do login, then call logout setting
 frisby.create('Check /logout')
 .get('http://www.test.com/api/public/logout')
 .expectStatus(200)
 .toss();
 */