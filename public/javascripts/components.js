var Draft = React.createClass({displayName: "Draft",

  getInitialState: function() {
    return {
      user: DT_GLOBALS.user,
      highlighting: false,
      lowLighting: false,
      editing: false,
      hidingDrafted: false
    }
  },

  componentDidMount: function() {
    window.addEventListener('DT.update', this.onUpdate);
    window.addEventListener('DT.team.addPlayer', this.addPlayerToTeam);
    window.addEventListener('DT.team.removePlayer', this.removePlayerFromTeam);
  },

  addPlayerToTeam: function(e) {
    DT.team.addPlayer(e.detail.player);
    this.onUpdate();
  },

  removePlayerFromTeam: function(e) {
    DT.team.removePlayer(e.detail.player);
    this.onUpdate();
  },

  onUpdate: function() {
    this.forceUpdate();
  },

  onHighlight: function(highlighting) {
    var newState = DT.toggleHighlighting();
    this.setState(newState);
  },

  onLowlight: function(lowlighting) {
    var newState = DT.toggleLowlighting();
    this.setState(newState);
  },

  toggleDrafted: function() {
    DT.toggleDrafted();
    this.forceUpdate();
  },

  toggleProjections: function() {
    DT.toggleProjections();
    this.forceUpdate();
  },

  render: function() {
    rankings = DT.rankings;
    nextPick = rankings.getNextPick();

    return (
      React.createElement("div", {className: "container-fluid main-content"}, 

        React.createElement("div", {className: "row"}, 
          React.createElement(NavBar, {user: this.state.user, 
                  highlighting: this.state.highlighting, lowlighting: this.state.lowlighting, 
                  onHighlight: this.onHighlight, onLowlight: this.onLowlight, 
                  onDraftedToggle: this.toggleDrafted, onProjectionsToggle: this.toggleProjections, 
                  onEditRankings: this.onEditRankings})
        ), 

        React.createElement("div", {className: "row players"}, 
          React.createElement("div", {className: "col-md-12"}, 
            "Now picking: ",  nextPick 
          )
        ), 

        React.createElement("div", {className: "row players"}, 
          React.createElement("div", {className: "col-md-12"}, 
            React.createElement("div", {className: "positional"}, 

              React.createElement("div", {className: "col-md-2 col-sm-6 position-column"}, 
                React.createElement(PositionRanking, {label: "QB", players: rankings.getPosition("QB")})
              ), 

              React.createElement("div", {className: "col-md-2 col-sm-6 position-column"}, 
                React.createElement(PositionRanking, {label: "RB", players: rankings.getPosition("RB")})
              ), 

              React.createElement("div", {className: "col-md-2 col-sm-6 position-column"}, 
                React.createElement(PositionRanking, {label: "WR", players: rankings.getPosition("WR")})
              ), 

              React.createElement("div", {className: "col-md-2 col-sm-6 position-column"}, 
                React.createElement(PositionRanking, {label: "TE", players: rankings.getPosition("TE")})
              ), 

              React.createElement("div", {className: "col-md-2 col-sm-6 position-column"}, 
                React.createElement(PositionRanking, {label: "K", players: rankings.getPosition("K")}), 
                React.createElement(PositionRanking, {label: "DEF", players: rankings.getPosition("DEF")})
              ), 

              React.createElement(Team, {team: DT.team})

            )
          )
        ), 

        React.createElement(Instructions, {user: this.state.user}), 

        React.createElement(UserDialog, null)

      )
    )
  }
});

var DraftedToggle = React.createClass({displayName: "DraftedToggle",
  toggle: function() {
    console.log("eyyyy");

      // @$el.toggleClass('on')
      // hide = @$el.hasClass 'on'
      // $('.player.taken').toggle !hide
      // @$el.trigger 'Players.hide', hide
  },

  render: function() {
    return (
      React.createElement("span", {className: "hidden-xs metal linear drafted", onClick: this.toggle}, "Hide drafted")
    );
  }
});

