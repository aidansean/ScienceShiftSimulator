var desks = [] ;

var cw = 750 ;
var ch = 250 ;

function game_heartbeat(){
  if(game_status==2) return ;
  window.setTimeout(game_heartbeat, game_heartbeat_delay) ;
  if(game_status==1){
    time += game_heartbeat_delay ;
    var s = parseInt(time/1000) ;
    var mins = parseInt(s/60) ;
    var secs = s%60 ;
    if(secs<10) secs = '0'+secs ;
    Get('div_timer').innerHTML = mins + ':' + secs ;
    lumi += nLives ;
    if(Get('span_lumi')) Get('span_lumi').innerHTML = lumi ;
  }
}

function start(){
  canvas = Get('canvas_main') ;
  context = canvas.getContext('2d') ;
  context.translate(0.5,0.5) ;
  cw = canvas.width  ;
  ch = canvas.height ;
  
  var role_name = getParameterByName('role') ;
  if(role_name=='coord') role = 'coord' ;
  if(role_name=='A'    ) role = 'A'     ;
  
  var game_id = parseInt(getParameterByName('game_id')) ;
  if(isNaN(game_id)) game_id = 0 ;
  
  document.addEventListener('keydown',keydown) ;
  
  if(Get('button_create_task_A')) Get('button_create_task_A').addEventListener('click',start_coord) ;
  if(Get('button_fetch_task_A' )) Get('button_fetch_task_A' ).addEventListener('click',start_A ) ;
  
  game_status = 0 ;
  game_heartbeat() ;
  reset_canvas() ;
}

function start_coord(){
  game_status = 1 ;
  Get('button_create_task_A').style.display = 'none' ;
  create_task_A() ;
}


function start_A(){
  game_status = 1 ;
  Get('button_fetch_task_A').style.display = 'none' ;
  fetch_task_A() ;
}

function create_task_A(){ create_task('A') ; }
function  fetch_task_A(){  fetch_task('A') ; }

function create_task(desk_name){
  if(nLives<=0){
    endgame() ;
    return ;
  }
  xmlhttp_coordToDesk[desk_name] = GetXmlHttpObject() ;
  var x = xmlhttp_coordToDesk[desk_name] ;
  var task_name = 'PressButton' ;
  
  var time = 5000 ;
  var t = desks[desk_name].create_random_task(canvas, task_time_base+task_time, task_counter, game_id) ;
  task_time *= 0.9 ;
  
  var request = t.create_request() ;
  x.onreadystatechange = parse_returned_task ;
  x.open('GET', 'request.php?'+request+'&sid='+Math.random(),true) ;
  x.send(null) ;
  
  var tr = Create('tr') ;
  var td ;
  td = Create('td') ;
  td.id = 'td_task_id_' + task_counter ;
  td.className = 'task' ;
  td.innerHTML = task_counter ;
  tr.appendChild(td) ;
  
  td = Create('td') ;
  td.id = 'td_task_status_' + task_counter ;
  td.className = 'task' ;
  td.innerHTML = 'waiting' ;
  td.style.backgroundColor = 'yellow' ;
  tr.appendChild(td) ;
  
  td = Create('td') ;
  td.id = 'td_task_desk_' + task_counter ;
  td.className = 'task' ;
  td.innerHTML = 'A' ;
  tr.appendChild(td) ;
  
  td = Create('td') ;
  td.id = 'td_task_problem_' + task_counter ;
  td.className = 'task' ;
  td.innerHTML = t.error_message() ;
  tr.appendChild(td) ;
  
  td = Create('td') ;
  td.id = 'td_task_solution_' + task_counter ;
  td.className = 'task' ;
  td.innerHTML = t.win_condition_text(t.win_condition) ;
  tr.appendChild(td) ;
  
  Get('tbody_tasklist').insertBefore(tr, Get('tbody_tasklist').firstChild) ;
  
  task_counter++ ;
}

