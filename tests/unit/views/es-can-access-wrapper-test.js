import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';

var templateYielded;
var inverseYielded;

var appendView = function(view) {
  Ember.run(view, 'appendTo', '#qunit-fixture');
};

moduleFor('view:es-can-access-wrapper', 'Unit - es-can-access-wrapper View', {
  needs: [
    'component:es-can-access',
    'helper:es-yield-inverse',
    'policy:component-test-true',
    'policy:component-test-false'
  ],

  beforeEach: function() {
    templateYielded = false;
    inverseYielded = false;
  }
});

test('it renders the template block with valid policy access', function(assert) {
  assert.ok(!templateYielded);

  var view = this.subject({
    route: 'component-test-true',
    authorizableAction: 'access',

    template: Ember.Handlebars.compile('<div id="can-access-test" />'),
    inverse: Ember.Handlebars.compile('<div id="can-not-access-test" />')
  });

  appendView(view);
  assert.equal(view.$().find('div#can-access-test').length, 1);
});

test('it renders the inverse block with invalid policy access', function(assert) {
  assert.ok(!templateYielded);

  var view = this.subject({
    route: 'component-test-false',
    authorizableAction: 'access',

    template: Ember.Handlebars.compile('<div id="can-access-test" />'),
    inverse: Ember.Handlebars.compile('<div id="can-not-access-test" />')
  });

  appendView(view);
  assert.equal(view.$().find('div#can-not-access-test').length, 1);
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
  hasFirstArg = false;
  hasSecondArg = false;
  this.container.register('policy:component-test-args', ComponentTestArgs);

  var view = this.subject({
    route: 'component-test-args',
    authorizableAction: 'access',
    policyArgs: ["one", "two"],

    template: Ember.Handlebars.compile(''),
    inverse: Ember.Handlebars.compile('')
  });

  appendView(view);

  assert.equal(hasFirstArg, true);
  assert.equal(hasSecondArg, true);
});
