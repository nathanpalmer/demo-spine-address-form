(function() {
  var ErrorController, ModelDisplayController, Person, PersonController;
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
    Person.configure("Person", "firstName", "lastName", "homeowner");
    Person.include(Spine.Watch);
    Person.include(Spine.Validate);
    Person.prototype.rules = function(RuleFor) {
      return [RuleFor("firstName").Matches(/^Nathan$/).Message("You must Nathan")];
    };
    Person.prototype.validClass = function() {
      return "label " + (this.isValid() ? "label-success" : "label-warning");
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
      "value #first_name": "firstName",
      "value #last_name": "lastName",
      "checked #homeowner": "homeowner"
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
  ModelDisplayController = (function() {
    __extends(ModelDisplayController, Spine.Controller);
    ModelDisplayController.include(Spine.DataBind);
    function ModelDisplayController() {
      this.render = __bind(this.render, this);      ModelDisplayController.__super__.constructor.apply(this, arguments);
      this.render();
      this.model.bind("update[firstName]", __bind(function() {
        this.model.trigger("update[isValid]");
        return this.model.trigger("update");
      }, this));
      this.model.bind("update[lastName]", __bind(function() {
        this.model.trigger("update[isValid]");
        return this.model.trigger("update");
      }, this));
      this.refreshBindings(this.model);
    }
    ModelDisplayController.prototype.render = function() {
      return this.el.html(this.template(this.model));
    };
    ModelDisplayController.prototype.template = function(model) {
      var html;
      html = "<h3>Model Data</h3>\n<p></p>\n<p>\n	<span class=\"label\">Valid:</span> <span data-bind='text: isValid, attr: { \"class\": \"validClass\" }' class=\"label\"></span>\n</p>\n<p>\n	<span class=\"label\">First Name:</span> <span data-bind=\"text: firstName\"/>\n</p>\n<p>\n	<span class=\"label\">Last Name:</span> <span data-bind=\"text: lastName\"/>\n</p>\n<p>\n	<span class=\"label\">Homeowner:</span> <span data-bind=\"text: homeowner\"/>\n</p>";
      return $.tmpl(html, model);
    };
    return ModelDisplayController;
  })();
  $(function() {
    var controller, display, model;
    model = Person.create({
      firstName: "Nathan",
      homeowner: false
    });
    controller = new PersonController({
      el: "#address",
      model: model
    });
    display = new ModelDisplayController({
      el: "#display",
      model: model
    });
    return window.model = model;
  });
}).call(this);
