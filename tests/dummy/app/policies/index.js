import Ember from 'ember';

export default Ember.Object.extend({
  /*
    This callback validates if the user has access to authorize the model
    returned by the accessed route. This callback supports returning promises
    if needed for data access.
  */
  canAccess: function(/*route, user, model*/) {
    return true;
  }
});