var Instructions = React.createClass({displayName: "Instructions",

  componentDidMount: function() {
    if(this.props.user === null) {
      this.showModal();
    }

    window.addEventListener('DT.showInstructions', this.showModal);
  },

  showModal: function() {
    $("#instructions").modal();
  },

  render: function() {
    return (
      React.createElement("div", {id: "instructions", className: "modal fade"}, 
        React.createElement("div", {className: "modal-dialog modal-lg"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("div", {className: "modal-header"}, 
              React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal"}, 
                React.createElement("span", {"aria-hidden": "true"}, "×"), 
                React.createElement("span", {className: "sr-only"}, "Close")
              ), 
              React.createElement("h3", {className: "modal-title"}, "Welcome to the Draft Party!")
            ), 
            React.createElement("div", {className: "modal-body"}, 
              React.createElement("h4", {className: "highlighted"}, "First, create an account to customize your rankings"), 
              React.createElement("p", null, "Or, you know, don't."), 
              React.createElement("h4", {className: "highlighted"}, "During the draft, click on a player to mark him as taken"), 
              React.createElement("p", null, "Or double-click him to say that he's on your team.  He'll then show up in your team on the right hand side."), 
              React.createElement("h4", {className: "highlighted"}, "Drag and drop the players on your team to rearrange your lineup"), 
              React.createElement("p", null, "Or just leave it alone and your team will autofill based on position"), 
              React.createElement("h4", {className: "highlighted"}, "The stuff in the toolbar is self-explanatory"), 
              React.createElement("p", null, "Except maybe the pencil icons. You can use them to highlight players in the list, if you so choose.")
            ), 
            React.createElement("div", {className: "modal-footer"}, 
              React.createElement("button", {className: "btn btn-default", type: "button", "data-dismiss": "modal"}, "Close")
            )
          )
        )
      )
    )
  }
});

