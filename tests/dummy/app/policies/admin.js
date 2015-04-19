import Ember from 'ember';

export default Ember.Object.extend({
  session: Ember.inject.service(),
  /*
    If the application should redirect to somewhere on invalid route access,
    define the route name or path to redirect to here.
  */
  redirectionRoute: '/',

  /*
    This callback validates if the user has access to authorize the model
    returned by the accessed route. This callback supports returning promises
    if needed for data access.
  */
  canAccess: function(/*route, model*/) {
    var user = this.get('session.user');

    if (user) {
      return Ember.get(user, 'isAdmin') === true;
    }
    else {
      return false;
    }
  }
});
