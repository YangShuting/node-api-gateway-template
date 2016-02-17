$(document).ready(function () {

    // Falcor models
    var publicModel = new falcor.Model({source: new falcor.HttpDataSource('/api/public/model.json')});
    var privateModel = new falcor.Model({
        source: new falcor.HttpDataSource('/api/private/model.json', {
            // Send the token as an Authorization header
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('id_token')
            }
        })
    });

    // button events observables
    var publicClick = Rx.Observable.fromEvent(document.getElementById('public'), 'click');
    var privateClick = Rx.Observable.fromEvent(document.getElementById('private'), 'click');
    var loginClick = Rx.Observable.fromEvent(document.getElementById('login'), 'click');
    // api observables
    var publicObservable = publicModel.get("greeting");
    var privateObservable = privateModel.get("login");
    var getLoginObservable = function () {
        return Rx.Observable.fromPromise(
            $.post("api/login", {username: "John", password: "Long"})
        );
    };

    // utilities
    var log = function (text) {
        $('#logArea').append('\n\n' + text);
    };

    var jsonString = function (input) {
        return JSON.stringify(input, null, 2)
    };

    // sequences
    publicClick.concatMap(
        function (clicked) {
            log('After public click: ' + jsonString(clicked));
            return publicObservable;
        }
    ).subscribe(
        function (x) {
            log('After public call : ' + jsonString(x));
        }
    );

    privateClick.concatMap(
        function (clicked) {
            log('After private click: ' + jsonString(clicked));
            return privateObservable;
        }
    ).subscribe(
        function (x) {
            log('After private call : ' + jsonString(x));
        },
        function (err) {
            log('Errore' + jsonString(err))
        }
    );

    loginClick.concatMap(function (x) {
        return getLoginObservable()
    }).subscribe(
        function (x) {
            log("da login : " + jsonString(x));
            localStorage.setItem('id_token', x.token); // get the token and set to localStorage
        }
    );


});
