import Resolver from 'ember/resolver';

// noop initializer which just override Resolver#pluralizedTypes before the app initialization
Resolver.reopen({
  pluralizedTypes: {
    policy: 'policies'
  }
});

export default {
  name: 'setup-policy-pluralization',
  initialize: function() {}
};
