var xmlhttp_coord = GetXmlHttpObject() ;
var coord_outbox = [] ;

var coord_graphics_heartbeat_delay   =   250 ;
var coord_graphics_heartbeat_counter =     0 ;
function coord_graphics_heartbeat(){
  if(role!='coord') return ;
  window.setTimeout(coord_graphics_heartbeat, coord_graphics_heartbeat_delay) ;
  coord_graphics_heartbeat_counter++ ;
  coord_draw_table(context) ;
}
function coord_xmlhttp_response(){
  if(xmlhttp_create_new_game.readyState==4){
    Get('div_coord_inbox').innerHTML = xmlhttp_create_new_game.responseText ;
  }
}


function coord_draw_table(context){
  context.fillStyle = 'white' ;
  context.fillRect(0,0,cw,ch) ;
}

