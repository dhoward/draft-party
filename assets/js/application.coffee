#= require_tree .

new ViewToggle $('[name=viewToggle]')
new PlayerToggle $('[name=playerToggle]')
new PickCounter $('.pickCounter')
new Search $('.search')
new Players $('.positional')
new Players $('.absolute')
new Team $('.my-team .table')
new Highlighter $('.highlight'), $('.lowlight')
new Tooltips $('.positional')
new Rankings()