     // Ionic Starter App

     // angular.module is a global place for creating, registering and retrieving Angular modules
     // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
     // the 2nd parameter is an array of 'requires'
     var todoApp = angular.module('starter', ['ionic', 'angular-md5', 'ionic-material', 'ionMdInput', 'ngCordova', 'ngStorage', 'ngCookies', 'timer']);
     var db = null;
     todoApp.factory('Auth', function($cookieStore) {
         var _user = $cookieStore.get('starter.user');
         var setUser = function(user) {
             _user = user;
             $cookieStore.put('starter.user', _user);
         }
         var getUser = function() {
             return _user;
         }

         return {
             setUser: setUser,
             isLoggedIn: function() {
                 return _user ? true : false;
             },
             getUser: getUser,
             logout: function() {
                 $cookieStore.remove('starter.user');
                 _user = null;
             }
         }
     });
     // Database for this App.
     todoApp.run(function($ionicPlatform, $cordovaSQLite) {
         $ionicPlatform.ready(function() {
             // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
             // for form inputs)

             if (window.cordova && window.cordova.plugins.Keyboard) {
                 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

             }
             if (window.StatusBar) {
                 StatusBar.styleDefault();
             }

         });
     });

     todoApp.config(function($stateProvider, $urlRouterProvider) {
         $stateProvider
             .state("config", {
                 url: "/config",
                 templateUrl: "templates/config.html",
                 controller: "ConfigController",

             })
             .state("login", {
                 url: "/login",
                 templateUrl: "templates/login.html",
                 controller: "CategoriesLogin",
             })
             .state("quizs", {
                 url: "/quizs/:batchId",
                 templateUrl: "templates/quizs.html",
                 controller: "QuizsController",

             })
             .state("users", {
                 url: "/users/:batchId",
                 templateUrl: "templates/users.html",
                 controller: "UsersController",

             })
             .state("batch", {
                 url: "/batch/:accId",
                 templateUrl: "templates/batch.html",
                 controller: "BatchController",

             })
             .state("details", {
                 url: "/details/:quizId",
                 templateUrl: "templates/details.html",
                 controller: "DetailController",

             })
             .state("access", {
                 url: "/access/:quizId",
                 templateUrl: "templates/access.html",
                 controller: "AccessController",

             })
             .state("categories", {
                 url: "/categories",
                 templateUrl: "templates/categories.html",
                 controller: "CategoriesController",

             })
             .state("lists", {
                 url: "/lists/:categoryId",
                 templateUrl: "templates/lists.html",
                 controller: "ListsController",

             })
             .state("thankyou", {
                 url: "/thankyou",
                 templateUrl: "templates/thankyou.html",
                 controller: "ThankyouController",
             })
             .state("tabmanager", {
                 url: "/tabmanager",
                 templateUrl: "templates/tabmanager.html",
                 controller: "TabmanagerController",
             })
             .state("items", {
                 url: "/items/:listId",
                 templateUrl: "templates/items.html",
                 controller: "ItemsController",
             });

         // Set Default to /config.
         $urlRouterProvider.otherwise("/config");
     });



     /**
      * Services
      **/
     todoApp.factory('OptionId', function() {
         var cache;
         var saveData = function(data) {
             cache = data;
         }

         return {
             saveData: saveData,
             returnData: function() {
                 return cache;
             }
         }
     });

     /**
      * Config - Copy prepopulated DB
      *
      * Directives:
      *   'ionicLoading'  UI-Progresss during dbCopy
      *   'cordovaSQLite' cordovaSQLite-Plugin)
      *   'location'      current Location in th ui-router
      *   'ionicPlatform' PlatformProvider
      */
     todoApp.controller("ConfigController", function($ionicLoading, $cordovaSQLite, $http, $location, $ionicHistory, $ionicPlatform) {
         // Deny Backbutton in next view so that the user does not rerun this.
         $ionicHistory.nextViewOptions({
             disableAnimate: true,
             disableBack: true
         });

         // Wait for the application to be ready (want to use Plugins).
         $ionicPlatform.ready(function() {
             // Show "Loading" until complete.
             $ionicLoading.show({
                 template: "Loading..."
             });
             // Load SQLite on Device, use WebSQL in Browser.

             db = openDatabase("studentsf.db", "1.0", "My WebSQL Database", 200 * 1024 * 1024);
             $http.get('http://exam.imbueaura.com/index.php/api/users/format/json')
                 .success(function(data, status, headers, config) {

                     db.transaction(function(tx) {
                         // Drop Categories before import.
                         tx.executeSql("DROP TABLE IF EXISTS tblUsers");
                         tx.executeSql("DROP TABLE IF EXISTS tblQuiz");
                         tx.executeSql("DROP TABLE IF EXISTS Questions");
                         tx.executeSql("DROP TABLE IF EXISTS total_result");
                         tx.executeSql("DROP TABLE IF EXISTS tblOptions");
                         tx.executeSql("DROP TABLE IF EXISTS assessor");
                         tx.executeSql("DROP TABLE IF EXISTS batches");
                         tx.executeSql("DROP TABLE IF EXISTS assessor_batch");
                         tx.executeSql("CREATE TABLE IF NOT EXISTS tblUsers (id integer, username text,password text,email text,first_name text,last_name text,gid integer,bid integer)");

                         tx.executeSql("CREATE TABLE IF NOT EXISTS tblQuiz" +
                             "(id integer primary key,quid INTEGER,quiz_name TEXT,description TEXT," +
                             "start_time NUMERIC,end_time NUMERIC,duration NUMERIC," +
                             "pass_percentage INTEGER,max_attempts NUMERIC," +
                             "correct_score TEXT,incorrect_score TEXT," +
                             "bid INTEGER,gid INTEGER)");
                     });
                     db.transaction(function(tx) {
                         tx.executeSql("CREATE TABLE IF NOT EXISTS Questions (id integer primary key," +
                             "rid INTEGER, quid INTEGER,qid INTEGER,question TEXT)");
                         tx.executeSql("CREATE TABLE IF NOT EXISTS tblOptions (id integer primary key, qid INTEGER, oid INTEGER, option TEXT, option_score NUMERIC,quid NUMERIC )");
                         tx.executeSql("CREATE TABLE IF NOT EXISTS quiz_result (id integer primary key, uid INTEGER, quid INTEGER, qids TEXT, category_name TEXT,qids_range TEXT, oids TEXT, start_time INTEGER, end_time INTEGER, last_response INTEGER, time_spent INTEGER, time_spent_ind TEXT, score TEXT, percentage TEXT, q_result INTEGER, status INTEGER, institute_id INTEGER, photo TEXT, essay_ques INTEGER, score_ind TEXT )");
                     });
                     db.transaction(function(tx) {
                         tx.executeSql("CREATE TABLE IF NOT EXISTS assessor (id integer primary key," +
                             "aid INTEGER,qpid INTEGER,firstname TEXT,lastname TEXT,username TEXT,password TEXT)");
                         tx.executeSql("CREATE TABLE IF NOT EXISTS assessor_batch (id integer primary key, aid INTEGER, bid INTEGER )");
                         tx.executeSql("CREATE TABLE IF NOT EXISTS user_result (id integer primary key, uid INTEGER, quid INTEGER,qids TEXT,category_name TEXT," +
                             "qids_range TEXT,oids TEXT, start_time TEXT,end_time TEXT, last_response TEXT," +
                             "time_spent TEXT, time_spent_ind TEXT, score REAL, percentage TEXT," +
                             "q_result INTEGER, status INTEGER, institute_id INTEGER, photo TEXT, essay_ques INTEGER, score_ind INTEGER)");
                     });
                     db.transaction(function(tx) {
                         tx.executeSql("CREATE TABLE IF NOT EXISTS total_result (id integer primary key," +
                             "rid INTEGER, uid INTEGER, quid INTEGER,qids TEXT,category_name TEXT," +
                             "qids_range TEXT,oids TEXT, start_time TEXT,end_time TEXT, last_response TEXT," +
                             "time_spent TEXT, time_spent_ind TEXT, score REAL, percentage TEXT," +
                             "q_result INTEGER, status INTEGER, institute_id INTEGER, photo TEXT, essay_ques INTEGER, score_ind INTEGER)");
                         tx.executeSql("CREATE TABLE IF NOT EXISTS batches (id integer primary key, bid INTEGER, batch_name TEXT )");
                         tx.executeSql("CREATE TABLE IF NOT EXISTS tab_manager (id integer primary key, tm_name TEXT, tm_password TEXT )");

                     });
                     var user = data;
                     for (i = 0; i < user.length; i++) {
                         var id = user[i].id;
                         var username = user[i].username;
                         var password = user[i].password;
                         var email = user[i].email;
                         var first_name = user[i].first_name;
                         var last_name = user[i].last_name;
                         var gid = user[i].gid;
                         var bid = user[i].bid;

                         var query = "INSERT INTO tblUsers (id,username,password,email,first_name,last_name,gid,bid) VALUES (?,?,?,?,?,?,?,?)";
                         $cordovaSQLite.execute(db, query, [id, username, password, email, first_name, last_name, gid, bid]).then(function(res) {

                         }, function(err) {
                             console.error(err);
                         });
                     }

                     $http.get('http://exam.imbueaura.com/index.php/api/assessor/format/json')
                         .success(function(data, status, headers, config) {
                             var assessor = data;
                             for (i = 0; i < assessor.length; i++) {
                                 var id = assessor[i].aid;
                                 var username = assessor[i].username;
                                 var password = assessor[i].password;
                                 var first_name = assessor[i].firstname;
                                 var last_name = assessor[i].lastname;
                                 var qpid = assessor[i].qpid;
                                 var query = "INSERT INTO assessor (aid,username,password,firstname,lastname,qpid) VALUES (?,?,?,?,?,?)";
                                 $cordovaSQLite.execute(db, query, [id, username, password, first_name, last_name, qpid]).then(function(res) {

                                 }, function(err) {
                                     console.error(err);
                                 });
                             }
                         });
                     $http.get('http://exam.imbueaura.com/index.php/api/batches/format/json')
                         .success(function(data, status, headers, config) {
                             var batch = data;
                             for (i = 0; i < batch.length; i++) {
                                 var batch_name = batch[i].batch_name;
                                 var bid = batch[i].bid;
                                 var query = "INSERT INTO batches (bid,batch_name) VALUES (?,?)";
                                 $cordovaSQLite.execute(db, query, [bid, batch_name]).then(function(res) {

                                 }, function(err) {
                                     console.error(err);
                                 });
                             }
                         });


                     $http.get('http://exam.imbueaura.com/index.php/api/assessorbatch/format/json')
                         .success(function(data, status, headers, config) {
                             var assessor = data;
                             for (i = 0; i < assessor.length; i++) {
                                 var aid = assessor[i].aid;
                                 var bid = assessor[i].bid;
                                 var query = "INSERT INTO assessor_batch (aid,bid) VALUES (?,?)";
                                 $cordovaSQLite.execute(db, query, [aid, bid]).then(function(res) {

                                 }, function(err) {
                                     console.error(err);
                                 });
                             }
                         });

                     $http.get('http://exam.imbueaura.com/index.php/api/tabs/format/json')
                         .success(function(data, status, headers, config) {
                             var tab = data;
                             for (i = 0; i < tab.length; i++) {
                                 var password_tm = tab[i].tm_password;
                                 var name_tm = tab[i].tm_name;
                                 var query = "INSERT INTO tab_manager (tm_password,tm_name) VALUES (?,?)";
                                 $cordovaSQLite.execute(db, query, [password_tm, name_tm]).then(function(res) {

                                 }, function(err) {
                                     console.error(err);
                                 });
                             }
                         });

                     //     $http.get('http://exam.imbueaura.com/index.php/api/quiz/format/json')
                     // .success(function(data,status,headers,config){
                     //   console.log("data----------",data);
                     //     var quiz = data;
                     //     angular.forEach(quiz, function(values, keys) {
                     //       var quid = values.quid;
                     //       var quiz_name = values.quiz_name;
                     //       var description = values.description;
                     //       var start_time = values.start_time;
                     //       var end_time = values.end_time;
                     //       var duration = values.duration;
                     //       var pass_percentage = values.pass_percentage;
                     //       var max_attempts = values.max_attempts;
                     //       var correct_score = values.correct_score;
                     //       var incorrect_score = values.incorrect_score;
                     //       var gid = values.gid;
                     //       var bid = values.bid;
                     //
                     //       var query = "INSERT INTO tblQuiz (quid,quiz_name,description,start_time,end_time,duration,pass_percentage,max_attempts,correct_score,incorrect_score,bid,gid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                     //       $cordovaSQLite.execute(db, query, [quid,quiz_name,description,start_time,end_time,duration,pass_percentage,max_attempts,correct_score,incorrect_score,bid,gid]).then(function(res) {
                     //                  $http.get('http://exam.imbueaura.com/index.php/api/printquiz/qid/'+quid+'/format/json')
                     // .success(function(data,status,headers,config){
                     //
                     //                 console.log(data);
                     //             var ques = data;
                     //             angular.forEach(ques, function(value, key) {
                     //               var rid = value.rid;
                     //                var qid = value.qid;
                     //                var question = value.question;
                     //                var qtid = value.quid;
                     //               var query = "INSERT INTO Questions(rid,qid,quid,question) VALUES (?,?,?,?)";
                     //               $cordovaSQLite.execute(db, query,[rid,qid,qtid,question]).then(function(res) {
                     //                 $http.get('http://exam.imbueaura.com/index.php/api/printresult/rid/'+rid+'/format/json')
                     // .success(function(data,status,headers,config){
                     //        console.log("data---------------------" , data);
                     //                          var result_q = data;
                     //                          angular.forEach(result_q, function(values, keys) {
                     //
                     //                         var rid = values.rid;
                     //                         var uid = values.uid;
                     //                         var quid = values.quid;
                     //                         var qids = values.qids;
                     //                          var category_name = values.category_name;
                     //                           var qids_range = values.qids_range;
                     //                         var oids = values.oids;
                     //                         var start_time = values.start_time;
                     //                         var end_time = values.end_time;
                     //                         var last_response = values.last_response;
                     //                           var time_spent = values.time_spent;
                     //                         var time_spent_ind = values.time_spent_ind;
                     //                         var score = values.score;
                     //                         var percentage = values.percentage;
                     //                         var q_result = values.q_result;
                     //                           var status = values.status;
                     //                         var institute_id = values.institute_id;
                     //                         var photo = values.photo;
                     //                         var essay_ques = values.score_ind;
                     //                         var score_ind = values.score_ind;
                     //                         var query = "INSERT INTO total_result(rid, uid, quid,qids,category_name,qids_range,oids, start_time, end_time, last_response,time_spent, time_spent_ind, score, percentage, q_result, status, institute_id, photo, essay_ques, score_ind) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                     //                        $cordovaSQLite.execute(db, query,[rid, uid, quid,qids,category_name,qids_range,oids, start_time, end_time, last_response,time_spent, time_spent_ind, score, percentage, q_result, status, institute_id, photo, essay_ques, score_ind]).then(function(res) {
                     //                       }, function (err) {
                     //                         console.error(err);
                     //                    });
                     //                      });
                     //                      });
                     //                 }, function (err) {
                     //                console.error(err);

                     //             });
                     //               angular.forEach(value.options, function(val, ke) {
                     //                  var query = "INSERT INTO tblOptions(qid,oid,option,option_score,quid) VALUES (?,?,?,?,?)";
                     //               $cordovaSQLite.execute(db, query,[qid,val.oid,val.option,val.option_score,qtid]).then(function(res) {
                     //
                     //
                     //                 }, function (err) {
                     //                console.error(err);
                     //             });
                     //               });
                     //             });
                     //           });
                     //
                     //          $location.path('/login');
                     //       }, function (err) {
                     //         console.error(err);
                     //       });
                     //
                     //       });
                     //     });
                     //
                     //     $location.path("/login");
                     //   })
                     //   .error(function(data,status,headers,config){
                     //     $location.path("/login");
                     //   });
                     $location.path("/login");
                     $ionicLoading.hide();
                 });
         });
     });


     /**
      * Controller for the Login.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */
     todoApp.controller("CategoriesLogin", function($scope, $ionicPlatform, $http, $cordovaSQLite, $location, Auth, md5) {
         // Container for the categories in this Scope.
         $scope.loginData = [];
         $ionicPlatform.ready(function() {
             if (db === null) {
                 $location.path("/config");
             }
         });


         $scope.doLogin = function() {
             var query = "SELECT * FROM tblUsers WHERE username = ? and password = ?";
             var query1 = "SELECT * FROM assessor WHERE username = ? and password = ?";
             var query2 = "SELECT * FROM tab_manager WHERE tm_name = ? and tm_password = ?";
             $scope.pass = $scope.loginData.password;
             $scope.user = md5.createHash($scope.loginData.password || '');
             $cordovaSQLite.execute(db, query, [$scope.loginData.username, $scope.user]).then(function(result) {
                 if (result.rows.length > 0) {
                     for (var i = 0; i < result.rows.length; i++) {
                         Auth.setUser({
                             username: result.rows.item(0).username,
                             userid: result.rows.item(0).id
                         });
                         $location.path("/quizs/" + result.rows.item(0).bid);
                     }
                 } else {
                     // assessor login
                     $cordovaSQLite.execute(db, query1, [$scope.loginData.username, $scope.user]).then(function(res) {
                         if (res.rows.length > 0) {
                             for (var i = 0; i < res.rows.length; i++) {
                                 Auth.setUser({
                                     username: res.rows.item(0).username
                                 });
                                 $cordovaSQLite.execute(db, "SELECT * FROM assessor_batch WHERE aid =?", [res.rows.item(0).aid]).then(function(re) {
                                     if (res.rows.length > 0) {
                                         for (var i = 0; i < res.rows.length; i++) {
                                             $location.path("/batch/" + re.rows.item(i).aid);
                                         }
                                     }

                                 });

                             }
                         } else {
                             //
                             $cordovaSQLite.execute(db, query2, [$scope.loginData.username, $scope.user]).then(function(rest) {
                                 if (rest.rows.length > 0) {
                                     for (var i = 0; i < rest.rows.length; i++) {
                                         Auth.setUser({
                                             username: rest.rows.item(0).tm_name,
                                             userid: rest.rows.item(0).id
                                         });
                                         $location.path("/tabmanager");
                                     }
                                 } else {
                                     alert("User name or password is wrong");
                                 }
                             }, function(error) {
                                 console.error(error);
                                 alert("User name or password is wrong");
                             });
                         }
                     }, function(error) {
                         console.error(error);
                         alert("User name or password is wrong");
                     });
                     //assessor login
                 }
             }, function(error) {
                 console.error(error);
                 alert("User name or password is wrong");
             });
         };

     });

     /**
      * Controller for thankyou.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */
     todoApp.controller("ThankyouController", function($scope, $ionicPlatform, $cordovaSQLite, Auth) {
         var json_arr = [];
         $ionicPlatform.ready(function() {

         });

         // console.log(json_arr);
         $scope.okay = function() {
             var query = "SELECT * FROM user_result ORDER BY id DESC";
             $cordovaSQLite.execute(db, query).then(function(result) {
                 if (result.rows.length > 0) {
                     for (var i = 0; i < result.rows.length; i++) {
                         $scope.result = result.rows.item(i).uid;

                     }
                 }
             }, function(error) {
                 console.error(error);
             });
             Auth.logout();
             if (navigator.app) {
                 navigator.app.exitApp();
             } else if (navigator.device) {
                 navigator.device.exitApp();
             }
         };

     });
     /**
      * Controller for Tab Manager.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */

     todoApp.controller("TabmanagerController", function($scope, $cordovaSQLite, $ionicPlatform, $stateParams, $http, $location, md5, Auth) {

         $scope.users = [];
         var json_arr = [];
         $ionicPlatform.ready(function() {
             var query = "SELECT user_result.*, tblUsers.username, tblUsers.first_name, tblUsers.last_name FROM user_result INNER JOIN tblUsers ON user_result.uid = tblUsers.id WHERE user_result.status = ?";
             $cordovaSQLite.execute(db, query, ['0']).then(function(result) {
                 if (result.rows.length > 0) {
                     for (var i = 0; i < result.rows.length; i++) {
                         $scope.users.push({
                             rid: result.rows.item(i).id,
                             username: result.rows.item(i).username,
                             first_name: result.rows.item(i).first_name,
                             last_name: result.rows.item(i).last_name
                         });

                     }
                 }
             }, function(error) {
                 console.error(error);
             });
             /*
        var query = "SELECT * FROM user_result WHERE status = ?";
      $cordovaSQLite.execute(db, query, ['0']).then(function(result) {
        if(result.rows.length > 0) {
          for(var i=0; i<result.rows.length;i++) {

              var query1 = "SELECT * FROM tblUsers WHERE id = ?";
      $cordovaSQLite.execute(db, query1, [result.rows.item(i).uid]).then(function(res) {
        if(res.rows.length > 0) {
          for(var j=0; j<res.rows.length;j++) {
            $scope.users.push(
              {
                uid: res.rows.item(j).id,
                username: res.rows.item(j).username,
                first_name: res.rows.item(j).first_name,
                last_name: res.rows.item(j).last_name
              }
            );
          }
        }
      }, function(error) {
        console.error(error);
      });
          }
        }
      }, function(error) {
        console.error(error);
      });
        */

         });
         /*
       $scope.allupload = function(){
           var query5 = "SELECT * FROM user_result WHERE status = ?";
      $cordovaSQLite.execute(db, query5, ['0']).then(function(reslt) {

        if(reslt.rows.length > 0) {
          for(var k=0; k<reslt.rows.length;k++) {
              json_arr.push(reslt.rows.item(k));
              //////////////////////////////
              console.log(json_arr);
              var output = '';
           angular.forEach(json_arr, function (object) {
            angular.forEach(object, function (value, key) {
                if(key == 'category_name'){
                    value = value.replace(/\//g,"yUdIs");
                   }
            output += key + '/'+value+'/';
            });
               var url = 'http://exam.imbueaura.com/index.php/api/result/'+output+'format/json';
               var keyid = reslt.rows.item(k).id;
               var uid = reslt.rows.item(k).uid;
      console.log(output);
          $http.get(url).success(function(data, status) {
            alert("Result Uploaded to server");

              var query4 = "UPDATE user_result SET status = ? WHERE id = ?";
      $cordovaSQLite.execute(db, query4, ['1', keyid ]).then(function(resty) {
          console.log(keyid);
          $scope.users.splice($scope.users.indexOf(uid), 1);
        }, function(error) {
          console.error(error);
       });
              json_arr = [];
              output = '';
        }).
    error(function(status) {
        alert("Please check your internet connection and try again");
              json_arr = [];
              output = '';
    });
           });

              //////////////////////////////

          }
        }


       }, function(error) {
        console.error(error);
      });
       };
      */
         $scope.upload = function(id) {
             // console.log(id.rid);

             var query3 = "SELECT * FROM user_result WHERE id = ? and status = ?";
             $cordovaSQLite.execute(db, query3, [id.rid, '0']).then(function(reslt) {

                 if (reslt.rows.length > 0) {
                     for (var k = 0; k < reslt.rows.length; k++) {
                         json_arr.push(reslt.rows.item(k));
                         //////////////////////////////
                         //  console.log(json_arr);
                         var output = '';
                         angular.forEach(json_arr, function(object) {
                             angular.forEach(object, function(value, key) {
                                 if (key == 'category_name') {
                                     value = value.replace(/\//g, "yUdIs");
                                 }
                                 output += key + '/' + value + '/';
                             });
                             var url = 'http://exam.imbueaura.com/index.php/api/result/' + output + 'format/json';
                             var keyid = reslt.rows.item(k).id;
                             // console.log(output);
                             $http.get(url).success(function(data, status) {
                                 alert("Result Uploaded to server");

                                 var query4 = "UPDATE user_result SET status = ? WHERE id = ?";
                                 $cordovaSQLite.execute(db, query4, ['1', keyid]).then(function(resty) {
                                     //  console.log(keyid);
                                     $scope.users.splice($scope.users.indexOf(id), 1);
                                 }, function(error) {
                                     console.error(error);
                                 });
                                 json_arr = [];
                                 output = '';
                             }).
                             error(function(status) {
                                 alert("Please check your internet connection and try again");
                                 json_arr = [];
                                 output = '';
                             });
                         });

                         //////////////////////////////

                     }
                 }


             }, function(error) {
                 console.error(error);
             });
         };
         $scope.logout = function() {
             Auth.logout();
             if (navigator.app) {
                 navigator.app.exitApp();
             } else if (navigator.device) {
                 navigator.device.exitApp();
             }
             $location.path("/login");
         };

     });
     /**
      * Controller for the Batch List.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */
     todoApp.controller("BatchController", function($scope, $ionicPlatform, $stateParams, $cordovaSQLite, $location, md5, Auth) {
         // Container for the categories in this Scope.
         $scope.batches = [];
         // Query Database for Categiories when the platform is ready.
         $ionicPlatform.ready(function() {
             if (db === null) {
                 $location.path("/config");
             }
             var query = "SELECT DISTINCT bid FROM assessor_batch WHERE aid = ?";
             $cordovaSQLite.execute(db, query, [$stateParams.accId]).then(function(result) {
                 if (result.rows.length > 0) {
                     for (var i = 0; i < result.rows.length; i++) {

                         var query1 = "SELECT DISTINCT bid, batch_name FROM batches WHERE bid = ?";
                         $cordovaSQLite.execute(db, query1, [result.rows.item(i).bid]).then(function(res) {
                             if (res.rows.length > 0) {
                                 for (var i = 0; i < res.rows.length; i++) {
                                     $scope.batches.push({
                                         bid: res.rows.item(i).bid,
                                         batch_name: res.rows.item(i).batch_name
                                     });
                                 }
                             }
                         }, function(error) {
                             console.error(error);
                         });
                     }
                 }
             }, function(error) {
                 console.error(error);
             });

         });
         $scope.logout = function() {
             Auth.logout();
             $location.path("/login");
         };
     });

     /**
      * Controller for the User Lists.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */
     todoApp.controller("UsersController", function($scope, $ionicPlatform, $stateParams, $cordovaSQLite, $location, md5, Auth) {
         // Container for the categories in this Scope.
         $scope.users = [];
         // Query Database for Categiories when the platform is ready.
         $ionicPlatform.ready(function() {
             if (db === null) {
                 $location.path("/config");
             }
             var query = "SELECT DISTINCT id, email, username, first_name, last_name FROM tblUsers WHERE bid = ?";
             $cordovaSQLite.execute(db, query, [$stateParams.batchId]).then(function(result) {
                 if (result.rows.length > 0) {
                     for (var i = 0; i < result.rows.length; i++) {
                         $scope.users.push({
                             uid: result.rows.item(i).id,
                             user_name: result.rows.item(i).username,
                             first_name: result.rows.item(i).first_name,
                             last_name: result.rows.item(i).last_name
                         });
                     }
                 }
             }, function(error) {
                 console.error(error);
             });
         });
         $scope.logout = function() {
             Auth.logout();
             $location.path("/login");
         };
     });

     /**
      * Controller for the QuizList.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */
     todoApp.directive('myMainDirective', function() {
         return function(scope, element, attrs) {

             angular.element(element).addClass('list animate-fade-slide-in-right');
         };
     });
     todoApp.directive('myRepeatDirective', function(ionicMaterialMotion, ionicMaterialInk) {
         return function(scope, element, attrs) {
             angular.element(element).css('border-bottom', '1px solid #eeeeee');
             angular.element(element).addClass('item item-avatar item-icon-right');
             if (scope.$last) {
                 // Set Ink
                 ionicMaterialInk.displayEffect();
                 ionicMaterialMotion.fadeSlideInRight();
             }
         };
     });
     todoApp.controller("QuizsController", function($scope, $ionicPlatform, $stateParams, $cordovaSQLite, $location, $timeout, md5, Auth, $http) {
         // Container for the categories in this Scope.
         $scope.quizs = [];

         $http.get('http://exam.imbueaura.com/index.php/api/quiz/format/json')
             .success(function(data, status, headers, config) {

                 var quiz = data;
                 angular.forEach(quiz, function(values, keys) {
                     var quid = values.quid;
                     var quiz_name = values.quiz_name;
                     var description = values.description;
                     var start_time = values.start_time;
                     var end_time = values.end_time;
                     var duration = values.duration;
                     var pass_percentage = values.pass_percentage;
                     var max_attempts = values.max_attempts;
                     var correct_score = values.correct_score;
                     var incorrect_score = values.incorrect_score;
                     var gid = values.gid;
                     var bid = values.bid;

                     var query = "INSERT INTO tblQuiz (quid,quiz_name,description,start_time,end_time,duration,pass_percentage,max_attempts,correct_score,incorrect_score,bid,gid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                     $cordovaSQLite.execute(db, query, [quid, quiz_name, description, start_time, end_time, duration, pass_percentage, max_attempts, correct_score, incorrect_score, bid, gid]).then(function(res) {

                         ////////////////////////////////////////
                         // Layout Methods
                         ////////////////////////////////////////

                         $scope.showNavBar = function() {
                             document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
                         };

                         $scope.noHeader = function() {
                             var content = document.getElementsByTagName('ion-content');
                             for (var i = 0; i < content.length; i++) {
                                 if (content[i].classList.contains('has-header')) {
                                     content[i].classList.toggle('has-header');
                                 }
                             }
                         };

                         $scope.isExpanded = true;
                         $scope.hasHeaderFabLeft = true;
                         $scope.hasHeaderFabRight = false;
                         $scope.hasHeader = function() {
                             var content = document.getElementsByTagName('ion-content');
                             for (var i = 0; i < content.length; i++) {
                                 if (!content[i].classList.contains('has-header')) {
                                     content[i].classList.toggle('has-header');
                                 }
                             }

                         };

                         $scope.showHeader = function() {
                             $scope.showNavBar();
                             $scope.hasHeader();
                         };

                         $scope.clearFabs = function() {
                             var fabs = document.getElementsByClassName('button-fab');
                             if (fabs.length && fabs.length > 1) {
                                 fabs[0].remove();
                             }
                         };


                         // Delay expansion
                         $timeout(function() {
                             $scope.isExpanded = true;
                         }, 300);
                         // Query Database for Categiories when the platform is ready.
                         $ionicPlatform.ready(function() {
                             if (db === null) {
                                 $location.path("/config");
                             }
                             // Set Motion



                             var query = "SELECT DISTINCT quid, quiz_name, duration, end_time, start_time FROM tblQuiz WHERE bid = ?";
                             $cordovaSQLite.execute(db, query, [$stateParams.batchId]).then(function(result) {
                                 if (result.rows.length > 0) {
                                     var todayDate = Math.floor(Date.now() / 1000);
                                     for (var i = 0; i < result.rows.length; i++) {
                                         var endTime = result.rows.item(i).end_time;
                                         var starttime = result.rows.item(i).start_time;
                                         console.log(result.rows.item(i).quiz_name);
                                         if (endTime > todayDate && result.rows.item(i).start_time < todayDate) {
                                             $scope.quizs.push({
                                                 quid: result.rows.item(i).quid,
                                                 quiz_name: result.rows.item(i).quiz_name,
                                                 duration: result.rows.item(i).duration
                                             });
                                             console.log($scope.quizs);
                                         }
                                     }
                                 }
                             }, function(error) {
                                 console.error(error);
                             });
                         });
                         $scope.logout = function() {
                             Auth.logout();
                             $location.path("/login");
                         };


                     })
                 })
             })

     });

     /**
      * Controller for the QuizDetail.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */

     todoApp.controller("AccessController", function($scope, $ionicPlatform, $ionicLoading, $sce, $stateParams, $cordovaSQLite, $location, OptionId, Auth, $http, $ionicPopup) {
         var query = "SELECT *  FROM tblQuiz";
         $cordovaSQLite.execute(db, query, []).then(function(res) {
             console.log(res);
                console.log("uid---------------",res.rows[0].uid);
             $http.get('http://exam.imbueaura.com/index.php/api/printquiz/qid/' + res.rows[0].quid + '/'+ res.rows[0].quid + '/format/json')

                 .success(function(data, status, headers, config) {

                     var ques = data;
                     angular.forEach(ques, function(value, key) {
                         var rid = value.rid;
                         var qid = value.qid;
                         var question = value.question;
                         var qtid = value.quid;
                         angular.forEach(value.options, function(val, ke) {
                             var query = "INSERT INTO tblOptions(qid,oid,option,option_score,quid) VALUES (?,?,?,?,?)";
                             $cordovaSQLite.execute(db, query, [qid, val.oid, val.option, val.option_score, qtid]).then(function(res) {

                             }, function(err) {
                                 console.error(err);
                             })
                         })

                         var query = "INSERT INTO Questions(rid,qid,quid,question) VALUES (?,?,?,?)";
                         $cordovaSQLite.execute(db, query, [rid, qid, qtid, question]).then(function(res) {
                             $http.get('http://exam.imbueaura.com/index.php/api/printresult/rid/' + rid + '/format/json')
                                 .success(function(data, status, headers, config) {

                                     var result_q = data;
                                     angular.forEach(result_q, function(values, keys) {

                                         var rid = values.rid;
                                         var uid = values.uid;
                                         var quid = values.quid;
                                         var qids = values.qids;
                                         var category_name = values.category_name;
                                         var qids_range = values.qids_range;
                                         var oids = values.oids;
                                         var start_time = values.start_time;
                                         var end_time = values.end_time;
                                         var last_response = values.last_response;
                                         var time_spent = values.time_spent;
                                         var time_spent_ind = values.time_spent_ind;
                                         var score = values.score;
                                         var percentage = values.percentage;
                                         var q_result = values.q_result;
                                         var status = values.status;
                                         var institute_id = values.institute_id;
                                         var photo = values.photo;
                                         var essay_ques = values.score_ind;
                                         var score_ind = values.score_ind;
                                         var query = "INSERT INTO total_result(rid, uid, quid,qids,category_name,qids_range,oids, start_time, end_time, last_response,time_spent, time_spent_ind, score, percentage, q_result, status, institute_id, photo, essay_ques, score_ind) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                                         $cordovaSQLite.execute(db, query, [rid, uid, quid, qids, category_name, qids_range, oids, start_time, end_time, last_response, time_spent, time_spent_ind, score, percentage, q_result, status, institute_id, photo, essay_ques, score_ind]).then(function(res) {

                                             //Start Code -----------------------------------------
                                             $scope.queses = [];
                                             $scope.queses_i = [];
                                             $scope.index = 1;
                                             $scope.duration = [];
                                             $scope.nos = 1;
                                             var json_arr = [];
                                             // $scope.queses = [];
                                             $scope.optionsd = [];
                                             $scope.options_nos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                                             var query = "SELECT DISTINCT qid FROM Questions WHERE quid = ?";

                                             /// --------------------Insert Questions ----------------------------------------------------------------//
                                             $cordovaSQLite.execute(db, query, [$stateParams.quizId]).then(function(result) {

                                                 $ionicLoading.show({
                                                     template: "Loading..."
                                                 });
                                                 if (result.rows.length > 0) {

                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         $scope.queses_i.push({
                                                             qid: result.rows.item(i).qid
                                                         });

                                                         $scope.rid = result.rows.item(0).rid;
                                                     } // main for

                                                 } else {

                                                     $scope.queses.push({
                                                         qid: "no data"
                                                     });
                                                 }
                                                 $ionicLoading.hide();
                                             }, function(error) {
                                                 console.error(error);
                                             });
                                             var start_time = Date.now() / 1000 | 0;

                                             // Query Database for Categiories when the platform is ready.

                                             $ionicPlatform.ready(function() {
                                                 if (db === null) {
                                                     $location.path("/config");
                                                 }
                                                 var query4 = "SELECT DISTINCT rid, qid, question FROM Questions WHERE quid = ? LIMIT 1";
                                                 $cordovaSQLite.execute(db, query4, [$stateParams.quizId]).then(function(result) {

                                                     $ionicLoading.show({
                                                         template: "Loading..."
                                                     });
                                                     if (result.rows.length > 0) {

                                                         for (var i = 0; i < result.rows.length; i++) {
                                                             $scope.queses.push({
                                                                 qid: result.rows.item(i).qid,
                                                                 question: $sce.trustAsHtml(result.rows.item(i).question)
                                                             });
                                                             var opt_qid = result.rows.item(0).qid;
                                                             $scope.opt_qid = result.rows.item(0).qid;
                                                             $scope.rid = result.rows.item(0).rid;
                                                             var query2 = "SELECT DISTINCT oid,qid,option,option_score FROM tblOptions WHERE qid = ?";
                                                             $cordovaSQLite.execute(db, query2, [opt_qid]).then(function(res) {
                                                                 $scope.optionsd[opt_qid] = [];
                                                                 if (res.rows.length > 0) {
                                                                     for (var j = 0; j < res.rows.length; j++) {

                                                                         $scope.optionsd[opt_qid].push({
                                                                             option_num: j,
                                                                             option_score: res.rows.item(j).option_score,
                                                                             qid: res.rows.item(j).qid,
                                                                             oid: res.rows.item(j).oid,
                                                                             opti: res.rows.item(j).option
                                                                         });
                                                                     } // main for
                                                                     $scope.optionsd[opt_qid]

                                                                 } else {
                                                                     ///////////////////////////////////////////change myself-------------------------------------------
                                                                     $scope.optionsd[opt_qid] = [];

                                                                     $scope.optionsd[opt_qid].push({
                                                                         opti: "no data"
                                                                     });
                                                                 }
                                                             }, function(error) {
                                                                 console.error(error);
                                                             });
                                                         } // main for
                                                     } else {
                                                         $scope.queses.push({
                                                             question: "no data"
                                                         });
                                                     }
                                                     $ionicLoading.hide();
                                                 }, function(error) {
                                                     console.error(error);
                                                 });
                                                 // $scope.duration = 20;
                                                 var query3 = "SELECT DISTINCT duration FROM tblQuiz WHERE quid = ?";
                                                 $cordovaSQLite.execute(db, query3, [$stateParams.quizId]).then(function(resu) {
                                                     if (resu.rows.length > 0) {
                                                         for (var i = 0; i < resu.rows.length; i++) {
                                                             $scope.duration.push({
                                                                 time: resu.rows.item(i).duration * 60
                                                             });
                                                         }
                                                     }
                                                 }, function(error) {
                                                     console.error(error);
                                                 });
                                                 ////  Timer
                                                 $scope.$on('timer-tick', function(event, data) {
                                                     if (data.millis == 300000) {
                                                         alert('Only 5 minutes left');
                                                     };
                                                     if (data.millis == 1000) {
                                                         // angular.element($scope.formSubmit).trigger('click');
                                                         $('#formSubmit').trigger("click");
                                                         alert('Sorry! timeout. Your all given answer is saved.');
                                                     };
                                                 });

                                                 // Navigation
                                                 $scope.itemClicked = function($index, $qid) {
                                                     $scope.index = $index;
                                                     $scope.opt_qid = $qid;
                                                     var answers = 'opt_' + $scope.opt_qid;
                                                     var ques_no = 'ques_' + $scope.opt_qid;
                                                     if ($("input[name=" + answers + "]:checked").length) {
                                                         var myEl = angular.element(document.querySelector('#' + ques_no));
                                                         myEl.removeClass('wrong_btn');
                                                         myEl.addClass('right_btn');
                                                     } else {
                                                         var myEl = angular.element(document.querySelector('#' + ques_no));
                                                         myEl.removeClass('right_btn');
                                                         myEl.addClass('wrong_btn');
                                                     }
                                                 };
                                                 //change Element
                                                 $scope.ChangE = function($qid) {


                                                     $scope.opt_qid = $qid;
                                                     var answers = 'opt_' + $scope.opt_qid;
                                                     var ques_no = 'ques_' + $scope.opt_qid;
                                                     if ($("input[name=" + answers + "]:checked").length) {
                                                         var myEl = angular.element(document.querySelector('#' + ques_no));
                                                         myEl.removeClass('wrong_btn');
                                                         myEl.addClass('right_btn');
                                                     } else {
                                                         var myEl = angular.element(document.querySelector('#' + ques_no));
                                                         myEl.removeClass('right_btn');
                                                         myEl.addClass('wrong_btn');
                                                     }
                                                 };

                                                 //Next Element

                                                 $scope.nextItem = function($index, $qid) {
                                                     var answers = 'opt_' + $scope.opt_qid;
                                                     var ques_no = 'ques_' + $scope.opt_qid;
                                                     if ($("input[name=" + answers + "]:checked").length) {
                                                         var myEl = angular.element(document.querySelector('#' + ques_no));
                                                         myEl.addClass('right_btn');
                                                     } else {
                                                         var myEl = angular.element(document.querySelector('#' + ques_no));
                                                         myEl.addClass('wrong_btn');
                                                     }
                                                     $scope.opt_qid = $qid;
                                                     $scope.index = $index;
                                                     var query_i = "SELECT DISTINCT rid, qid, question FROM Questions WHERE qid = ?";
                                                     $cordovaSQLite.execute(db, query_i, [$qid]).then(function(result) {
                                                         if (result.rows.length > 0) {
                                                             for (var i = 0; i < result.rows.length; i++) {
                                                                 $scope.queses.push({
                                                                     qid: result.rows.item(i).qid,
                                                                     question: $sce.trustAsHtml(result.rows.item(i).question)
                                                                 });
                                                                 $scope.optionsd[$qid] = [];
                                                                 var query_i2 = "SELECT DISTINCT oid,qid,option,option_score FROM tblOptions WHERE qid = ?";
                                                                 $cordovaSQLite.execute(db, query_i2, [$qid]).then(function(res) {
                                                                     if (res.rows.length > 0) {
                                                                         for (var j = 0; j < res.rows.length; j++) {
                                                                             $scope.optionsd[$qid].push({
                                                                                 option_num: j,
                                                                                 option_score: res.rows.item(j).option_score,
                                                                                 qid: res.rows.item(j).qid,
                                                                                 oid: res.rows.item(j).oid,
                                                                                 opti: res.rows.item(j).option
                                                                             });
                                                                         } // main for
                                                                     } else {
                                                                         $scope.optionsd[$qid].push({
                                                                             opti: "no data"
                                                                         });
                                                                     }
                                                                 }, function(error) {
                                                                     console.error(error);
                                                                 });
                                                             } // main for
                                                         } else {
                                                             $scope.queses.push({
                                                                 question: "no data"
                                                             });
                                                         }
                                                     }, function(error) {
                                                         console.error(error);
                                                     });

                                                 };

                                                 // Selected options
                                                 $scope.selected = {};

                                                 //---------------form Submit------------------------------------------
                                                 // Form Submit
                                                 $scope.formSubmit = function() {
                                                     var end_time = Date.now() / 1000 | 0;
                                                     var time_spent = (end_time - start_time) / 60 | 0;
                                                     var questionArray = [];
                                                     var answerArray = [];
                                                     var query = "SELECT DISTINCT quid,qids,category_name,qids_range,oids, start_time, end_time, last_response,time_spent, time_spent_ind, score, percentage, q_result, status, institute_id, photo, essay_ques, score_ind FROM total_result WHERE rid = ?";
                                                     $cordovaSQLite.execute(db, query, [$scope.rid]).then(function(res) {
                                                         console.log("res-------------------------", res);
                                                         if (res.rows.length > 0) {
                                                             var result = res;
                                                             for (var i = 0; i < res.rows.length; i++) {
                                                                 var qids_Json = JSON.stringify(res.rows.item(i).qids);
                                                                 var qid_Json = qids_Json.replace('"', '');
                                                                 var qidArray = qid_Json.replace('"', '').split(',');
                                                                 var qus_Arr = [];
                                                                 // qidArray.push(qid_Json);
                                                                 //console.log(qidArray);
                                                                 angular.forEach(qidArray, function(key, val) {
                                                                     qus_Arr.push(key);
                                                                     answerArray.push("0");
                                                                 });

                                                                 var opt_Json = JSON.stringify($scope.selected);
                                                                 var option_Json = $.parseJSON(opt_Json);
                                                                 console.log("oj----------------", opt_Json);
                                                                 $.each(option_Json, function(k, v) {
                                                                     questionArray.push(k);
                                                                     var index = qus_Arr.indexOf(k);
                                                                     if (index !== -1) {
                                                                         answerArray[index] = v;
                                                                     }
                                                                 });
                                                                 console.log("qa-----------------", questionArray);
                                                                 console.log("aa-----------------", answerArray);
                                                                 var _uid = Auth.getUser().userid;
                                                                 var _quid = res.rows.item(i).quid;
                                                                 var _qids = res.rows.item(i).qids;
                                                                 var _category_name = res.rows.item(i).category_name;
                                                                 var _qids_range = res.rows.item(i).qids_range;
                                                                 var _oids = answerArray.join(",");
                                                                 var time_spent_ind = res.rows.item(i).time_spent_ind;
                                                                 var score = res.rows.item(i).score;
                                                                 var percentage = res.rows.item(i).percentage;
                                                                 var q_result = res.rows.item(i).q_result;
                                                                 var status = res.rows.item(i).status;
                                                                 var institute_id = res.rows.item(i).institute_id;
                                                                 var photo = res.rows.item(i).photo;
                                                                 var essay_ques = res.rows.item(i).essay_ques;
                                                                 var score_ind = res.rows.item(i).score_ind;
                                                                 console.log("-------typeof uid", typeof _uid);
                                                                 console.log("-------typeof quid", typeof _uid);
                                                                 console.log("-------typeof oid", typeof _oids);
                                                                 var data = $.param({
                                                                     rid: "566",
                                                                     uid: _uid,
                                                                     qids: _qids,
                                                                     oids: _oids,
                                                                     end_time: end_time,
                                                                     time_spent_ind: time_spent_ind,

                                                                 });
                                                                 var config = {
                                                                     headers: {
                                                                         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                                                                     }
                                                                 }

                                                                 console.log("data--------------", data);
                                                                 $http.post('http://exam.imbueaura.com/index.php/api/quiz_submit/format/json', data, config).then(function(success) {
                                                                  console.log(success);
                                                                     if (success.data == "TRUE") {
                                                                         var querys = "INSERT INTO user_result (uid, quid,qids,category_name,qids_range,oids, start_time, end_time, last_response,time_spent, time_spent_ind, score, percentage, q_result, status, institute_id, photo, essay_ques, score_ind) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                                                         $cordovaSQLite.execute(db, querys, [_uid, _quid, _qids, _category_name, _qids_range, _oids, start_time, end_time, end_time, time_spent, time_spent_ind, score, percentage, q_result, status, institute_id, photo, essay_ques, score_ind]).then(function(res) {
                                                                             //  console.log(_qids);
                                                                         }, function(err) {
                                                                             console.error(err);
                                                                         });

                                                                         $location.path("/thankyou");
                                                                     } else {
                                                                         $ionicPopup.alert({
                                                                             title: 'error',
                                                                             template: 'Your examination not submitted successfully please contact with your examiner'
                                                                         });

                                                                       $location.path("/login");
                                                                     }

                                                                 }, function(error) {
                                                                     console.log("error-------------", error);
                                                                 });
                                                             } // Form Submit
                                                         }
                                                     }, function(error) {
                                                         console.error(error);
                                                     });

                                                 };
                                                 $scope.logout = function() {
                                                     Auth.logout();
                                                     $location.path("/login");
                                                 };

                                             })
                                             //==============================================================end
                                         });
                                     });
                                 }, function(err) {
                                     console.error(err);
                                 }, function(err) {

                                 });

                         })
                     })
                 }, function(err) {
                     console.log(err);
                 })

         })
     })
     /**
      * Controller for the QuizDetail.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */
     todoApp.controller("DetailController", function($scope, $sce, $ionicPlatform, $stateParams, $cordovaSQLite, $location, md5, Auth, ionicMaterialMotion) {
         // Container for the categories in this Scope.
         $scope.quizs = [];
         ionicMaterialMotion.fadeSlideInRight();
         // Query Database for Categiories when the platform is ready.
         $ionicPlatform.ready(function() {
             if (db === null) {
                 $location.path("/config");
             }
             var query = "SELECT * FROM tblQuiz WHERE quid = ?";
             $cordovaSQLite.execute(db, query, [$stateParams.quizId]).then(function(result) {
                 if (result.rows.length > 0) {

                     for (var i = 0; i < 1; i++) {
                         $scope.title = result.rows.item(i).quiz_name;
                         $scope.quizs.push({
                             quid: result.rows.item(i).quid,
                             quiz_name: result.rows.item(i).quiz_name,
                             duration: result.rows.item(i).duration,
                             description: $sce.trustAsHtml(result.rows.item(i).description),
                             start_time: result.rows.item(i).start_time,
                             end_time: result.rows.item(i).end_time,
                             pass_percentage: result.rows.item(i).pass_percentage
                         });

                     }
                 }
             }, function(error) {
                 console.error(error);
             });

         });
         $scope.logout = function() {
             Auth.logout();
             $location.path("/login");
         };
     });
     /**
      * Controller for the Categories.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */
     todoApp.controller("CategoriesController", function($scope, $ionicPlatform, $cordovaSQLite, $location, md5, Auth) {
         // Container for the categories in this Scope.
         $scope.categories = [];

         // Query Database for Categiories when the platform is ready.
         $ionicPlatform.ready(function() {
             if (db === null) {
                 $location.path("/config");
             }
             var query = "SELECT * FROM tblUsers";
             $cordovaSQLite.execute(db, query, []).then(function(result) {
                 if (result.rows.length > 0) {
                     for (var i = 0; i < result.rows.length; i++) {
                         $scope.categories.push({
                             id: result.rows.item(i).id,
                             username: result.rows.item(i).username
                         });
                     }
                 }
             }, function(error) {
                 console.error(error);
             });
         });
         $scope.logout = function() {
             Auth.logout();
             $location.path("/login");
         };
     });

     /**
      * Controller for the Lists.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite   cordovaSQLite-Plugin
      *  stateParams     Query-Parameters from ui-router.
      *  ionicPopup      ionicPopup-Service for the "Insert"
      */
     todoApp.controller("ListsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams, $ionicPopup, $location, Auth) {
         // Container for the lists in this Scope.
         $scope.lists = [];

         // Query Database for Lists when the platform is ready.
         $ionicPlatform.ready(function() {
             if (db === null) {
                 $location.path("/config");
             }
             var query = "SELECT id, category_id, todo_list_name FROM tblTodoLists WHERE category_id = ?";

             $cordovaSQLite.execute(db, query, [$stateParams.categoryId]).then(function(result) {
                 if (result.rows.length > 0) {
                     for (var i = 0; i < result.rows.length; i++) {
                         $scope.lists.push({
                             id: result.rows.item(i).id,
                             category_id: result.rows.item(i).category_id,
                             todo_list_name: result.rows.item(i).todo_list_name
                         });
                     }
                 }
             }, function(error) {
                 console.error(error);
             });
         });

         // Insert a new TodoList
         $scope.insert = function() {
             $ionicPopup.prompt({
                     title: "Enter a new Todo list",
                     inputType: "text"
                 })
                 .then(
                     function(result) {
                         if (result !== undefined) {
                             // INsert the ne TodoList
                             var query = "INSERT INTO tblTodoLists (category_id, todo_list_name) VALUES (?,?)";
                             $cordovaSQLite.execute(db, query, [$stateParams.categoryId, result]).then(function(res) {
                                 $scope.lists.push({
                                     id: res.insertId,
                                     category_id: $stateParams.categoryId,
                                     todo_list_name: result
                                 });
                             }, function(error) {
                                 console.error(error);
                             });
                         } else {
                             // The User clicked "cancel".
                             console.log("Action not completed");
                         }
                     })
         };
         $scope.logout = function() {
             Auth.logout();
             $location.path("/login");
         };
     });

     /**
      * Controller for the Items.
      * Directives:
      *  ionicPlatform   PlatformProvider
      *  cordovaSQLite
      */
     todoApp.controller("ItemsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams, $ionicPopup, $location, Auth) {
         // Container for the items in this Scope.
         $scope.items = [];

         // Query Database for items when the platform is ready.
         $ionicPlatform.ready(function() {
             if (db === null) {
                 $location.path("/config");
             }
             var query = "SELECT id, todo_list_id, todo_list_item_name FROM tblTodoListItems WHERE todo_list_id = ?";
             $cordovaSQLite.execute(db, query, [$stateParams.listId]).then(function(result) {
                 if (result.rows.length > 0) {
                     for (var i = 0; i < result.rows.length; i++) {
                         $scope.items.push({
                             id: result.rows.item(i).id,
                             todo_list_id: result.rows.item(i).todo_list_id,
                             todo_list_item_name: result.rows.item(i).todo_list_item_name
                         });
                     }
                 }
             }, function(error) {
                 console.error(error);
             });
         });

         // Insert a new TodoList
         $scope.insert = function() {
             $ionicPopup.prompt({
                     title: "Enter a new Todo list item",
                     inputType: "text"
                 })
                 .then(
                     function(result) {
                         if (result !== undefined) {
                             // INsert the ne TodoList
                             var query = "INSERT INTO tblTodoListItems (todo_list_id, todo_list_item_name) VALUES (?,?)";
                             $cordovaSQLite.execute(db, query, [$stateParams.listId, result]).then(function(res) {
                                 $scope.items.push({
                                     id: res.insertId,
                                     todo_list_id: $stateParams.listId,
                                     todo_list_item_name: result
                                 });
                             }, function(error) {
                                 console.error(error);
                             });
                         } else {
                             // The User clicked "cancel".
                             console.log("Action not completed");
                         }
                     })
         };
         $scope.logout = function() {
             Auth.logout();
             $location.path("/login");
         };
     });
