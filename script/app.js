(function() {
  var ErrorController, Person, PersonController;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Person = (function() {
    __extends(Person, Spine.Model);
    function Person() {
      Person.__super__.constructor.apply(this, arguments);
    }
    Person.configure("Person", "firstName", "lastName");
    Person.include(Spine.Watch);
    Person.include(Spine.Validate);
    Person.prototype.rules = function(RuleFor) {
      return [RuleFor("firstName").Matches(/^Nathan$/).Message("You must Nathan")];
    };
    return Person;
  })();
  PersonController = (function() {
    __extends(PersonController, Spine.Controller);
    function PersonController() {
      this.error = __bind(this.error, this);
      this.update = __bind(this.update, this);
      PersonController.__super__.constructor.apply(this, arguments);
    }
    PersonController.include(Spine.DataBind);
    PersonController.prototype.bindings = {
      "value #first_name": "firstName"
    };
    PersonController.prototype.init = function() {
      this.model.bind("error[firstName]", this.error);
      return this.model.bind("valid[firstName]", this.update);
    };
    PersonController.prototype.update = function(record, field) {
      var errorField;
      errorField = this[field + "_error"];
      if (errorField) {
        return errorField.destroy();
      }
    };
    PersonController.prototype.error = function(record, errors) {
      var element, error, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = errors.length; _i < _len; _i++) {
        error = errors[_i];
        element = $(this.bindingElements(error.property));
        _results.push(this[error.property + "_error"] = new ErrorController({
          el: element.parents(".control-group"),
          message: error.message
        }));
      }
      return _results;
    };
    return PersonController;
  })();
  ErrorController = (function() {
    __extends(ErrorController, Spine.Controller);
    function ErrorController() {
      ErrorController.__super__.constructor.apply(this, arguments);
    }
    ErrorController.prototype.init = function() {
      return this.render();
    };
    ErrorController.prototype.render = function() {
      this.el.addClass("error");
      this.el.find(".help-inline").remove();
      return this.el.find(".controls").append("<span class='help-inline'>" + this.message + "</span>");
    };
    ErrorController.prototype.destroy = function() {
      this.el.removeClass("error");
      return this.el.find(".help-inline").remove();
    };
    return ErrorController;
  })();
  $(function() {
    var controller, model;
    model = new Person({
      firstName: "Nathan"
    });
    controller = new PersonController({
      el: "#address",
      model: model
    });
    return window.model = model;
  });
}).call(this);
