var todoApp = angular.module('starter');
todoApp.controller("studentPasswordCtrl", function($scope, $ionicPlatform, $http, $cordovaSQLite, $location, AccessorAuth, md5, $ionicLoading, $ionicPopup) {
  var response = AccessorAuth.getUser().response;
  var aid = response.aid;
  $scope.getData = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner><p class = "loader1">Please Wait...</p>'
      // noBackdrop: truecrescent
    });
    $http.get('http://exam.imbueaura.com/index.php/api_acc/allbatch/aid/' + response.aid + '/format/json')
      .then(
        function(response) {
          // success callback

          $scope.studentPassword = response.data;

          console.log($scope.studentPassword);
          $ionicLoading.hide();

        },
        function(response) {
          $ionicPopup.alert({
            title: 'Error!',
            template: 'No Data Found'
          });
          $ionicLoading.hide();

          // failure callback
        }
      );
  }
  $scope.getData();




})

todoApp.controller("viewPasswordCtrl", function($scope, $ionicPlatform, $http, $location, AccessorAuth, md5, $ionicLoading, $ionicPopup, $filter, $stateParams, $cordovaFile, $cordovaFileOpener2) {
  $scope.viewPassword = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner><p class = "loader1">Please Wait...</p>'
      // noBackdrop: truecrescent
    });
    $http.get('http://exam.imbueaura.com/index.php/api_acc/users/bid/' + $stateParams.bid + '/format/json')
      .then(
        function(response) {
          // success callback

          var viewPassword = response.data;
          $scope.filtered = $filter('orderBy')(viewPassword, 'id');
          console.log($scope.filtered);
          $ionicLoading.hide();

        },
        function(response) {
          $ionicPopup.alert({
            title: 'Error!',
            template: 'No Data Found '
          });
          $ionicLoading.hide();

          // failure callback
        }
      );
  }
  $scope.viewPassword();
  $scope.createPdf = function(password) {

    var date = new Date();

    function buildTableBody(data, columns) {
      var body = [
        [{
            text: 'ID',
            style: 'subheader'
          },
          {
            text: 'Batch ID',
            style: 'subheader'
          },
          {
            text: 'Batch Name',
            style: 'subheader'
          },
          {
            text: 'Batch City',
            style: 'subheader'
          },
          {
            text: 'Username',
            style: 'subheader'
          },
          {
            text: 'Password',
            style: 'subheader'
          }

        ]
      ];

      data.forEach(function(row) {
        console.log(row);
        var dataRow = [];

        columns.forEach(function(column) {

          dataRow.push(row[column]);

        })

        body.push(dataRow);
      });
      console.log(body);
      return body;
    }

    function table(data, columns) {
      console.log(columns);
      return {
        table: {
          widths: [50, 60, 100, 80, 80, 100],
          headerRows: 2,

          body: buildTableBody(data, columns),

        }

      };
    }
    var docDefinition = {
      content: [{
          columns: [{
            image: 'data:image/png;base64,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',
            width: 75

          }, {
            text: 'Student Login List',
            style: 'header3'
          }]
        },
        table(password, ['id', 'batch_name', 'batch_fname', 'batch_city', 'username', 'user_mname']),


      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',

        },
        subheader: {
          fontSize: 14,
          bold: true,
          alignment: 'center',

        },
        margin: {
          margin: [0, 0, 0, 0],
        },
        header1: {
          fontSize: 16,
          bold: true,
          alignment: 'left',
        },
        header2: {
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        header3: {
          fontSize: 15,
          bold: true,
          alignment: 'right',
        }
      }
    };
    console.log(pdfMake);

    pdfMake.createPdf(docDefinition).getBuffer(function(buffer) {

      var filename = "StudentDetail.pdf";
      var pdfname = filename.replace(/ /g, "_");
      var utf8 = new Uint8Array(buffer);
      var binaryArray = utf8.buffer; // Convert to Binary...
      var blob = new Blob([binaryArray], {
        type: 'application/pdf'
      });
      var pdfUrl = URL.createObjectURL(blob);

      $cordovaFile.createDir(cordova.file.externalDataDirectory, "StudentDetail", true)
        .then(function(success) {
          console.log("+++++++++++++",cordova.file.externalDataDirectory);
           console.log("success1=========",success);
          $cordovaFile.writeFile(cordova.file.dataDirectory + "StudentDetail/", pdfname, binaryArray, true)
            .then(function(success) {
           console.log("success2=========",success);
              $cordovaFileOpener2.open(
                'file:///storage/emulated/0/Android/data/io.ionic.starter/files/StudentDetail/' + pdfname,
                'application/pdf'
              ).then(function(success) {
                console.log(success);
              }, function(err) {
                err = JSON.stringify(err);
                alert(err);
                alert("error1");
              });

            }, function(err) {

              err = JSON.stringify(err);
              alert(err);
              alert("error2");
            })
        }, function(err) {

          err = JSON.stringify(err);
          alert(err);
          alert("error3");
        })

    }, function(err) {

      err = JSON.stringify(err);
      alert(err);
      alert("error4");
    })
    //    $modalInstance.dismiss();
  }

})

