import Ember from 'ember';

function lookupPolicy(container, policyLookupName) {
  Ember.assert(
    'Must define a path attribute string to check authorization against.',
    policyLookupName
  );

  var authorizationPolicy = container.lookup('policy:' + policyLookupName);

  /*
    Default to ApplicationPolicy if policy does not exist
  */
  if (!authorizationPolicy) {
    authorizationPolicy = container.lookup('policy:application');
  }

  Ember.assert(
    'Must define a valid policy class. ' +
    'Either an application policy class is not defined or ' +
    'an existing route policy class is improperly exported',
    authorizationPolicy
  );

  return authorizationPolicy;
}

function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createAccessPromise(authorizationPolicy, authorizableAction, args) {
  Ember.assert(
    'Must define a authorizableAction authorization (I.E. "create")',
    authorizableAction
  );

  var canMethod = `can${capitalizeString(authorizableAction)}`;
  var canAction = Ember.get(authorizationPolicy, canMethod);

  Ember.assert(
    `The authorization policy does not define the action '${canMethod}' being authorized`,
    !!canAction
  );

  return Ember.RSVP.all(args).then(function(args) {
    return canAction.apply(authorizationPolicy, args);
  });
}

export default Ember.Helper.extend({
  canAccess: false,
  policy: null,

  compute([policyLookupName, action, ...args]) {
    var policy = lookupPolicy(this.container, policyLookupName);

    createAccessPromise(policy, action, args).then((canAccess) => {
      this.set('canAccess', canAccess);
    });

    return this.get('canAccess');
  },

  recomputeAccess: Ember.observer('canAccess', function() {
    this.recompute();
  })
});
