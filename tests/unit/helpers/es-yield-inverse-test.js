import Ember from 'ember';
import esYieldInverse from 'ember-sanctify/helpers/es-yield-inverse';
import { module, test } from 'qunit';

var view;
var container;
var inverseYielded;
var options;

module('EsYieldInverseHelper', {
  setup: function() {
    var container = new Ember.Container();
  },

  teardown: function() {

  }
});

test('it calls _yieldInverse on the view', function(assert) {
  inverseYielded = false;

  view = {
    layout: true,

    _yieldInverse: function(context, options, morph) {
      return true;
    }
  };

  var result = esYieldInverse.helperFunction.call(view, null, null, {}, null);
  assert.ok(true);
});
