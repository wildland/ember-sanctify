import canAccess from 'ember-sanctify/helpers/can-access';
import { module, test } from 'qunit';

var inverseYielded;
var templateYielded;
var options;
var hash;
var env;

module('CanAccessHelper', {
  beforeEach: function() {
    templateYielded = false;
    inverseYielded = false;

    options = {
      template: function() {
        templateYielded = true;

        return '';
      },

      inverse: function() {
        inverseYielded = true;

        return '';
      }
    };

    hash = {};

    env = { helpers: { view: { helperFunction: function() { return true; } } } };
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  var result = canAccess.helperFunction(["posts", "access"], hash, options, env);
  assert.ok(result);
});
