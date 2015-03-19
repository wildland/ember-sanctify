import Ember from 'ember';
import layout from '../templates/components/es-can-access';
import YieldInversableMixin from '../mixins/views/yield-inversable';

var ContentPromiseObject = Ember.Object.extend(Ember.PromiseProxyMixin, {
  content: null
});

export default Ember.Component.extend(YieldInversableMixin, {
  layout: layout,
  route: null,
  authorizableAction: null,
  policyArgs: null,

  authorizationPolicy: function() {
    var route = this.get('route');

    Ember.assert(
      'Must define a route attribute string to check authorization against.',
      route
    );

    var authorizationPolicy = this.container.lookup('policy:' + route);

    /*
      Default to ApplicationPolicy if policy does not exist
    */
    if (!authorizationPolicy) {
      authorizationPolicy = this.container.lookup('policy:application');
    }

    Ember.assert(
      'Must define a valid policy class. ' +
      'Either an application policy class is not defined or ' +
      'an existing route policy class is improperly exported',
      authorizationPolicy
    );

    return authorizationPolicy;
  }.property('route'),

  hasAccess: function() {
    return this.get('canAccessContentPromise.content');
  }.property('canAccessContentPromise.content'),

  canAccessContentPromise: function() {
    var args = this.get('policyArgs') || [];
    var authorizationPolicy = this.get('authorizationPolicy');
    var authorizableAction = this.get('authorizableAction');

    Ember.assert(
      'Must define a authorizableAction authorization (I.E. "create")',
      authorizableAction
    );

    var canAction = Ember.get(authorizationPolicy, 'can' + authorizableAction.capitalize());

    Ember.assert(
      'The authorization policy does not define the action being authorized',
      !!canAction
    );

    return ContentPromiseObject.create({
      promise: Ember.RSVP.all(args).then(function(args) {
        return canAction.apply(authorizationPolicy, args);
      })
    });
  }.property('canAccessPolicy', 'session.content.currenUser', 'authorizableAction', 'policyArgs')
});
