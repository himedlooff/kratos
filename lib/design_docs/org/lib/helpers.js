// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var auth, x;

  auth = require('./auth/auth');

  x = {};

  x.mk_objs = function(obj, path_array, val) {
    var key, last_key, _i, _len;
    if (val == null) {
      val = {};
    }

    /*
    make a set of nested object.
    
    obj = {'x': 1}
    mk_objs(obj, ['a', 'b'], ['1'])
     * returns []
     * obj now equals {'x': 1, 'a': {'b': ['1']}}
    
    return the val
     */
    last_key = path_array.pop();
    for (_i = 0, _len = path_array.length; _i < _len; _i++) {
      key = path_array[_i];
      if (obj[key] == null) {
        obj[key] = {};
      }
      obj = obj[key];
    }
    if (!obj[last_key]) {
      obj[last_key] = val;
    }
    return obj[last_key];
  };

  x.add_team_perms = function(original_team, user) {

    /*
    return a copy of the team with permissions metadata added to the roles and resources
     */
    var perms, role_name, rsrc_auth, rsrc_name, team, _i, _j, _len, _len1, _ref, _ref1;
    team = JSON.parse(JSON.stringify(original_team));
    _ref = auth.resources;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rsrc_name = _ref[_i];
      rsrc_auth = auth[rsrc_name];
      perms = x.mk_objs(team.rsrcs, [rsrc_name, 'perms'], {
        add: rsrc_auth.add_team_asset(user, team),
        remove: rsrc_auth.remove_team_asset(user, team)
      });
    }
    _ref1 = auth.roles.team;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      role_name = _ref1[_j];
      x.mk_objs(team.roles, [role_name, 'perms'], {
        add: auth.kratos.add_team_member(user, team, role_name),
        remove: auth.kratos.remove_team_member(user, team, role_name)
      });
    }
    return team;
  };

  module.exports = x;

}).call(this);
