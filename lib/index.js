/**
 * @author Gaurav Nelson
 * @copyright 2017 Gaurav Nelson
 * @license MIT
 * @module atom:linter:google-styleguide
 * @fileoverview Linter.
 */

/* global atom Promise */

'use strict';

/* Dependencies (google-styleguide is lazy-loaded later). */

var deps = require('atom-package-deps');
var minimatch = require('minimatch');

var wordusage;

/* Expose. */
module.exports = {
    provideLinter: linter,
    activate: activate
};

var errorType = atom.config.get('linter-google-styleguide.severityLevel');
var getIgnoredWords = atom.config.get('linter-google-styleguide.ignoredWords');


var anyIngoredWords = false;
var IgnoredWordsArray = [];

if (getIgnoredWords) {
    IgnoredWordsArray = getIgnoredWords.split(',');
}
if (IgnoredWordsArray[0] != null) {
    anyIngoredWords = true;
}


/**
 * Activate.
 */
function activate() {
    deps.install('linter-google-styleguide');
}

function linter() {
    var CODE_EXPRESSION = /[“`]([^`]+)[`”]/g;

    return {
        grammarScopes: atom.config.get('linter-google-styleguide').grammars,
        name: 'google-styleguide',
        scope: 'file',
        lintsOnChange: true,
        lint: onchange
    };

    /**
     * Handle on-the-fly or on-save (depending on the
     * global atom-linter settings) events. Yeah!
     *
     * Loads `google-styleguide` on first invocation.
     *
     * @see https://github.com/atom-community/linter/wiki/Linter-API#messages
     *
     * @param {AtomTextEditor} editor - Access to editor.
     * @return {Promise.<Message, Error>} - Promise
     *  resolved with a list of linter-errors or an error.
     */
    function onchange(editor) {
        var settings = atom.config.get('linter-google-styleguide');
        errorType = settings.severityLevel;

        if (minimatch(editor.getPath(), settings.ignoreFiles)) {
            return [];
        }

        return new Promise(function (resolve, reject) {
            var messages;

            if (!wordusage) {
                wordusage = require('./wordusage');
            }

            try {
                //NOTE: Apply code matching before passing editor text to the function TBD
                messages = wordusage(editor.getText()).messages;
            } catch (err) {
                reject(err);
                console.log(err);
                return;
            }

            /**
             * Check ignored words
             * if there is a match remove corresponding Vfile Message
             */

            if (anyIngoredWords) {
                IgnoredWordsArray.forEach(function (word) {
                    for (var i = messages.length - 1; i >= 0; i--) {
                        if (messages[i].ruleId === word.toLowerCase().trim()) {
                            messages.splice(i, 1);
                        }
                    }
                });
            }

            resolve((messages || []).map(transform, editor));
        });
    }

    /**
     * Transform VFile messages
     * nested-tuple.
     *
     * @see https://github.com/wooorm/vfile#vfilemessage
     *
     * @param {VFileMessage} message - Virtual file error.
     * @return {Object} - Linter error.
     */
    function transform(message) {
        return {
            severity: errorType,
            excerpt: message.reason,
            location: {
                file: this.getPath(),
                position: toRange(message.location)
            }
        };
    }

    /**
     * Transform a reason for warning from google-styleguide into
     * pretty HTML.
     *
     * @param {string} reason - Messsage in plain-text.
     * @return {string} - Messsage in HTML.
     */
    //function toHTML(reason) {
    //  return reason.replace(CODE_EXPRESSION, '<code>$1</code>');
    //}

    /**
     * Transform a (stringified) vfile range to a linter
     * nested-tuple.
     *
     * @param {Object} location - Positional information.
     * @return {Array.<Array.<number>>} - Linter range.
     */
    function toRange(location) {
        return [
            [
                Number(location.start.line) - 1,
                Number(location.start.column) - 1
            ],
            [
                Number(location.end.line) - 1,
                Number(location.end.column) - 1
            ]
        ];
    }
}