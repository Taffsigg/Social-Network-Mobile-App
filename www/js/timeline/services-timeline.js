angular.module('starter.services-timeline', [])

.factory('Timeline', function($q, Profile, Utils, Codes) {
    var self = this;

    self.getFeed = function(){
        var qGet = $q.defer();
        var ref = new Firebase(FBURL+'/posts')
        ref.on("value", function(allPosts) {
            qGet.resolve(allPosts.val());
        });
        return qGet.promise;
    };

    // retrieves all posts of the user
    self.getMyPosts = function(uid) {
        var qGet = $q.defer();
        var ref = new Firebase(FBURL);
        
        // Attach an asynchronous callback to read the data at our posts reference
        ref.child('posts_meta').child(uid).on("value", function(snapshot) {
            if(snapshot.val() != null) {
                qGet.resolve(snapshot.val());
            } else {
                qGet.resolve(null);
            }
        }, function (error) {
            Codes.handleError(error);
            qGet.reject(error);
        });
        return qGet.promise;
    };


    // retrieves all images for the specific post
    self.getImages = function(uid, postId){
        var qGet = $q.defer();
        var ref = new Firebase(FBURL);
        
        // Attach an asynchronous callback to read the data at our posts reference
        ref.child('posts_images').child(uid).child(postId).on("value", function(snapshot) {
            if(snapshot.val() != null) {
                qGet.resolve(snapshot.val());
            } else {
                qGet.resolve(null);
            }
        }, function (error) {
            Codes.handleError(error);
            qGet.reject(error);
        });
        return qGet.promise;
    };
    

    //self.addPost = function(uid, FormData , FormImages) {        old
    //    var qAdd = $q.defer();
    //    var ref = new Firebase(FBURL);
    //    var postId = generatePostId();
    //
    //    Utils.showMessage('Adding post...');
    //
    //    var paths = {};
    //    paths['/posts_meta/' + uid + '/' + postId]      = FormData;
    //    paths['/posts_images/' + uid + '/' + postId]    = FormImages;
    //
    //    var onComplete = function(error) {
    //        if (error) {
    //            Codes.handleError(error);
    //            qAdd.reject(error);
    //        } else {
    //            Utils.showMessage('Post added!', 1500);
    //            qAdd.resolve("POST_ADD_SUCCESS");
    //        }
    //    }
    //    ref.update(paths, onComplete);
    //    return qAdd.promise;
    //};

    self.addPost = function(uid,FormData) {      // new
        var qAdd = $q.defer();
        var ref = new Firebase(FBURL);
        var postId = generatePostId();

        Utils.showMessage('Adding post...');

        var paths = {};
        paths['/posts/' + postId] = FormData;
        paths['/posts_meta/' + uid + '/' + postId] = FormData;

        var onComplete = function(error) {
            if (error) {
                Codes.handleError(error);
                qAdd.reject(error);
            } else {
                Utils.showMessage('Post added!', 1500);
                qAdd.resolve("POST_ADD_SUCCESS");
            }
        }
        ref.update(paths, onComplete);
        return qAdd.promise;
    };
    
    // multi-location delete                     old
    self.deletePost = function(uid, postId) {
        var qDelete = $q.defer();
        var ref = new Firebase(FBURL);

        var paths = {};
        paths['/posts_meta/' + uid + '/' + postId]      = null;
        paths['/posts/' + postId]    = null;

        var onComplete = function(error) {
            if (error) {
                Codes.handleError(error);
                qDelete.reject(error);
            } else {
                Utils.showMessage('Post deleted!', 1000);
                qDelete.resolve("POST_DELETE_SUCCESS");
            }
        }
        ref.update(paths, onComplete);
        return qDelete.promise;
    };


    function generatePostId() {
        var d = new Date();
        
        var wordString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var letterPart = "";
        for (var i=0; i<10; i++) {
            letterPart = letterPart + wordString[Math.floor(26*Math.random())]
        };
        
        var fyear = d.getFullYear();
        var fmonth = d.getMonth()+1;
        var fday = d.getDate();
        var fhour = d.getHours();
        var fminute = d.getMinutes();
        
        fmonth = fmonth < 10 ? '0'+fmonth : fmonth;
        fday = fday < 10 ? '0'+fday : fday;
        fhour = fhour < 10 ? '0'+fhour : fhour;
        fminute = fminute < 10 ? '0'+fminute : fminute;
        
        var ftime = d.getTime();
        
        d = d.getTime();
        d = d.toString();
        
        return "P" + fyear + fmonth + fday + fhour + fminute + letterPart;
    };
    
    return self;
})