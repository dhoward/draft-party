var App, DT, Player, Rankings, Team, Tooltips,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Player = (function() {
  function Player(player) {
    this.toggleLowlighted = bind(this.toggleLowlighted, this);
    this.toggleHighlighted = bind(this.toggleHighlighted, this);
    this.updateOwner = bind(this.updateOwner, this);
    this.isFlexEligible = bind(this.isFlexEligible, this);
    this.Id = player.Id;
    this["Player Name"] = player["Player Name"];
    this.Position = player.Position;
    this.Rank = player.Rank;
    this.Owner = player.Owner;
    this.Attribution = player.Attribution;
    this.Stats = player.Stats;
  }

  Player.prototype.isFlexEligible = function() {
    return this.Position === "RB" || this.Position === "WR";
  };

  Player.prototype.updateOwner = function() {
    if (this.Owner == null) {
      return this.Owner = "other";
    } else if (this.Owner === "other") {
      return this.Owner = "me";
    } else {
      return this.Owner = null;
    }
  };

  Player.prototype.toggleHighlighted = function() {
    return this.Attribution = this.Attribution === "highlighted" ? null : "highlighted";
  };

  Player.prototype.toggleLowlighted = function() {
    return this.Attribution = this.Attribution === "lowlighted" ? null : "lowlighted";
  };

  Player.prototype.updateState = function() {
    if (DT.highlighting) {
      this.toggleHighlighted();
    } else if (DT.lowlighting) {
      this.toggleLowlighted();
    } else {
      this.updateOwner();
    }
    if (DT_GLOBALS.loggedIn) {
      return $.post('/updatePlayer', this.toJSON());
    }
  };

  Player.prototype.toJSON = function() {
    var json, ref, ref1;
    json = {
      Id: this.Id,
      "Player Name": this["Player Name"],
      Position: this.Position,
      Rank: this.Rank,
      Stats: this.Stats
    };
    if ((ref = this.Owner) != null ? ref.length : void 0) {
      json.Owner = this.Owner;
    }
    if ((ref1 = this.Attribution) != null ? ref1.length : void 0) {
      json.Attribution = this.Attribution;
    }
    return json;
  };

  return Player;

})();

Rankings = (function() {
  function Rankings(players) {
    this.getNextPick = bind(this.getNextPick, this);
    this.updateRankings = bind(this.updateRankings, this);
    this.rankPlayer = bind(this.rankPlayer, this);
    players = _.map(players, function(player) {
      return new Player(player);
    });
    this.players = this.sortPlayers(players);
  }

  Rankings.prototype.getPosition = function(pos) {
    var position, positions, sorted;
    positions = _.groupBy(this.players, "Position");
    position = positions[pos];
    return sorted = this.sortPlayers(position);
  };

  Rankings.prototype.sortPlayers = function(players) {
    var sorted;
    sorted = _.sortBy(players, function(player) {
      return parseInt(player["Rank"], 10);
    });
    return sorted;
  };

  Rankings.prototype.rankPlayer = function(ranked, rank) {
    var players, ranksArray;
    ranked["Rank"] = rank;
    rank--;
    players = _.reject(this.players, function(player) {
      return player["Id"] === ranked["Id"];
    });
    players.splice(rank, 0, ranked);
    this.players = players;
    this.updateRankings();
    ranksArray = _.pluck(this.players, "Id");
    if (DT_GLOBALS.loggedIn) {
      return $.post('/rankings', {
        rankings: ranksArray
      });
    }
  };

  Rankings.prototype.updateRankings = function(players) {
    var index, j, len, player, ref, results;
    ref = this.players;
    results = [];
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      player = ref[index];
      results.push(player["Rank"] = index + 1);
    }
    return results;
  };

  Rankings.prototype.getNextPick = function() {
    var players;
    players = _.filter(this.players, function(player) {
      return player["Owner"] != null;
    });
    return players.length + 1;
  };

  return Rankings;

})();

Team = (function() {
  function Team(players1) {
    this.players = players1 != null ? players1 : [];
    this.MAX_QBS = 1;
    this.MAX_RBS = 2;
    this.MAX_WRS = 2;
    this.MAX_TES = 1;
    this.MAX_FLX = 1;
    this.MAX_KS = 1;
    this.MAX_DEFS = 1;
    this.MAX_BENCH = 6;
    this.buildPositions();
  }

  Team.prototype.addPlayer = function(player) {
    this.players.push(player);
    return this.slotPlayer(player);
  };

  Team.prototype.slotPlayer = function(player) {
    var addPlayerFunc;
    addPlayerFunc = "add" + (player.Position.toUpperCase());
    return this[addPlayerFunc](player);
  };

  Team.prototype.buildPositions = function() {
    var j, len, player, ref, results;
    this.quarterbacks = [];
    this.runningbacks = [];
    this.widereceivers = [];
    this.tightends = [];
    this.flex = [];
    this.kickers = [];
    this.defenses = [];
    this.bench = [];
    ref = this.players;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      player = ref[j];
      results.push(this.slotPlayer(player));
    }
    return results;
  };

  Team.prototype.addPositionPlayer = function(player, list, max, flexEligible) {
    if (list.length < max) {
      return list.push(player);
    } else if (flexEligible) {
      return this.addFlex(player);
    } else if (this.bench.length < this.MAX_BENCH) {
      return this.addBench(player);
    }
  };

  Team.prototype.addQB = function(player) {
    return this.addPositionPlayer(player, this.quarterbacks, this.MAX_QBS, player.isFlexEligible());
  };

  Team.prototype.addRB = function(player) {
    return this.addPositionPlayer(player, this.runningbacks, this.MAX_RBS, player.isFlexEligible());
  };

  Team.prototype.addWR = function(player) {
    return this.addPositionPlayer(player, this.widereceivers, this.MAX_WRS, player.isFlexEligible());
  };

  Team.prototype.addTE = function(player) {
    return this.addPositionPlayer(player, this.tightends, this.MAX_TES, player.isFlexEligible());
  };

  Team.prototype.addFlex = function(player) {
    return this.addPositionPlayer(player, this.flex, this.MAX_FLX, false);
  };

  Team.prototype.addK = function(player) {
    return this.addPositionPlayer(player, this.kickers, this.MAX_KS, player.isFlexEligible());
  };

  Team.prototype.addDEF = function(player) {
    return this.addPositionPlayer(player, this.defenses, this.MAX_DEFS, player.isFlexEligible());
  };

  Team.prototype.addBench = function(player) {
    return this.addPositionPlayer(player, this.bench, this.MAX_BENCH, false);
  };

  Team.prototype.removePlayer = function(player) {
    this.players = _.reject(this.players, function(p) {
      return p.Id === player.Id;
    });
    return this.buildPositions();
  };

  return Team;

})();

