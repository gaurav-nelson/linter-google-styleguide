/*
 2018 Gaurav Nelson
 @license MIT
 @module wordusage
 @fileoverview
   Expose retext-google-styleguide's output as a function
*/
var VFile = require("vfile"),
  unified = require("unified"),
  english = require("retext-english"),
  sort = require("vfile-sort"),
  googlestyleguide = require("retext-google-styleguide");
module.exports = wordusage;
var text = unified().use(english).use(googlestyleguide);

function core(b, c) {
  var a = new VFile(b),
    d = c.parse(a);
  c.run(d, a);
  sort(a);
  return a
}

function wordusage(b) {
  return core(b, text)
};