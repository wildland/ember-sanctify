import CanAccessWrapperView from '../views/es-can-access-wrapper';

export default {
  isHelper: true,
  isHTMLBars: true,

  helperFunction: function(params, hash, options, env) {
    var route = params[0];
    var action = params[1];
    var args = [];

    for(var i = 2; i < params.length - 1; i++) {
      args.push(params[i]);
    }

    hash.route = route;
    hash.authorizableAction = action;

    hash.policyArgs = args;
    hash.template = options.template;
    hash.inverse = options.inverse;

    options.helperName = 'can-access';
    delete options.template;

    return env.helpers.view.helperFunction.call(
      this, [CanAccessWrapperView], hash, options, env
    );
  }
};
