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

angular.module('everemindApp').factory('ngLanguage', function ($localStorage, $window) {
    return {
        defaultLanguage: "pt-BR",
        languages: ["pt-BR", "en-US"],
        active: $localStorage.activeLanguage,
        langConfig: {
            'pt-BR': {
                img: "img/brazil.png",
                name: "Português",
                lang: "pt-BR"
            },
            'en-US': {
                img: "img/united-states.png",
                name: "English",
                lang: "en-US"
            }
        },
        getActive: function () {
            return this.langConfig[this.active];
        },
        getNonActives: function () {
            var arr = [];
            for (var i = 0; i < this.languages.length; i++) {
                if (this.languages[i] !== this.active) {
                    arr.push(this.langConfig[this.languages[i]]);
                }
            }
            return arr;
        },
        setLanguage: function (lang) {
            $localStorage.activeLanguage = lang;
            $localStorage.$save();
            this.active = lang;
            $window.location.reload();
        }
    };
});