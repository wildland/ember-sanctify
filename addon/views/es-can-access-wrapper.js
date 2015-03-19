import Ember from 'ember';
import layout from '../templates/es-can-access-wrapper-view';

export default Ember.View.extend({
  layout: layout,
  route: null,
  authorizableAction: null,
  policyArgs: null,
});
