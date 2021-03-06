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

/* global angular */

angular.module('everemindApp').controller('ngListViewCtrl', function ($scope, ngNotifier, translateFilter, $localStorage) {
    $scope.$storage = $localStorage;
    
    $scope.data = {
        showActivities: false,
        loadingCategories: true,
        loadingActivities: false,
        sortBy: "date",
        showOutOfDate: false,
        showDone: false,
        categories: [],
        activities: [],
        activity: null,
        loadCat: ""
    };
    
    $scope.$watch(
            function (scope) {
                return scope.$storage.refreshCategories;
            },
            function () {
                if ($scope.$storage.refreshCategories) {
                    $scope.data.loadingCategories = true;
                    $scope.$apply();
                    $scope.$storage.refreshCategories = null;
                    $scope.$storage.$save();
                    $scope.getUserCategories();
                    $scope.$apply();
                }
            }
    );
    
    $scope.$watchGroup(['data.loadCat', 'data.sortBy', 'data.showOutOfDate', 'data.showDone', 'data.activity'], function(newValues, oldValues, scope) {
        $scope.loadActivities();
        $scope.$apply();
    });
    
    $scope.refreshCategories = function () {
        $.getJSON("ServletGetUserCategories?idUser=" + $scope.$storage.sessionUser._id + "&activities=false", {}, function (data) {
            updateCategories(data);
        });
    };
    
    $scope.loadActivities = function(){
        if ($scope.data.loadCat !== ""){
            $scope.data.showActivities = true;
            $scope.data.loadingActivities = true;
            $.getJSON(
                    "ServletGetUserActivities?idUser=" + $scope.$storage.sessionUser._id + 
                    "&category=" + $scope.data.loadCat + 
                    "&sortBy=" + $scope.data.sortBy + 
                    "&showOutOfDate=" + $scope.data.showOutOfDate + 
                    "&showDone=" + $scope.data.showDone, 
            {}, function (data) {
                updateActivities(data);
            });
        }
    };
    
    $scope.setActivity = function(index){
        $scope.data.activity = $scope.data.activities[index];
        $(".list-activity").removeClass("hidden-element");
    };
    
    $scope.makeBtnStyle = function(color){
        return {
            'background-color': color, 
            'border-color': color
        };
    };
    
    $scope.getCategoryName = function(id){
        for (var i = 0; i < $scope.data.categories.length; i++){
            if ($scope.data.categories[i].id === id){
                return $scope.data.categories[i].name;
            }
        }
    };
    
    $scope.getActivityPriority = function(priority){
        var priorities = {
            "0": ["primary", "low"],
            "1": ["success", "mid"],
            "2": ["warning", "high"],
            "3": ["danger", "critical"]
        };
        
        return "<span class='span-" + priorities[priority][0] + "'>" + translateFilter("dashboard.addActivity.priorities." + priorities[priority][1]) + "</span>";
    };
    
    $scope.markDoneActivity = function(id){
        $.ajax({
            dataType: "text",
            url: "ServletUpdateDone?id=" + id,
            success: function () {
                $scope.data.activity.done = true;
                $scope.loadActivities();
                $scope.$storage.$save();
                $scope.$apply();
                ngNotifier.notify("dashboard.markDoneActivityMsg");
            }
        });
    };
    
    $scope.getPriorityColor = function(priority, idCategory, transparent){
        var opacity = "1";
        if (transparent)
            opacity = "0.5";
        var color = "white";
        for (var i = 0; i < $scope.data.categories.length; i++){
            if ($scope.data.categories[i].id === idCategory){
                color = $scope.data.categories[i].color;
                break;
            }
        }
        var priorities = {
            "0": {border: '1px solid #337AB7', 'border-top': '5px solid #337AB7', 'background-color': color, opacity: opacity},
            "1": {border: '1px solid #5CB85C', 'border-top': '5px solid #5CB85C', 'background-color': color, opacity: opacity},
            "2": {border: '1px solid #F0AD4E', 'border-top': '5px solid #F0AD4E', 'background-color': color, opacity: opacity},
            "3": {border: '1px solid #D9534F', 'border-top': '5px solid #D9534F', 'background-color': color, opacity: opacity}
        };
        if (!priorities[priority])
            return {border: '1px solid black'};
        
        return priorities[priority];
    };
    
    $scope.getActivityTooltip = function(done, expired){
        if (done)
            return {title: 'listView.status.done', placement: 'right'};
        else if (expired && !done)
            return {title: 'listView.status.expired', placement: 'right'};
        else if (!done && !expired)
            return {title: 'listView.status.inTime', placement: 'right'};
    };
    
    var updateCategories = function(data){
        $scope.data.categories = data;
        $scope.data.loadingCategories = false;
        $scope.$apply();
    };
    
    var updateActivities = function(data){
        $scope.data.activities = data;
        $scope.data.loadingActivities = false;
        $scope.$apply();
    };
});