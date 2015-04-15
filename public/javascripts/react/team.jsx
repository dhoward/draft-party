var Team = React.createClass({
  render: function() {
    return (
      <div className="col-md-2 col-xs-12 my-team">
        <table className="table table-bordered">
          <tr>
            <th colSpan="2">
              Your Team
            </th>
          </tr>

          <Player label="QB" />
          <Player label="RB" />
          <Player label="RB" />
          <Player label="WR" />
          <Player label="WR" />
          <Player label="FLX" />
          <Player label="TE" />
          <Player label="K" />
          <Player label="DEF" />
          <Player label="BN" />
          <Player label="BN" />
          <Player label="BN" />
          <Player label="BN" />
          <Player label="BN" />
          <Player label="BN" />
        </table>
      </div>
    );
  }
});

