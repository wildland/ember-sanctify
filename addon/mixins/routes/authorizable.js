import Ember from 'ember';

/*
*  Authorizes that the current user can access this route.
*/

export function invalidAccess(route, authorizationPolicy, transition) {
  var redirectionRoute = Ember.get(authorizationPolicy, 'redirectionRoute');

  transition.abort();

  if (redirectionRoute) {
    route.transitionTo(redirectionRoute);
  }
}

export default Ember.Mixin.create({
  afterModel: function(model, transition) {
    var self = this;
    var targetPath = transition.targetName.split('.').join('/');
    var authorizationPolicy = this.container.lookup('policy:' + targetPath);

    /*
      Default to 'app/policys/application', then 'ember-sanctify/policys/default' if policy does not exist
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

    var canAccess = authorizationPolicy.canAccess(this, model);

    Ember.RSVP.Promise.resolve(canAccess).then(function(hasAccess) {
      if (hasAccess) {
        return self._super();
      }
      else {
        invalidAccess(self, authorizationPolicy, transition);
      }
    }).catch(function(e) {
      console.log('Error processing policy: ', e);
      invalidAccess(self, authorizationPolicy, transition);
      throw e;
    });
  }
});
