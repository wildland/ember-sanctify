import Ember from 'ember';

export default Ember.Object.extend({
  /*
    If the application should redirect to somewhere on invalid route access,
    define the route name to redirect to here.
  */
  redirectionRoute: null,

  /*
    This callback validates if the user has access to authorize the model
    returned by the accessed route. This callback supports returning promises
    if needed for data access.
  */
  canAccess: function(/*route, user, model*/) {
    return false;
  }

  /*
    define authorizable action methods
    Ex:

      canDelete: function(context, model) {
        var org = Ember.get(context, 'content.currentUser.currentOrganization');

        if (org) {
          return true;
        }
      }
  */
});
