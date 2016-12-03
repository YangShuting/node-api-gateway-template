var frisby = require('frisby');

frisby.create('Check /verify')
    .get('http://www.test.com/api/public/verify')
    .expectStatus(200)
    //.inspectHeaders()
    //.inspectStatus()
    .toss();

frisby.create('Check /login')
    .post('http://www.test.com/api/public/login',
        {
            username: "userTest",
            password: "passwordTest"
        },
        {json: true})
    .expectStatus(200)
    //.inspectHeaders()
    //.inspectBody()
    .toss();

/*
 * Logout test
 */
frisby.create('Login, before to logout, to get the auth token')
    // do login to get the authentication token
    .post('http://www.test.com/api/public/login',
        {
            username: "userTest",
            password: "passwordTest"
        },
        {json: true})
    .after(function (err, res, body) {
        //console.log(JSON.stringify(body));
        frisby.create('Logout test')
            .get('http://www.test.com/api/public/logout')
            // use the token in logout call
            .addHeader('Authorization', 'Bearer ' + body.token)
            .expectStatus(200)
            .toss()
    })
    .toss();