todoApp.controller("pendingAssessmantCtrl", function($scope, $ionicPlatform, $http, $location, AccessorAuth, md5, $ionicLoading, $ionicPopup) {

  var response = AccessorAuth.getUser().response;
  var aid = response.aid;
  var gid = response.gid;
  console.log('=============================', aid);
  console.log('=============================', gid);
  $ionicLoading.show({
    template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner><p class = "loader1">Please Wait...</p>'
    // noBackdrop: truecrescent
  });
  $http.get('http://exam.imbueaura.com/index.php/api_acc/pending_assesment/aid/' + response.aid + '/gid/' + response.gid + '/format/json')
    .then(
      function(response) {
        // success callback
        $scope.pending_assesment = response.data;

        console.log(response);
        $ionicLoading.hide();

      },
      function(response) {
        $ionicPopup.alert({
          title: 'Error!',
          template: 'No Data Found'
        });
        $ionicLoading.hide();

        // failure callback
      }
    );
})

todoApp.controller("completeAssessmantCtrl", function($scope, $ionicPlatform, $http, $location, AccessorAuth, md5, $ionicLoading, $ionicPopup) {

  var response = AccessorAuth.getUser().response;
  var aid = response.aid;
  var gid = response.gid;
  console.log('=============================', aid);
  console.log('=============================', gid);
  $ionicLoading.show({
    template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner><p class = "loader1">Please Wait...</p>'
    // noBackdrop: truecrescent
  });
  $http.get('http://exam.imbueaura.com/index.php/api_acc/complete_assesment/aid/' + response.aid + '/gid/' + response.gid + '/format/json')
    .then(
      function(response) {
        // success callback
        $scope.complete_assesment = response.data;


        $ionicLoading.hide();

      },
      function(response) {
        $ionicPopup.alert({
          title: 'Error!',
          template: 'No Data Found'
        });
        $ionicLoading.hide();

        // failure callback
      }
    );
})

todoApp.controller("attemptAssessmantCtrl", function($scope, $ionicPlatform, $http, $location, AccessorAuth, md5, $ionicLoading, $ionicPopup) {

  var response = AccessorAuth.getUser().response;
  var aid = response.aid;
  var gid = response.gid;
  console.log('=============================', aid);
  console.log('=============================', gid);
  $ionicLoading.show({
    template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner><p class = "loader1">Please Wait...</p>'
    // noBackdrop: truecrescent
  });
  $http.get('http://exam.imbueaura.com/index.php/api_acc/upcoming_assesment/aid/' + response.aid + '/gid/' + response.gid + '/format/json')
    .then(
      function(response) {
        // success callback
        console.log(response.data);
        $scope.upcoming_assesment = response.data;


        $ionicLoading.hide();

      },
      function(response) {
        $ionicPopup.alert({
          title: 'Error!',
          template: 'No Data Found'
        });
        $ionicLoading.hide();

        // failure callback
      }
    );
})

todoApp.controller("viewAttemptCtrl", function($scope, $ionicPlatform, $http, $location, AccessorAuth, md5, $ionicLoading, $ionicPopup,$stateParams) {
 var bid = $stateParams.bid ;
  $ionicLoading.show({
    template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner><p class = "loader1">Please Wait...</p>'
    // noBackdrop: truecrescent
  });
  $http.get('http://exam.imbueaura.com/index.php/api_acc/users/bid/' + bid + '/format/json')
    .then(
      function(response) {
        // success callback
    console.log(response.data);
        $scope.viewAttempt = response.data;
        $ionicLoading.hide();

      },
      function(response) {
        $ionicPopup.alert({
          title: 'Error!',
          template: 'No Data Found'
        });
        $ionicLoading.hide();

        // failure callback
      }
    );
})

















todoApp.controller("logoutCtrl", function($scope, $ionicPlatform, $http, $location, AccessorAuth, md5, $ionicLoading, $ionicPopup) {
  $scope.logout = function() {
    AccessorAuth.logout();
    if (navigator.app) {
      navigator.app.exitApp();
    } else if (navigator.device) {
      navigator.device.exitApp();
    }
    $location.path("/login");
  };
  $scope.logout();
})
