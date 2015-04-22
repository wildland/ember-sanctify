ember-sanctify
===============
[![Dependency Status](https://david-dm.org/wildland/ember-sanctify.svg)](https://david-dm.org/wildland/ember-sanctify) [![Build Status](https://travis-ci.org/wildland/ember-sanctify.svg)](https://travis-ci.org/wildland/ember-sanctify) [![Code Climate](https://codeclimate.com/github/wildland/ember-sanctify/badges/gpa.svg)](https://codeclimate.com/github/wildland/ember-sanctify)

Minimal authorization through Object Oriented design. Highly inspired by the [Pundit](https://github.com/elabs/pundit) gem.

## Breaking Changes
ember-sanctify changed the syntax for the can-access helper to add support for ember 1.11. The can-access helper now uses handlebars sub-expressions, which simplified the whole codebase. See [here](#can-access) for details.

## Requirements
ember-sanctify only supports Ember >= 1.10

## Installation
`ember install:addon ember-sanctify`

## Policies
Ember Sanctify is designed around the idea that simple policy objects control approving and denying access to related resources. These objects are located inside of `app/policies`. The path of these policies is important as policies are automatically looked up based off of route paths.

This simple example allows accessing the edit route of a post if the user is an admin:

`app/policies/posts/edit.js`:
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
 - If a policy is not found, the library falls back to whatever is specified by the policy that the resolver resolves at 'policy:application'. By default, this policy denies all access. To override generate a new application default policy inside of `app/policies/application.js`.


# Template content authorization
Authorizing access to template content is provided by using the `can-access` sub-expression helper inside of the desired template.

This example allows the user to create a post as long as they are authenticated:
<a id="can-access"></a>
```html
{{#if (can-access 'post' 'create')}}
  {{#link-to 'posts.new'}}New Post{{/link-to}}
{{else}}
  Please {{#link-to 'login'}}log in{{/link-to}} to create a new post.
{{/if}}
```
The first argument is the path to the authorization policy, the second is the name method to call on the authorization policy. The example above the can-access helper would call the method `canCreate`.

The policy (`app/policies/post.js`) for authorizing the action in the above template could look like so:
```js
export default Ember.Object.extend({
  /* Inject a session service to provide the authorization object with user access */
  session: Ember.inject.service(),

  /* ... */
  canCreate: function() {
    return this.get('session.user');
  }
```
The `can-access` sub-expression capitalizes the second parameter, and prefixes it with the string `can` before looking up and calling the authorization method on the defined policy. It also excepts optional arguments.
```html
{{#if (can-access 'post' 'edit' model)}}...{{else}}...{{/if}}
```

Feel free to look through the `tests/dummy` application for more examples.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Code Of Conduct
Wildland Open Source [Code Of Conduct](https://github.com/wildland/code-of-conduct)
