import Ember from 'ember';

export default Ember.Mixin.create({
  _yieldInverse: function(context, options, morph) {
    var template = Ember.get(this, 'inverse');

    if (template) {
      return template.render(this, options, morph.contextualElement);
    }
  }
});
