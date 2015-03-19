import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Index Template Action Access', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting / shows other content when the user IS NOT an admin', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.access-block').text(), 'Not Admin', 'can-access else block IS visible');
  });
});

test('visiting / shows an admin link when the user IS an admin', function(assert) {
  var session = application.__container__.lookup('service:session');

  session.set('user', { isAdmin: true });

  visit('/');

  andThen(function() {
    assert.ok(find('.access-block').text(), 'Admin', 'can-access if block IS visible');
  });
});
