<?php

// Error reporting
ini_set('display_startup_errors',1) ;
ini_set('display_errors',1) ;
error_reporting(-1) ;

include_once('mysql.php') ;
$remove_old_entries = false ;

// Handle incoming requests and update the database entries accordingly
// Safety first, allow only [A-Za-z0-9] and of course escape everything

// Pass most things around using arrays with keys which are database column names

function add_new_row($fields, $mysql_table_name){
  global $mysqli ;
  $keys = array_keys($fields) ;
  $query_keys   = '' ;
  $query_values = '' ;
  for($i=0 ; $i<count($keys) ; $i++){
    if($i!=0){
      $query_keys   = $query_keys   . ',' ;
      $query_values = $query_values . ',' ;
    }
    $query_keys   = $query_keys   . '' . $keys[$i]  . '' ;
    $query_values = $query_values . '"' . $mysqli->escape_string($fields[$keys[$i]]) . '"' ;
  }
  $query = 'INSERT INTO ' . $mysql_table_name . ' (' . $query_keys . ') VALUES (' . $query_values . ')' ;
  $mysqli->query($query) or die("Error: " . $mysqli->error . ' ' . $query) ;
  return get_highest_id($mysql_table_name) ;
}

function get_highest_id($table_name){
  global $mysqli ;
  $query = 'SELECT id FROM ' . $table_name . ' ORDER BY id DESC LIMIT 1' ;
  $query = $mysqli->escape_string($query) ;
  $result = $mysqli->query($query) ;
  $row = $result->fetch_assoc() ;
  $id = $row['id'] ;
  return $id ;
}

function create_game(){
  $fields = array() ;
  $fields['teamname'] = $_GET['teamname'] ;
  $fields['status'  ] = 'open' ;
  add_new_row($fields, 'beam_teams') ;
  $id = get_highest_id('beam_teams') ;
  echo $id ;
}

function gather_team($game_id){
  global $mysqli ;
  $game_id = $mysqli->escape_string($game_id) ;
  $query = 'SELECT * FROM beam_rollcall WHERE game_id=' . $game_id . ' ORDER BY id ASC' ;
  $result = $mysqli->query($query) ;
  $members = [] ;
  if($result){
    while($row = $result->fetch_assoc()){
      if($row['status']==1){
        $members[] = array('role'=>$row['role'],'name'=>$row['name'],'face'=>$row['face']) ;
      }
    }
  }
  return $members ;
}

function get_team_roster(){
  global $mysqli ;
  // To do: Fix this so it returns some xml or something similarly semantic for javascript to parse
  $query = 'SELECT * FROM beam_teams WHERE status=0 ORDER BY id ASC' ;
  $result = $mysqli->query($query) ;
  echo 'Hmm' ;
  return '' ;
}


function game_has_ended($game_id){
  return false ;
  global $mysqli ;
  $game_id = $mysqli->escape_string($game_id) ;
  $query = 'SELECT * FROM beam_teams WHERE game_id=' . $game_id . ' LIMIT 1' ;
  $result = $mysqli->query($query) ;
  while($row = $result->fetch_assoc()){
    if($row['status']=='over') return true ;
  }
  return false ;
}

function wait_for_query($query, $stop, $game_id){
  global $mysqli ;
  $escape = false ;
  $counter = 0 ;
  $responses = array() ;
  while($counter<$stop && $escape==false){
    if(game_has_ended($game_id)){
      print 'GAMEOVER' ;
      return ;
    }
    $result = $mysqli->query($query) ;
    if($result){
      while($row = $result->fetch_assoc()){
        $responses[] = $row ;
        if(count($row)>0) $escape = true ;
      }
    }
    $counter++ ;
    if($escape) break ;
    sleep(1) ;
  }
  return $responses ;
}

function wait_for_task(){
  global $mysqli ;
  $role    = $mysqli->escape_string($_GET['role'   ]) ;
  $game_id = $mysqli->escape_string($_GET['game_id'] );
  $query_read = 'SELECT * FROM beam_bulletin WHERE game_id="' . $game_id . '" AND role="' . $role . '" AND status="created" ORDER BY id ASC' ;
  $response = wait_for_query($query_read, 10, $game_id) ;
  if(count($response)==0){
    echo 'NO_TASKS' ;
    return ;
  }
  $row = $response[0] ;
  $query_update = 'UPDATE beam_bulletin SET status="acknowledged" WHERE id="' . $row['id'] . '"' ;
  $mysqli->query($query_update) ;
  $result = 'id=' . $row['id'] . ';type=' . $row['type'] . ';time=' .  $row['time_ms'] . ';win_condition=' . $row['win_condition'] ;
  echo $result ;
  return ;
}

function create_task(){
  global $mysqli ;
  $fields = [] ;
  $fields['game_id'] = $_GET['game_id'] ;
  $fields['task_id'] = $_GET['task_id'] ;
  $fields['role'   ] = $_GET['role'   ] ;
  $fields['type'   ] = $_GET['type'   ] ;
  $fields['time_ms'] = $_GET['time'   ] ;
  $fields['outcome'] = 'started' ;
  $fields['status' ] = 'created' ;
  $fields['score'  ] = 0 ;
  $fields['win_condition'] = $_GET['win_condition'] ;
  $id = add_new_row($fields, 'beam_bulletin') ;
  $game_id = $mysqli->escape_string($_GET['game_id']) ;
  $role    = $mysqli->escape_string($_GET['role'   ]) ;
  $query_read = 'SELECT * FROM beam_bulletin WHERE id=' . $id . ' AND role="' . $role . '" AND status="resolved" ORDER BY id ASC' ;
  $response = wait_for_query($query_read, 30, $_GET['game_id']) ;
  $row = $response[0] ;
  echo $row['task_id'] , ':' , $row['outcome'] , ':' , $row['score'] ;
}

function resolve_task(){
  global $mysqli ;
  $fields  = [] ;
  $id      = $mysqli->escape_string($_GET['id'     ]) ;
  $outcome = $mysqli->escape_string($_GET['outcome']) ;
  $query_update = 'UPDATE beam_bulletin SET status="resolved", outcome="' . $outcome . '" WHERE id=' . $id ;
  $mysqli->query($query_update) ;
  return ;
}

function end_game(){
  global $mysqli ;
  $game_id = $mysqli->escape_string($_GET['game_id']) ;
  $query = 'UPDATE beam_teams SET status="" WHERE id=' . $game_id ;
}

if(isset($_GET['action'])){
  $action = $_GET['action'] ;
  if($action=='create_game'){
    create_game() ;
  }
  else if($action=='get_team_roster'){
    get_team_roster() ;
  }
  else if($action=='wait_for_task'){
    wait_for_task() ;
  }
  else if($action=='create_task'){
    create_task() ;
  }
  else if($action=='resolve_task'){
    resolve_task() ;
  }
  else if($action=='end_game'){
    end_game() ;
  }
}

?>
