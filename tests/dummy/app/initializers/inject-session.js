import Ember from 'ember';

var Session = Ember.Object.extend({
  user: null
});

export function initialize(container, application) {
  application.register('service:session', Session.create(), { instantiate: false });
}

export default {
  name: 'inject-session',
  initialize: initialize
};
