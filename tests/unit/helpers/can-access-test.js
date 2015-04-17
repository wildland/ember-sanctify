import Ember from 'ember';
import canAccessHelper from 'ember-sanctify/helpers/can-access';
import { module, test } from 'qunit';

var hasAccess;
var inverseYielded;
var templateYielded;
var options;
var hash;
var env;
var get = Ember.get;
var _RSVP = {};

module('CanAccessHelper', {
  beforeEach: function() {
    _RSVP.all = Ember.RSVP.all;

    /* Monkey patch, unit test doesn't need to support async */
    Ember.RSVP.all = function(args) {
      return {
        _state: args,

        then: function(callback) {
          this._state = callback(this._state);
          return this;
        }
      };
    };

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

    env = {
      data: {
        view: {
          controller: {},

          container: {
            lookup: function() {
              return {
                canAccess: function() {
                  return hasAccess;
                }
              };
            }
          },

          getStream: function(path) {
            var self = this;

            return {
              value: function() {
                return get(self, path);
              }
            };
          }
        }
      }
    };
  },

  afterEach: function() {
    Ember.RSVP.all = _RSVP.all;
  }
});

test('When the user has access the returned streams value equals true', function(assert) {
  hasAccess = true;

  var stream = canAccessHelper(["posts", "access"], hash, options, env);
  assert.equal(stream.value(), true);
});

test('When the user does not has access the returned streams value equals false', function(assert) {
  hasAccess = false;

  var stream = canAccessHelper(["posts", "access"], hash, options, env);
  assert.equal(stream.value(), false);
});
