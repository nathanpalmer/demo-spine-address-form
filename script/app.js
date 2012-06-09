(function() {
	var Person = Spine.Model.sub({
		rules: function(RuleFor) {
			return [
				RuleFor("first_name")
					.Matches(/^Nathan$/)
					.Message("You must be Nathan")
			];
		}
	});
	Person.configure("Person", "first_name", "last_name");
	Person.include(Spine.Watch);
	Person.include(Spine.Validate);

	var PersonController = Spine.Controller.sub({
		bindings: {
			"value #first_name": "first_name"
		},

		init: function() {
			this.model.bind("error[first_name]", this.proxy(this.error));
			this.model.bind("valid[first_name]", this.proxy(this.update));
		},

		update: function(record,field) {
			var errorField = this[field+"_error"];
			if (errorField) {
				errorField.destroy();
			}
		},

		error: function(record,errors) {
			var i,error,element;
			for(var i=0;i<errors.length;i++) {
				error = errors[i];
				element = $(this.bindingElements(error.property));
				this[error.property + "_error"] = new ErrorController({ el: element.parents(".control-group"), message: error.message });
			}
		}
	});
	PersonController.include(Spine.DataBind);

	var ErrorController = Spine.Controller.sub({
		init: function() {
			this.render();
		},

		render: function() {
			this.el.addClass("error");
			this.el.find(".help-inline").remove();
			this.el.find(".controls").append("<span class='help-inline'>"+ this.message + "</span>");
		},

		destroy: function() {
			this.el.removeClass("error");
			this.el.find(".help-inline").remove();
		}
	});

	$(document).ready(function() {
		var model = new Person({ first_name: "Nathan" });
		var controller = new PersonController({ el: "#address", model: model });

		window.model = model;
	})
})();