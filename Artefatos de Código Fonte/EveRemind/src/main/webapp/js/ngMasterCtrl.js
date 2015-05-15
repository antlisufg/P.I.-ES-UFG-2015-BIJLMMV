/* 
 * The MIT License
 *
 * Copyright 2015 Leonardo.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* global angular, pagesConfig, pageID */

angular.module('everemindApp').controller('ngMasterCtrl', function ($scope, ngNotifier, $localStorage) {
    var pendingMessages = function(){
        if ($localStorage.$default.pendingMessage){
            var msg = $localStorage.$default.pendingMessage;
            ngNotifier[msg.msgType](msg.msg);
            $localStorage.$default.pendingMessage = null;
        }
    };
    
    var checkAuth = function(){
        if (pagesConfig[pageID].access === "auth" && !$localStorage.$default.sessionUser){
            $localStorage.$default.pendingMessage = {msg: "general.notifications.notAuthorized", msgType: "error"};
            window.location.href = "/";
        }
    };
    
    $scope.$watch(
        function() { 
            return $localStorage.$default.sessionUser; 
        }, 
        function() {
            checkAuth();
        }
    );
    
    checkAuth();
    pendingMessages();
});