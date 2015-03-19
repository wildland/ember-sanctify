ember-sanctify
===============

Minimal authorization through Object Oriented design. Highly inspired by the [Pundit](https://github.com/elabs/pundit) gem.

## Installation
`ember install:addon ember-sanctify`

## Policies
Ember Sanctify is designed around the idea that simple policy objects control approving and denying access to related resources. These objects are located inside of `app/policys` (because the resolver incorrectly pluralizes the word "policy"). The path of these policies is important as policies are automatically looked up based off of route paths.

This simple example allows accessing the edit route of a post if the user is an admin:

`app/policys/posts/edit.js`:
```js
import Ember from 'ember';

export default Ember.Object.extend({
  /* Inject a session service to provide the authorization object with user access */
  session: Ember.inject.service(),

  /*
    Validates if the user is and admin and provides access to the `posts.edit` route.
  */
  canAccess: function(/*route, model*/) {
    var user = this.get('session.user');

    return Ember.get(this, 'session.user.isAdmin');
  }
});
```

`app/routes/posts/edit.js`:
```js
import Ember from 'ember';
import Authorizable from 'ember-sanctify/mixins/routes/authorizable';

export default Ember.Route.extend(Authorizable, {
  model: function(params) {
    return this.store.find('post', params.post_id);
  }
});
```

Using a simple authorization object provides developers with the ability to keep authorization simple, thus be able to build a robust and scalable authorization system. To help facilitate this, ember-sanctify makes the following assumptions:
 - The return value of `canAccess` method on the associated policy object must eventually validate to a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) value for the user to be granted access.
 - If the user is denied access, the transition is aborted. If a `redirectionRoute` property exists on the policy, the user will be redirected to the specified route.
 - Validation is done during the `afterModel` callback on the route to provide the developer with access to the model if needed. If the developer needs to override the afterModel callback, be sure to call `this._super(model, transition)`.
 - The `canAccess` method can optionally return a promise so that async data can be accessed when needed.
 - If a policy is not found, the library falls back to whatever is specified by the policy that the resolver resolves at 'policy:application'. By default, this policy denies all access. To override generate a new application default policy inside of `app/policys/application.js`.


# Template content authorization
Authorizing access to template content is provided by using the `can-access` helper inside of the desired template.

This example allows the user to create a post as long as they are authenticated:
```html
{{#can-access 'post' 'create'}}
  {{#link-to 'posts.new'}}New Post{{/link-to}}
{{else}}
  Please {{#link-to 'login'}}log in{{/link-to}} to create a new post.
{{/can-access}}
```
The first argument is the path to the authorization policy, the second is the name method to call on the authorization policy. The example above the can-access helper would call the method `canCreate`.

The policy (`app/policys/post.js`) for authorizing the action in the above template could look like so:
```js
export default Ember.Object.extend({
  /* Inject a session service to provide the authorization object with user access */
  session: Ember.inject.service(),

  /* ... */
  canCreate: function() {
    return this.get('session.user');
  }
```
The `can-access` helper capitalizes the second parameter, and prefixes it with the string `can` before looking up and calling the authorization method on the defined policy. It also excepts optional arguments.
```html
{{#can-access 'post' 'edit' model}}...{{/can-access}}
```

Feel free to look through the `tests/dummy` application for more examples.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