function fetch_task(desk_name){
  if(nLives<=0){
    endgame() ;
    return ;
  }
  var x = xmlhttp_desk[desk_name] ;
  if(x.readyState==4){
    var request = 'action=wait_for_task&game_id=' + game_id + '&role=' + desk_name ;
    x.onreadystatechange = parse_fetched_task ;
    x.open('GET', 'request.php?'+request+'&sid='+Math.random(),true) ;
    x.send(null) ;
  }
}

function parse_returned_task(){
  if(nLives<=0){
    endgame() ;
    return ;
  }
  var desk_name = 'A' ;
  if(xmlhttp_coordToDesk[desk_name].readyState==4){
    var text = xmlhttp_coordToDesk[desk_name].responseText ;
    var task_id = parseInt(text.split(':')[0]) ;
    var outcome = text.split(':')[1] ;
    desks[desk_name].score += parseInt(text.split(':')[2]) ;
    
    var td = Get('td_task_status_'+task_id) ;
    td.innerHTML = outcome ;
    td.style.color = 'white' ;
    td.style.backgroundColor = (outcome=='success') ? 'green' : 'red' ;
    if(outcome!='success') decrement_lives() ;
    
    Get('td_task_problem_' +task_id).innerHTML = '' ;
    Get('td_task_solution_'+task_id).innerHTML = '' ;
    
    delay = 0.9*delay ;
    window.setTimeout(create_task_A, delay) ;
  }
}
function parse_fetched_task(){
  if(nLives<=0){
    endgame() ;
    return ;
  }
  var desk_name = 'A' ;
  var text = xmlhttp_desk[desk_name].responseText ;
  if(xmlhttp_desk[desk_name].readyState==4){
    if(text=='NO_TASKS'){
      fetch_task(desk_name) ;
      xmlhttp_desk[desk_name] = GetXmlHttpObject() ;
      return ;
    }
    
    var id   = text.split('id='  )[1].split(';')[0] ;
    var type = text.split('type=')[1].split(';')[0] ;
    var time = text.split('time=')[1].split(';')[0] ;
    var win_condition = text.split('win_condition=')[1].split(';')[0] ;
    var t = desks[desk_name].create_task(canvas, type, time, id, game_id) ;
    t.base.win_condition = parseInt(win_condition) ;
    current_task = t ;
    t.start() ;
    xmlhttp_desk[desk_name] = GetXmlHttpObject() ;
  }
}

function reset_canvas(){
  context.drawImage(Get('img_ACR'),0,0) ;
  context.fillStyle = 'rgba(255,255,255,0.5)' ;
  context.fillRect(0,0,1000,1000) ;
}
function success_canvas(){
  context.fillStyle = 'green' ;
  context.fillRect(0,0,cw,ch) ;
  context.fillStyle = 'white' ;
  context.textAlign = 'center' ;
  context.textBaseline = 'middle' ;
  context.font = '100px arial' ;
  context.fillText('WIN!',cw/2,ch/2) ;
}
function failure_canvas(){
  context.fillStyle = 'red' ;
  context.fillRect(0,0,cw,ch) ;
  context.fillStyle = 'white' ;
  context.textAlign = 'center' ;
  context.textBaseline = 'middle' ;
  context.font = '100px arial' ;
  context.fillText('FAIL',cw/2,ch/2) ;
}
function timeout_canvas(){
  context.fillStyle = 'red' ;
  context.fillRect(0,0,cw,ch) ;
  context.fillStyle = 'white' ;
  context.textAlign = 'center' ;
  context.textBaseline = 'middle' ;
  context.font = '100px arial' ;
  context.fillText('TIMEOUT',cw/2,ch/2) ;
}
function gameover_canvas(){
  context.fillStyle = 'red' ;
  context.fillRect(0,0,cw,ch) ;
  context.fillStyle = 'white' ;
  context.textAlign = 'center' ;
  context.textBaseline = 'middle' ;
  context.font = '100px arial' ;
  context.fillText('BEAM LOSS!',375,ch/2) ;
}

function endgame(){
  game_status = 2 ;
  gameover_canvas() ;
  if(Get('audio_dump')) Get('audio_dump').play() ;
}

function decrement_lives(){
  Get('td_life_'+nLives).className = 'td_life_dead' ;
  //nLives-- ;
}
