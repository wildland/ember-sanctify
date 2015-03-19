import Ember from 'ember';

var get = Ember.get;

export default {
  isHelper: true,
  isHTMLBars: true,

  helperFunction: function(params, hash, options, env) {
    var view = this;

    // Yea gods
    while (view && !get(view, 'layout')) {
      if (view._contextView) {
        view = view._contextView;
      } else {
        view = get(view, '_parentView');
      }
    }

    Ember.assert("You called es-yield-inverse in a template that was not a layout", !!view);

    return view._yieldInverse(null, env, options.morph, params);
  }
};
