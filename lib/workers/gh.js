// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var add_remove_user, conf, couch_utils, get_gh_team_id, get_gh_team_type, gh_conf, git_client, git_url, iced, request, user_db, users, __iced_k, __iced_k_noop,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  request = require('request');

  couch_utils = require('../couch_utils');

  users = require('../api/users');

  conf = require('../config');

  gh_conf = conf.RESOURCES.GH;

  git_client = request.defaults({
    auth: gh_conf.ADMIN_CREDENTIALS,
    headers: {
      'User-Agent': 'cfpb-kratos'
    }
  });

  git_url = 'https://api.github.com';

  user_db = couch_utils.nano_admin.use('_users');

  get_gh_team_type = function(user, role) {
    var is_contractor, _ref;
    is_contractor = (_ref = user.data) != null ? _ref.contractor : void 0;
    if (is_contractor) {
      return 'write';
    } else {
      return 'admin';
    }
  };

  get_gh_team_id = function(gh_teams, gh_team_type, callback) {
    var team_id;
    team_id = gh_teams[gh_team_type];
    return callback(null, team_id);
  };

  add_remove_user = function(action_name, user, role, gh_teams, callback) {
    var action, err, gh_team_type, resp, team_id, url, username, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    if (__indexOf.call(user.roles, 'gh|user') < 0) {
      return callback();
    }
    username = (_ref = user.rsrcs.gh) != null ? _ref.login : void 0;
    if (!username) {
      return callback({
        user: user,
        err: 'no username'
      });
    }
    gh_team_type = get_gh_team_type(user, role);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/greisend/programming/open-source-wizard/node/src/workers/gh.iced"
        });
        get_gh_team_id(gh_teams, gh_team_type, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return team_id = arguments[1];
            };
          })(),
          lineno: 35
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (err) {
          return callback(err);
        }
        action = action_name === 'u+' ? git_client.put : git_client.del;
        url = git_url + '/teams/' + team_id + '/memberships/' + username;
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/greisend/programming/open-source-wizard/node/src/workers/gh.iced"
          });
          action(url, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return resp = arguments[1];
              };
            })(),
            lineno: 40
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (resp.statusCode >= 400) {
            return callback({
              msg: resp.body,
              code: resp.statusCode
            });
          }
          return callback(err);
        });
      };
    })(this));
  };

  module.exports = {
    handle_team_event: function(event, team, callback) {
      var err, gh_teams, user, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      gh_teams = team.rsrcs.gh.data;
      if (event.a[0] === 'u') {
        (function(_this) {
          return (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/greisend/programming/open-source-wizard/node/src/workers/gh.iced"
            });
            users._get_user(event.v, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return user = arguments[1];
                };
              })(),
              lineno: 50
            }));
            __iced_deferrals._fulfill();
          });
        })(this)((function(_this) {
          return function() {
            if (err) {
              return callback(err);
            }
            return add_remove_user(event.a, user, event.k, gh_teams, callback);
            return __iced_k();
          };
        })(this));
      } else {
        console.log('SKIPPING');
        return callback();
        return __iced_k();
      }
    },
    handle_user_event: function(event, doc, callback) {},
    add_resource: function(data, callback) {},
    update_resource: function(data, doc, callback) {}
  };

}).call(this);
