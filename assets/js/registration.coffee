class Registration
  constructor: (@$el) ->
    @$passwordCheckbox = @$el.find '.showPassword'
    @$passwordCheckbox.on 'click', @showPassword
    @$passwordInputs = @$el.find 'input.password'
    @$passwordInputs.on 'keyup', @updatePassword
    @$form = @$el.find('form')
    @$form.on 'submit', @onFormSubmit

  updatePassword: (e) =>
    $input = $(e.currentTarget)
    password = $input.val()
    @$passwordInputs.val password

  showPassword: =>
    show = @$passwordCheckbox.prop 'checked'
    @$el.find('input.password[type="text"]').toggle show
    @$el.find('input.password[type="password"]').toggle !show

  onFormSubmit: =>
    nameError = @checkValue @$form.find('[name="name"]')
    emailError = @checkValue @$form.find('[name="email"]')
    passwordError = @checkValue @$form.find('[name="password"]')

    if nameError or emailError or passwordError
      return false

    data =
      name: @$form.find('[name="name"]').val()
      email: @$form.find('[name="email"]').val()
      password: @$form.find('[name="password"]').val()

    $.post '/register', data, @handleResponse

    return false

  handleResponse: (response) =>
    if response.errors?
      for error in response.errors
        for key of error
          errorHtml = $('<span>').addClass('help-block text-danger').text error[key]
          @$form.find("[name='#{key}']").after errorHtml
    else
      location.reload()

  checkValue: ($el) ->
    $group = $el.closest '.form-group'
    error = $el.val() is ""
    if error
      $group.addClass 'has-error'
    else
      $group.removeClass 'has-error'
    error
