

// check out https://github.com/tj/node-pwd

/**
 * Module dependencies.
 */

var crypto = require('crypto');

/**
 * Bytesize.
 */

var len = 512/32;

/**
 * Iterations. ~300ms
 */

var iterations = 1024;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */

exports.hash = function (pwd, salt, fn) {
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
      fn(err, hash.toString('base64'));
    });
  } else {
    fn = salt;
    crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
      if (err) return fn(err);
      fn(null, salt, hash.toString('base64'));
    });
  }
};
