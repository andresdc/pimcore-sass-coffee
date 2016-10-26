/**
 * Created by andre on 26/10/2016.
 */
// tests/part1/cart-summary-test.js
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var fs = require('fs');
var diff = require('diff');

/* --------------------- CONFIGURATION ------------------------------*/

var paths = {
    js_expected: './tests/js/expected',
    js_result: './tests/js/result/dist',
    js_maps: './tests/js/result/dist/maps',
    js_min: './tests/js/result/min',
    css_expected: './tests/css/expected',
    css_result: './tests/css/result/dist',
    css_maps: './tests/css/result/dist/maps',
    css_min: './tests/css/result/min'
};

var sucessFiles = [
    'success'
];

var errorFiles = [
    'error'
];


/* --------------------- TESTS DEFINITIONS ------------------------------*/

describe('SASSTest', function() {

    it('Verify if the SASS plugin creates the file expected for well created SASS files', function() {
        var arrayLength = sucessFiles.length;
        var i;
        for (i = 0; i < arrayLength; i++) {
            expect(fileExists(paths.css_result+"/"+sucessFiles[i]+".css")).to.equal(true);
            expect(fileExists(paths.css_min+"/"+sucessFiles[i]+".min.css")).to.equal(true);
        }
    });
    it('Verify if the SASS plugin does not create any file for bad created sass files', function() {
        var arrayLength = sucessFiles.length;
        var i;
        for (i = 0; i < errorFiles.length; i++) {
            expect(fileExists(paths.css_result+"/"+errorFiles[i]+".css")).to.equal(false);
        }
    });

    it('Verify if the CSS generated file is created as expected', function() {
        var arrayLength = sucessFiles.length;
        for (var i = 0; i < arrayLength; i++) {
            expect(areIdenticalFiles(paths.css_result+"/"+sucessFiles[i]+".css", paths.css_expected+"/"+sucessFiles[i]+".css")).to.equal(true);
        }
    });

    it('Verify if the minified CSS generated file is created as expected', function() {
        var arrayLength = sucessFiles.length;
        for (var i = 0; i < arrayLength; i++) {
            expect(areIdenticalFiles(paths.css_result+"/"+sucessFiles[i]+".css", paths.css_expected+"/"+sucessFiles[i]+".css")).to.equal(true);
        }
    });
});

describe('CoffeeTest', function() {

    it('Verify if the COFFEE plugin creates the file expected for well created COFFEE files', function() {
        var arrayLength = sucessFiles.length;
        var i;
        for (i = 0; i < arrayLength; i++) {
            expect(fileExists(paths.js_result+"/"+sucessFiles[i]+".js")).to.equal(true);
            expect(fileExists(paths.js_min+"/"+sucessFiles[i]+".min.js")).to.equal(true);
        }
    });
    it('Verify if the COFFEE plugin does not create any file for bad created COFFEE files', function() {
        var arrayLength = sucessFiles.length;
        var i;
        for (i = 0; i < errorFiles.length; i++) {
            expect(fileExists(paths.js_result+"/"+errorFiles[i]+".js")).to.equal(false);
        }
    });

    it('Verify if the JS generated file is created as expected', function() {
        var arrayLength = sucessFiles.length;
        for (var i = 0; i < arrayLength; i++) {
            expect(areIdenticalFiles(paths.js_result+"/"+sucessFiles[i]+".js", paths.js_expected+"/"+sucessFiles[i]+".js")).to.equal(true);
            expect(areIdenticalFiles(paths.js_min+"/"+sucessFiles[i]+".min.js", paths.js_expected+"/"+sucessFiles[i]+".min.js")).to.equal(true);
        }
    });

    it('Verify if the minifies JS generated file is created as expected', function() {
        var arrayLength = sucessFiles.length;
        for (var i = 0; i < arrayLength; i++) {
            expect(areIdenticalFiles(paths.js_min+"/"+sucessFiles[i]+".min.js", paths.js_expected+"/"+sucessFiles[i]+".min.js")).to.equal(true);
        }
    });
});

/* --------------------- HELPERS ------------------------------*/

areIdenticalFiles = function (path1, path2) {
    var source = "";
    var target = "";

    try {
        source = fs.readFileSync(path1, 'utf8');
    } catch(e) {
        console.error("error reading a.txt: " + e.message);
        return;
    }

    try {
        target = fs.readFileSync(path2, 'utf8');
    } catch(e) {
        console.error("error reading a.txt: " + e.message);
        return;
    }

    var results = diff.diffLines(source, target);
    var identical = true;

    results.forEach(function(part) {
        if(part.added) {
            console.log("added:   " + part.value);
            identical = false;
        }
        if(part.removed) {
            console.log("removed: " + part.value);
            identical = false;
        }
    });
    return identical;
};

fileExists = function (path) {
    try {
        fs.accessSync(path, fs.F_OK);
        return true;
    } catch (e) {
        return false;
    }
};