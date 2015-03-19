import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

var templateYielded;
var inverseYielded;

moduleForComponent('es-can-access', 'Unit - es-can-access Component', {
  needs: [
    'helper:es-yield-inverse', 'policy:component-test-true', 'policy:component-test-false'
  ],

  beforeEach: function() {
    templateYielded = false;
    inverseYielded = false;
  }
});

test('it renders the template block with valid policy access', function(assert) {
  assert.ok(!templateYielded);
  assert.ok(!inverseYielded);

  var component = this.subject({
    route: 'component-test-true',
    authorizableAction: 'access',

    template: Ember.Handlebars.compile('<div id="can-access-test" />'),
    inverse: Ember.Handlebars.compile('<div id="can-not-access-test" />')
  });

  this.render();
  assert.equal(component.$().find('div#can-access-test').length, 1);
});

test('it renders the inverse block with invalid policy access', function(assert) {
  assert.ok(!templateYielded);
  assert.ok(!inverseYielded);

  var component = this.subject({
    route: 'component-test-false',
    authorizableAction: 'access',

    template: Ember.Handlebars.compile('<div id="can-access-test" />'),
    inverse: Ember.Handlebars.compile('<div id="can-not-access-test" />')
  });

  this.render();
  assert.equal(component.$().find('div#can-not-access-test').length, 1);
});

var hasFirstArg;
var hasSecondArg;
var ComponentTestArgs = Ember.Object.extend({
  canAccess: function(one, two) {
    hasFirstArg = one === 'one';
    hasSecondArg = two === 'two';
  }
});

test('it calls the policy access function with the policy args', function(assert) {
  assert.ok(!hasFirstArg);
  assert.ok(!hasSecondArg);

  hasFirstArg = false;
  hasSecondArg = false;
  this.container.register('policy:component-test-args', ComponentTestArgs);

  var component = this.subject({
    route: 'component-test-args',
    authorizableAction: 'access',
    policyArgs: ["one", "two"],

    template: Ember.Handlebars.compile(''),
    inverse: Ember.Handlebars.compile('')
  });

  this.render();

  assert.equal(hasFirstArg, true);
  assert.equal(hasSecondArg, true);
});
