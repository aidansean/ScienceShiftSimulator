var canvas  = null ;
var context = null ;

var cw = 400 ;
var ch = 400 ;

var role = 'none' ;
var game_id = -1 ;

var typeface = 'arial' ;

// game_statuses:
//  0: Not running
//  1: Running
//  2: Ended
var game_status = 0 ;

// Roles:
// 0: coord
// 1: cryo
// For now use 'A', 'B' for roles

var time = 0 ;
var game_heartbeat_delay = 100 ;

var role_infos = [] ;

var delay = 1000 ;
var task_time = 5000 ;
var task_time_base = 1500 ;

var nLives = 5 ;
var lumi = 0 ;
