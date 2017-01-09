// var autoUpdater = require('electron').autoUpdater;
// console.check("autoUpdater 1:",autoUpdater);

// var remote1 = require('electron').remote
// autoUpdater = remote1.autoUpdater;

// const autoUpdater = require('electron')
// console.check("autoUpdater is :",autoUpdater);
var remote = require('electron').remote
autoUpdater = remote.autoUpdater
var dialog = remote.dialog;
console.check("autoUpdater checking:::", autoUpdater);

/* 1. get url for mac from images.sb bucket. 
   2. create a local server 
   3. hit url from server and with current version and url. 
      if current version not equal to cloud version return new url to server with 200 to update
      else return with 201 status (reject updating)
   4. With returned url autoUpdater has to update. 
**/   
    
/* Getting url from 
   appUpdater
   {
    "version": "2.11.16",
    "mode": "live",
    "downloadURL": "http://images.sb.a-cti.com/TC/electron/test-1.x/app/appUpdates-live-2.11.16.zip"
   }
   engineUpdation:
   // http://images.sb.a-cti.com/TC/electron/live/engine/app-mac-0.37.8.zip

*/
/*
  Local server
  1. local server will take url and check for availability. 
  2. if you current version not equal to cloud version, it will return cloud version's url 
  3. download file from url and save somewhere. 
  4. quit old app and install new app. 
*/

//http://localhost:3000?updater=updater&version=0.37.8
var updaterTest = {
    //url: 'http://endpointhelper-dot-web-analytics-demo.appspot.com/endpointhelper',
    // http://localhost:9000/update/darwin?version=1.3.12
   // url: 'http://localhost:3000?updater=updater',
    url: 'http://localhost:9000/update/darwin',
    winurl:'http://localhost:9000/update/win32/',
    seturl: function() {
        
        if(/^win32/.test(process.platform)){
          autoUpdater.setFeedURL(this.winurl + 'AnywhereWorks-windows.zip');
          console.check("Inside updaterTest seturl: Url is:",this.winurl + 'AnywhereWorks-windows.zip');
        }else{
          autoUpdater.setFeedURL(this.url + '?version=1.3.12');
          console.check("Inside updaterTest seturl: Url is:",this.url + '?version=1.3.12');
        }
        console.check("autoUpdater ::", autoUpdater);

        console.check("getURL::",autoUpdater.getFeedURL());
        autoUpdater.checkForUpdates();

        autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndInstall) {
            //autoUpdater.on('update-downloaded', function() {
            console.check("arguments in update-downloaded:",arguments);
            //console.check("RES::", event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate);
            var index = dialog.showMessageBox(util.getCurrentWindow(), {
                type: 'info',
                buttons: ['Restart', 'Later'],
                message: 'A new version is available! Please restart the app to apply the updates.',
                detail: releaseName + "\n\n" + releaseNotes
            });
            if (index !== 1) {
               console.check("quitAndInstall ::");
                quitAndInstall();
            }

        }.bind(this));

        autoUpdater.on('checking-for-update', function() {
            console.check("arguments checking-for-update:",arguments);
        });

        autoUpdater.on('update-not-available', function() {
            console.check("arguments update-not-available:",arguments);
        });

        autoUpdater.on('update-available', function() {
            console.check("arguments update-available:",arguments);
        });

        autoUpdater.on('error',function(error) {
          console.check("Error arguments :",arguments);
            if(error){
              console.check("Error in UpdaterTest:",error);
              console.check("Error in UpdaterTest:",error.message);
              console.check("Error in UpdaterTest:",error.stack);

            }
        });

    }
    // start: function() {
    //     console.check("Inside updaterTest start:");
    //    autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    //        //autoUpdater.on('update-downloaded', function() {
    //         //console.check("arguments:",arguments);
    //         console.check("RES::", event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate);
    //     });
    // }
};
updaterTest.seturl();