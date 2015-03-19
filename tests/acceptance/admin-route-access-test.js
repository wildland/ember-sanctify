import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Admin Route access', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('cannot visit /admin when the user is not an admin', function(assert) {
  visit('/admin');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
});

test('can visit /admin as admin', function(assert) {
  var session = application.__container__.lookup('service:session');

  session.set('user', { isAdmin: true });

  visit('/admin');

  andThen(function() {
    assert.equal(currentPath(), 'admin');
  });
});
