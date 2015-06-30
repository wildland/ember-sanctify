import Ember from 'ember';
import { module, test } from 'qunit';
import canAccessHelper from 'ember-sanctify/helpers/can-access';

module('helper:can-access');

var hasAccess;
var inverseYielded;
var templateYielded;
var helper;
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


    //canAccessHelper.set('container', {
    //  lookup: function() {
    //    return {
    //      canAccess: function() {
    //        return hasAccess;
    //      }
    //    };
    //  }
    //});
  },

  afterEach: function() {
    Ember.RSVP.all = _RSVP.all;
  }
});

//test('When the user has access the returned streams value equals true', function(assert) {
//  hasAccess = true;
//
//  canAccessHelper.compute(["application", "access"]);
//  assert.equal(canAccessHelper._stream.value(), true);
//});
//
//test('When the user does not has access the returned streams value equals false', function(assert) {
//  hasAccess = false;
//
//  canAccessHelper.compute(["application", "access"]);
//  assert.equal(helper._stream.value(), false);
//});
