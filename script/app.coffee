class Person extends Spine.Model
	@configure "Person", "firstName", "lastName"
	@include Spine.Watch
	@include Spine.Validate

	rules: (RuleFor) -> [
		RuleFor("firstName")
			.Matches(/^Nathan$/)
			.Message("You must Nathan")
	]

class PersonController extends Spine.Controller
	@include Spine.DataBind

	bindings: 
		"value #first_name" : "firstName"

	init: ->
		@model.bind("error[firstName]", @error)
		@model.bind("valid[firstName]", @update)

	update: (record,field) =>
		errorField = this[field+"_error"]
		errorField.destroy() if errorField

	error: (record,errors) =>
		for error in errors
			element = $(@bindingElements(error.property))
			this[error.property + "_error"] = new ErrorController(
				el: element.parents(".control-group")
				message: error.message
			)

class ErrorController extends Spine.Controller
	init: ->
		@render()

	render: ->
		@el.addClass("error")
		@el.find(".help-inline").remove()
		@el.find(".controls").append("<span class='help-inline'>#{@message}</span>")

	destroy: ->
		@el.removeClass("error")
		@el.find(".help-inline").remove()

$ ->
	model = new Person(firstName: "Nathan")
	controller = new PersonController(el: "#address", model: model)

	# for debugging
	window.model = model