var Login = React.createClass({displayName: "Login",

  getInitialState: function() {
    return {
      username: "",
      password: "",
      loginError: "",
      newUser: false
    }
  },

  usernameChanged: function(e) {
    this.setState({username: e.target.value});
  },

  passwordChanged: function(e) {
    this.setState({password: e.target.value});
  },

  submit: function() {
    $.post('/login', this.state, this.handleResponse);
  },

  handleResponse: function(response) {
    if(response.errors != null) {
      this.setState({loginError: response.errors[0]});
    }
    else {
      location.reload();
    }
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "modal-header"}, 
          React.createElement("h3", {className: "modal-title"}, "Login")
        ), 

        React.createElement("div", {className: "modal-body"}, 
          React.createElement("form", {className: "form-horizontal"}, 
            React.createElement("fieldset", null, 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "email", className: "col-lg-3 col-md-3 control-label"}, "Email"), 
                React.createElement("div", {className: "col-lg-9 col-md-9"}, 
                  React.createElement("input", {type: "text", name: "email", className: "form-control", onChange: this.usernameChanged})
                )
              ), 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "password", className: "col-lg-3 col-md-3 control-label"}, "Password"), 
                React.createElement("div", {className: "col-lg-9 col-md-9"}, 
                  React.createElement("input", {type: "password", className: "form-control password", onChange: this.passwordChanged})
                )
              ), 

              React.createElement("div", {className: "form-group form-error"}, 
                this.state.loginError
              ), 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("div", {className: "col-lg-12 buttons"}, 

                  React.createElement("input", {onClick: this.submit, value: "Login", className: "btn btn-info pull-right", readOnly: true}), 

                  React.createElement("div", {className: "register-link pull-right"}, 
                    React.createElement("a", {href: "#", onClick: this.props.onRegister}, "Not a member yet clown? Register")
                  )

                )
              )

            )
          )
        )
      )
    )
  }
});
var NavBar = React.createClass({displayName: "NavBar",

  componentDidMount: function() {
    $('.editRankings').tooltip();
  },

  render: function() {

    var highlightClass = DT.util.classNames({
      "highlight metal yellow radial": true,
      "on": this.props.highlighting
    });

    var lowlightClass = DT.util.classNames({
      "lowlight metal red radial": true,
      "on": this.props.lowlighting
    });

    var draftedClass = DT.util.classNames({
      "hidden-xs metal linear drafted": true,
      "on": DT.hidingDrafted
    });

    var projectionsClass = DT.util.classNames({
      "hidden-xs metal linear drafted": true,
      "on": DT.showProjections
    });

    return (

      React.createElement("div", {className: "row navbar"}, 

        React.createElement("div", {className: "col-sm-2 col-xs-12 logo"}, 
          React.createElement("img", {src: "/images/logo-rainbow.png"})
        ), 

        React.createElement("div", {className: "col-sm-10 col-xs-12"}, 
          React.createElement("div", {className: "form form-horizontal"}, 
            React.createElement("div", {className: "col-md-12 col-sm-12 hidden-xs"}, 

              React.createElement("div", {className: highlightClass, onClick: this.props.onHighlight}, 
                React.createElement("i", {className: "fa fa-pencil"})
              ), 

              React.createElement("div", {className: lowlightClass, onClick: this.props.onLowlight}, 
                React.createElement("i", {className: "fa fa-pencil"})
              ), 

              React.createElement("span", {className: draftedClass, onClick: this.props.onDraftedToggle}, "Hide drafted"), 

              React.createElement("span", {className: projectionsClass, onClick: this.props.onProjectionsToggle}, "Show projections"), 

              
                this.props.user !== null ?
                  React.createElement("span", {className: "metal linear editRankings hidden-xs"}, "Edit Rankings")
                :
                  React.createElement("span", {className: "metal linear editRankings disabled hidden-xs", "data-toggle": "tooltip", "data-placement": "bottom", title: "Gotta log in to do this"}, "Edit Rankings"), 
              

              React.createElement(UserMenu, {user: this.props.user})

            )
          )
        )

      )
    )
  }
});
var Player = React.createClass({displayName: "Player",

  getDefaultProps: function() {
    return {
      player: {},
      showAnnotations: true
    }
  },

  componentDidUpdate: function() {
    var _this = this;
    console.log("updating");
    if(DT.showProjections) {
      this.activateTooltip();
    } else {
      this.deactivateTooltip();
    }
  },

  activateTooltip: function() {
    $(this.getDOMNode()).popover({
      html : true,
      container: 'body',
      trigger: 'hover',
      content: this.statsHTML,
      title: function() { return 'Projected Stats' }
    })
  },

  deactivateTooltip: function() {
    $(this.getDOMNode()).popover('destroy');
  },

  updateState: function() {
    this.props.player.updateState();

    this.checkAdded();
    this.checkRemoved();

    var e = new CustomEvent('DT.update', { bubbles: true });
    this.getDOMNode().dispatchEvent(e);
  },

  checkAdded: function() {
    player = this.props.player;
    if(player.Owner === "me") {
      var e = new CustomEvent('DT.team.addPlayer', { detail: { player: player }, bubbles: true });
      this.getDOMNode().dispatchEvent(e);
    }
  },

  checkRemoved: function() {
    player = this.props.player;
    if(player.Owner === null) {
      var e = new CustomEvent('DT.team.removePlayer', { detail: { player: player }, bubbles: true });
      this.getDOMNode().dispatchEvent(e);
    }
  },

  statsHTML: function() {
    rows = "";
    player = this.props.player;

    for (var stat in player.Stats) {
      if (player.Stats.hasOwnProperty(stat)) {
        rows += "<tr key={stat}><td><div style='width:100px'>"+stat+"</div></td><td>"+player.Stats[stat]+"</td></tr>";
      }
    }

    return "<table><tbody>" + rows + "</tbody></table>";
  },

  handleMouseDown: function() {
    this.props.onMouseDown(this.props.player);
  },

  render: function() {

    var classes = "";

    if(this.props.showAnnotations) {
      classes = DT.util.classNames({
        'taken': this.props.player.Owner !== null && typeof this.props.player.Owner !== "undefined",
        'mine': this.props.player.Owner === "me",
        'highlighted': this.props.player.Attribution == "highlighted",
        'lowlighted': this.props.player.Attribution == "lowlighted"
      });
    }

    if(this.props.player.Owner != null && DT.hidingDrafted) {
      return null;
    }

    return (
      React.createElement("tr", {
        "data-id": this.props.player["Id"], 
        "data-rank": this.props.player["Rank"], 
        className: classes}, 
        React.createElement("td", {className: "col-md-1 rank", onMouseDown: this.handleMouseDown}, this.props.label), 
        React.createElement("td", {className: "name", "data-position": this.props.code, onClick: this.updateState}, this.props.player['Player Name'])
      )
    );
  }
});
var PositionRanking = React.createClass({displayName: "PositionRanking",

  getDefaultProps: function() {
    return {
      label: "",
      players: []
    }
  },

  playerRows: function() {
    var players = this.props.players;
    var rows = [];
    for(var i=0; i < players.length; i++) {
      rows.push(React.createElement(Player, {key: i, label: players[i]["Rank"], player: players[i], onMouseDown: this.startDragPlayer}))
    }
    return rows;
  },

  startDragPlayer: function(player) {
    this.draggedPlayer = player;
    $("body").on("mousemove", this.dragPlayer);
    $("body").on("mouseup", this.dropPlayer);
  },

  dragPlayer: function(event) {
    var _this = this;
    var players = _this.props.players;
    var draggedPlayer = _this.draggedPlayer;

    $(this.getDOMNode()).find("[data-rank]").each(function(index){
      var $row = $(this);
      var top = $row.offset().top;
      var bottom = top + $row.height();
      if(event.pageY > top && event.pageY < bottom) {
        players.splice(players.indexOf(draggedPlayer), 1);
        players.splice(index, 0, draggedPlayer);
        _this.forceUpdate();
        return false;
      }
    })
  },

  dropPlayer: function(player) {
    var index = this.props.players.indexOf(this.draggedPlayer);
    var newRank;

    if(index === 0) {
      newRank = this.props.players[1]["Rank"] - 1;
    } else {
      newRank = parseInt(this.props.players[index-1]["Rank"], 10) + 1;
    }

    newRank = Math.max(newRank, 1);
    DT.rankings.rankPlayer(this.draggedPlayer, newRank);

    var e = new CustomEvent('DT.update', { bubbles: true });
    this.getDOMNode().dispatchEvent(e);

    this.draggedPlayer = null;
    $("body").off("mousemove");
    $("body").off("mouseup");
  },

  render: function() {
    return (
      React.createElement("table", {ref: "table", className: "table table-bordered"}, 
        React.createElement("tbody", null, 
          React.createElement("tr", null, 
            React.createElement("th", {colSpan: "2"}, 
              this.props.label
            )
          ), 
          this.playerRows()
        )
      )
    )
  }
});
var Register = React.createClass({displayName: "Register",

  getInitialState: function() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {}
    }
  },

  nameChanged: function(e) {
    this.setState({name: e.target.value});
  },

  emailChanged: function(e) {
    this.setState({email: e.target.value});
  },

  passwordChanged: function(e) {
    this.setState({password: e.target.value});
  },

  confirmPasswordChanged: function(e) {
    this.setState({confirmPassword: e.target.value});
  },

  validateForm: function() {
    var errors = {};
    var valid = true;

    if(this.state.name === "") {
      errors.name = "Name cannot be blank";
      valid = false;
    }

    if(this.state.email === "") {
      errors.email = "Email cannot be blank";
      valid = false;
    }

    if(this.state.password === "") {
      errors.password = "Password cannot be blank";
      valid = false;
    }

    if(this.state.password !== this.state.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if(valid == false) {
      this.setState({ errors: errors })
    }

    return valid;
  },

  submit: function() {
    if(!this.validateForm()) {
      return;
    }

    $.post('/register', this.state, this.handleResponse);
  },

  handleResponse: function(response) {
    if(response.errors != null) {
      this.setState({ errors: {email: response.errors[0].email} });
    }
    else {
      location.reload();
    }
  },

  render: function() {
    return (
      React.createElement("div", {id: "register"}, 
        React.createElement("div", {className: "modal-header"}, 
          React.createElement("h3", {className: "modal-title"}, "Register")
        ), 

        React.createElement("div", {className: "modal-body"}, 
          React.createElement("form", {className: "form-horizontal"}, 
            React.createElement("fieldset", null, 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "name", className: "col-lg-3 col-md-3 control-label"}, "First Name"), 
                React.createElement("div", {className: "col-lg-9 col-md-9"}, 
                  React.createElement("input", {type: "text", name: "name", className: "form-control", onChange: this.nameChanged})
                )
              ), 

              React.createElement("div", {className: "col-xs-12 form-group form-error"}, 
                React.createElement("div", {className: "pull-right"}, this.state.errors.name)
              ), 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "email", className: "col-lg-3 col-md-3 control-label"}, "Email"), 
                React.createElement("div", {className: "col-lg-9 col-md-9"}, 
                  React.createElement("input", {type: "text", name: "email", className: "form-control", onChange: this.emailChanged})
                )
              ), 

              React.createElement("div", {className: "col-xs-12 form-group form-error"}, 
                React.createElement("div", {className: "pull-right"}, this.state.errors.email)
              ), 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "password", className: "col-lg-3 col-md-3 control-label"}, "Password"), 
                React.createElement("div", {className: "col-lg-9 col-md-9"}, 
                  React.createElement("input", {type: "password", className: "form-control password", onChange: this.passwordChanged})
                )
              ), 

              React.createElement("div", {className: "col-xs-12 form-group form-error"}, 
                React.createElement("div", {className: "pull-right"}, this.state.errors.password)
              ), 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "confirmPassword", className: "col-lg-3 col-md-3 control-label"}, "Confirm Password"), 
                React.createElement("div", {className: "col-lg-9 col-md-9"}, 
                  React.createElement("input", {type: "password", className: "form-control password", onChange: this.confirmPasswordChanged})
                )
              ), 

              React.createElement("div", {className: "col-xs-12 form-group form-error"}, 
                React.createElement("div", {className: "pull-right"}, this.state.errors.confirmPassword)
              ), 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {htmlFor: "security", className: "col-lg-3 col-md-3 control-label"}, "Security Question"), 
                React.createElement("div", {className: "col-lg-9 col-md-9"}, React.createElement("span", {className: "help-block"}, "In your opinion, who was the best Batman?"), 
                  React.createElement("select", {className: "form-control"}, 
                    React.createElement("option", null, "Michael Keaton")
                  )
                )
              ), 

              React.createElement("div", {className: "form-group"}, 
                React.createElement("div", {className: "col-lg-12 buttons"}, 
                  React.createElement("input", {onClick: this.submit, value: "Register", className: "btn btn-info pull-right", readOnly: true}), React.createElement("span", {"data-dismiss": "modal", className: "btn btn-default pull-right"}, "Cancel")
                )
              )

            )
          )
        )
      )
    )
  }
});
var Team = React.createClass({displayName: "Team",

  positionRows: function(label, players, max) {
    rows = [];
    for(var i=0; i< max; i++) {
      rows.push( React.createElement(Player, {key: i, label: label, player: players[i], showAnnotations: false, draggable: false}) );
    }
    return rows;
  },

  qbRows: function() {
    team = this.props.team;
    return this.positionRows("QB", team.quarterbacks, team.MAX_QBS);
  },

  rbRows: function() {
    team = this.props.team;
    return this.positionRows("RB", team.runningbacks, team.MAX_RBS);
  },

  wrRows: function() {
    team = this.props.team;
    return this.positionRows("WR", team.widereceivers, team.MAX_WRS);
  },

  teRows: function() {
    team = this.props.team;
    return this.positionRows("TE", team.tightends, team.MAX_TES);
  },

  flxRows: function() {
    team = this.props.team;
    return this.positionRows("FLX", team.flex, team.MAX_FLX);
  },

  kRows: function() {
    team = this.props.team;
    return this.positionRows("K", team.kickers, team.MAX_KS);
  },

  defRows: function() {
    team = this.props.team;
    return this.positionRows("DEF", team.defenses, team.MAX_DEFS);
  },

  benchRows: function() {
    team = this.props.team;
    return this.positionRows("BN", team.bench, team.MAX_BENCH);
  },

  render: function() {
    return (
      React.createElement("div", {className: "col-md-2 col-xs-12 my-team"}, 
        React.createElement("table", {className: "table table-bordered"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", {colSpan: "2"}, 
                "Your Team"
              )
            )
          ), 

          React.createElement("tbody", null, 
            this.qbRows(), 
            this.rbRows(), 
            this.wrRows(), 
            this.teRows(), 
            this.flxRows(), 
            this.kRows(), 
            this.defRows(), 
            this.benchRows()
          )
        )
      )
    );
  }
});


