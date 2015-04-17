import canAccessHelper from 'ember-sanctify/helpers/can-access';

export function initialize(/* container, application */) {
  Ember.HTMLBars._registerHelper('can-access', canAccessHelper);
}

export default {
  name: 'sanctify-helpers',
  initialize: initialize
};
