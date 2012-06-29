class Person extends Spine.Model
	@configure "Person", "firstName", "lastName", "homeowner"
	@include Spine.Watch
	@include Spine.Validate

	rules: (RuleFor) -> [
		RuleFor("firstName")
			.Matches(/^Nathan$/)
			.Message("You must Nathan")
	],

	validClass: ->
		"label " + if @isValid() then "label-success" else "label-warning" 

class PersonController extends Spine.Controller
	@include Spine.DataBind

	bindings: 
		"value #first_name" : "firstName"
		"value #last_name"  : "lastName",
		"checked #homeowner"  : "homeowner"

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

class ModelDisplayController extends Spine.Controller
	@include Spine.DataBind

	constructor: ->
		super
		@render()

		# This is a hack since spine.databind does not support triggering functions when using
		# watch.
		@model.bind("update[firstName]", => @model.trigger("update[isValid]"); @model.trigger("update"))
		@model.bind("update[lastName]" , => @model.trigger("update[isValid]"); @model.trigger("update"))

		# This is also a hack since refresh is called prior to 
		# render.
		@refreshBindings(@model)

	render: =>
		@el.html(@template(@model))

	template: (model) ->
		html = """
			<h3>Model Data</h3>
			<p></p>
			<p>
				<span class="label">Valid:</span> <span data-bind='text: isValid, attr: { "class": "validClass" }' class="label"></span>
			</p>
			<p>
				<span class="label">First Name:</span> <span data-bind="text: firstName"/>
			</p>
			<p>
				<span class="label">Last Name:</span> <span data-bind="text: lastName"/>
			</p>
			<p>
				<span class="label">Homeowner:</span> <span data-bind="text: homeowner"/>
			</p>
		"""
		$.tmpl(html, model)

$ ->
	model = Person.create(firstName: "Nathan", homeowner: false)
	controller = new PersonController(el: "#address", model: model)
	display = new ModelDisplayController(el: "#display", model: model)

	# for debugging
	window.model = model

