var App, DT, Player, Rankings, Team,
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
    var i, index, len, player, ref, results;
    ref = this.players;
    results = [];
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
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
    var i, len, player, ref, results;
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
    for (i = 0, len = ref.length; i < len; i++) {
      player = ref[i];
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

App = (function() {
  App.prototype.rankings = [];

  App.prototype.highlighting = false;

  App.prototype.lowLighting = false;

  App.prototype.editing = false;

  App.prototype.hidingDrafted = false;

  App.prototype.showProjections = false;

  function App(players) {
    this.toggleProjections = bind(this.toggleProjections, this);
    this.toggleDrafted = bind(this.toggleDrafted, this);
    this.toggleLowlighting = bind(this.toggleLowlighting, this);
    this.toggleHighlighting = bind(this.toggleHighlighting, this);
    var i, len, player, taken;
    players = _.map(players, function(player) {
      return new Player(player);
    });
    this.rankings = new Rankings(players);
    this.team = new Team;
    taken = _.where(players, {
      Owner: "me"
    });
    for (i = 0, len = taken.length; i < len; i++) {
      player = taken[i];
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

  App.prototype.toggleProjections = function() {
    return this.showProjections = !this.showProjections;
  };

  return App;

})();

DT = new App(DT_GLOBALS.allPlayers);

delete [DT_GLOBALS.allPlayers];

DT.util = {
  classNames: classNames
};