var UserDialog = React.createClass({displayName: "UserDialog",

  getInitialState: function() {
    return {
      newUser: false
    }
  },

  componentDidMount: function() {
    _this = this;

    window.addEventListener('DT.showLogin', function () {
      _this.setState({newUser: false});
      $(_this.refs.modal.getDOMNode()).modal();
    });
  },

  showRegister: function() {
    this.setState({ newUser: true })
  },

  render: function() {
    return (
      React.createElement("div", {id: "login", ref: "modal", className: "modal fade"}, 
          React.createElement("div", {className: "modal-dialog"}, 
            React.createElement("div", {className: "modal-content"}, 
               !this.state.newUser ?
                React.createElement(Login, {onRegister: this.showRegister}) :
                React.createElement(Register, null)
              
            )
          )
      )
    )
  }
});
var UserMenu = React.createClass({displayName: "UserMenu",

  getInitialState: function() {
    return {
      newUser: false,
      user: null,
      error: null
    }
  },

  showInstructions: function() {
    var e = new CustomEvent('DT.showInstructions', {bubbles: true});
    this.getDOMNode().dispatchEvent(e);
  },

  userMenu: function() {
    return (
      React.createElement("div", {className: "user-dropdown"}, 
        React.createElement("div", {className: "dropdown-holder pull-right"}, 
          React.createElement("div", {className: "metal linear dropdown pull-right", "data-toggle": "dropdown", href: "#"}, 
            this.props.user.name, 
            React.createElement("span", {className: "caret"})
          ), 
          React.createElement("ul", {className: "dropdown-menu", role: "menu", "aria-labelledby": "dLabel"}, 
            React.createElement("li", null, 
              React.createElement("a", {className: "resetButton", href: "#", onClick: this.showInstructions}, "Help")
            ), 
            React.createElement("li", null, 
              React.createElement("a", {className: "resetButton", href: "#"}, "Reset")
            ), 
            React.createElement("li", null, 
              React.createElement("a", {href: "/logout"}, "Logout")
            )
          )
        )
      )
    )
  },

  showLogin: function() {
    var login = new CustomEvent('DT.showLogin', {bubbles: true});
    this.getDOMNode().dispatchEvent(login);
  },

  render: function() {
    if(this.props.user !== null) {
      return this.userMenu();
    } else {
      return (
        React.createElement("input", {className: "btn btn-info", value: "Log In", readOnly: true, onClick: this.showLogin})
      )
    }
  }

});
