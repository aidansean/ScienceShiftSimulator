function update_team_roster(){
  xmlhttp_team_roster.open('GET', 'request.php?task=get_team_roster&sid=' + Math.random(),true) ;
  xmlhttp_team_roster.send(null) ;
  xmlhttp_team_roster.onreadystatechange = fill_team_roster ;
}

function create_new_game(){
  xmlhttp_create_new_game.onreadystatechange = new_game ;
  var teamname = Get('input_teamname').value ;
  xmlhttp_create_new_game.open('GET', 'request.php?task=new_game&teamname='+teamname+'&sid=' + Math.random(),true) ;
  xmlhttp_create_new_game.send(null) ;
}
function new_game(){
  if(xmlhttp_create_new_game.readyState==4){
    game_id = parseInt(xmlhttp_create_new_game.responseText) ;
    update_team_roster() ;
  }
}
function fill_team_roster(){
  if(xmlhttp_team_roster.readyState==4){
    Get('tbody_team_roster').innerHTML = xmlhttp_team_roster.responseText ;
  }
}

function make_join_button(role, game_id){
  var table = Create('table') ;
  var thead = Create('thead') ;
  var tbody = Create('tbody') ;
  var tr, th, td ;
  
  table.className = 'facepic' ;
  
  // Make top row, containing role name
  tr = Create('tr') ;
  th = Create('th') ;
  th.className = 'desk' ;
  th.innerHTML = role ;
  tr.appendChild(th) ;
  thead.appendChild(tr) ;
  table.appendChild(thead) ;
  
  // Add button
  tr = Create('tr') ;
  td = Create('td') ;
  var submit = Create('input') ;
  submit.type  = 'submit' ;
  submit.value = 'Join\ngame!' ;
  submit.name  = 'input_player_join_'+role ;
  submit.style.width = '100px' ;
  submit.className = 'submit_role' ;
  submit.id = 'submit_join_game_'+game_id ;
  submit.onclick = function(){ join_game(this) } ;
  td.appendChild(submit) ;
  
  // Add the player's name
  var span = Create('span') ;
  span.innerHTML = 'Available' ;
  span.className = 'span_player_name' ;
  td.appendChild(span) ;
  
  tr.appendChild(td) ;
  tbody.appendChild(tr) ;
  
  table.appendChild(tbody) ;
  return table ;
}

function join_game(element){
  role    = element.id.split('_')[3] ;
  game_id = element.id.split('_')[4] ;
  if(role=='coord'){
    coord_graphics_heartbeat() ;
    coord_ajax_heartbeat() ;
    Get('div_rollcall_wrapper'  ).style.display = 'none' ;
    Get('div_coord_desk_wrapper').style.display = '' ;
  }
  if(role=='cryo' ){
    cryo_graphics_heartbeat() ;
    Get('div_rollcall_wrapper' ).style.display = 'none' ;
    Get('div_cryo_desk_wrapper').style.display = '' ;
  }
}

function make_face_table(role, name){
  var table = Create('table') ;
  var thead = Create('thead') ;
  var tbody = Create('tbody') ;
  var tr, th, td ;
  
  table.className = 'facepic' ;
  
  // Make top row, containing role name
  tr = Create('tr') ;
  th = Create('th') ;
  th.className = 'desk' ;
  th.innerHTML = role ;
  tr.appendChild(th) ;
  thead.appendChild(tr) ;
  table.appendChild(thead) ;
  
  // Add a face
  tr = Create('tr') ;
  td = Create('td') ;
  td.className = 'desk facepic' ;
  var img = Create('img') ;
  img.className = 'facepic' ;
  img.src = 'images/blank_face.png' ;
  td.appendChild(img) ;
  
  // Add the player's name
  var span = Create('span') ;
  span.innerHTML = name ;
  span.className = 'span_player_name' ;
  td.appendChild(span) ;
  
  tr.appendChild(td) ;
  tbody.appendChild(tr) ;
  
  table.appendChild(tbody) ;
  return table ;
}