Tooltips = (function() {
  function Tooltips($el) {
    this.$el = $el;
    this.activateTooltips = bind(this.activateTooltips, this);
    this.updateTooltips = bind(this.updateTooltips, this);
    this.toggleTooltips = bind(this.toggleTooltips, this);
    this.toggleButton = $('form .projections');
    this.toggleButton.on('click', this.toggleTooltips);
    $('body').on('Players.rendered', this.updateTooltips);
  }

  Tooltips.prototype.toggleTooltips = function() {
    this.toggleButton.toggleClass('on');
    return this.updateTooltips();
  };

  Tooltips.prototype.updateTooltips = function() {
    var activate;
    activate = this.toggleButton.hasClass('on');
    if (activate) {
      return this.activateTooltips();
    } else {
      return this.deactivateTooltips();
    }
  };

  Tooltips.prototype.activateTooltips = function() {
    return this.$el.find('.player').each((function(_this) {
      return function(i, player) {
        var stats;
        stats = _this.getStats($(player).attr('data-position'));
        if (!stats.length) {
          return;
        }
        return $(player).popover({
          html: true,
          container: 'body',
          trigger: 'hover',
          content: function() {
            return _this.tooltipHtml(stats, $(player).attr('data-id'));
          },
          title: function() {
            return 'Projected Stats';
          }
        });
      };
    })(this));
  };

  Tooltips.prototype.deactivateTooltips = function() {
    return $('.player').popover('destroy');
  };

  Tooltips.prototype.getStats = function(pos) {
    var stats;
    stats = [];
    if (pos === 'qb') {
      stats = ['Pass Yards', 'Pass TD', 'INT', 'Rush Yards', 'Rush TD'];
    } else if (pos === 'rb') {
      stats = ['Rush Yards', 'Rush TD', 'Rec Yards', 'Rec TD'];
    } else if (pos === 'wr') {
      stats = ['Rec Yards', 'Rec TD'];
    } else if (pos === 'te') {
      stats = ['Rec Yards', 'Rec TD'];
    }
    return stats;
  };

  Tooltips.prototype.tooltipHtml = function(stats, id) {
    var $html, j, len, player, stat;
    $html = $('<table><tbody></tbody></table>');
    player = _.findWhere(DT_GLOBALS.allPlayers, {
      Id: id
    });
    for (j = 0, len = stats.length; j < len; j++) {
      stat = stats[j];
      $html.append("<tr><td><div style='width:100px'>" + stat + "</div></td><td>" + player[stat] + "</td></tr>");
    }
    return $html;
  };

  return Tooltips;

})();

App = (function() {
  App.prototype.rankings = [];

  App.prototype.highlighting = false;

  App.prototype.lowLighting = false;

  App.prototype.editing = false;

  App.prototype.hidingDrafted = false;

  function App(players) {
    this.toggleDrafted = bind(this.toggleDrafted, this);
    this.toggleLowlighting = bind(this.toggleLowlighting, this);
    this.toggleHighlighting = bind(this.toggleHighlighting, this);
    var j, len, player, taken;
    players = _.map(players, function(player) {
      return new Player(player);
    });
    this.rankings = new Rankings(players);
    this.team = new Team;
    taken = _.where(players, {
      Owner: "me"
    });
    for (j = 0, len = taken.length; j < len; j++) {
      player = taken[j];
      this.team.addPlayer(player);
    }
  }

  App.prototype.toggleHighlighting = function() {
    var stateObj;
    this.lowlighting = false;
    this.highlighting = !this.highlighting;
    stateObj = {
      lowlighting: this.lowlighting,
      highlighting: this.highlighting
    };
    return stateObj;
  };

  App.prototype.toggleLowlighting = function() {
    var stateObj;
    this.highlighting = false;
    this.lowlighting = !this.lowlighting;
    stateObj = {
      lowlighting: this.lowlighting,
      highlighting: this.highlighting
    };
    return stateObj;
  };

  App.prototype.toggleDrafted = function() {
    return this.hidingDrafted = !this.hidingDrafted;
  };

  return App;

})();

DT = new App(DT_GLOBALS.allPlayers);

delete [DT_GLOBALS.allPlayers];

DT.util = {
  classNames: classNames
};
