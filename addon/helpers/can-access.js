import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var _guid = 0;

function guid(policyName, actionName) {
  return [policyName, actionName, 'promise', (++_guid)].join('-');
}

function read(object) {
  if (object && object.isStream) {
    return object.value();
  } else {
    return object;
  }
}

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

  var canAction = Ember.get(authorizationPolicy, 'can' + capitalizeString(authorizableAction));

  Ember.assert(
    'The authorization policy does not define the action being authorized',
    !!canAction
  );

  return Ember.RSVP.all(args).then(function(args) {
    return canAction.apply(authorizationPolicy, args);
  });
}

export default function(params, hash, options, env) {
  var policyLookupName = params[0];
  var action = params[1];
  var view = env.data.view;
  var controller = get(view, 'controller');
  var container = view.container;
  var args = [];

  for(var i = 2; i < params.length; i++) {
    args.push(read(params[i]));
  }

  var holder = get(controller, '_policies');
  if (!holder) {
    holder = Ember.Object.create();
    set(controller, '_policies', holder);
  }

  var policy = lookupPolicy(container, policyLookupName);
  var accessPromiseId = guid(policyLookupName, action);
  var canResultPropertyName = ['controller._policies', accessPromiseId].join('.');
  set(holder, accessPromiseId, false);

  createAccessPromise(policy, action, args).then(function(canAccess) {
    set(holder, accessPromiseId, canAccess);
  });

  // Might be better to instead store this value on the view?
  return view.getStream(canResultPropertyName);
}
