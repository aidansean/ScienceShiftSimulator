var xmlhttp_cryo = GetXmlHttpObject() ;

var cryo_r1 = 0.3*ch ;
var cryo_r2 = 0.4*ch ;
var cryo_nSectors = 8 ;

var cryo_cx = 0.5*cw ;
var cryo_cy = 0.5*ch ;

var cryo_temperature = 4.2 ;

var cryo_graphics_heartbeat_delay   = 250 ;
var cryo_ajax_heartbeat_delay       = 250 ;
var cryo_graphics_heartbeat_counter =   0 ;
var cryo_ajax_heartbeat_counter     =   0 ;
function cryo_graphics_heartbeat(){
  if(role!='cryo') return ;
  window.setTimeout(cryo_graphics_heartbeat, cryo_graphics_heartbeat_delay) ;
  cryo_graphics_heartbeat_counter++ ;
  
  cryo_draw_background (context) ;
  cryo_draw_all_sectors(context) ;
  cryo_draw_temperature(context) ;
}
function cryo_draw_background(context){
  context.fillStyle = 'black' ;
  context.fillRect(0,0,cw,ch) ;
}

var cryo_actions_box_title = 'Actions' ;
var cryo_actions_box_messages = [] ;
cryo_actions_box_messages.push('') ;
cryo_actions_box_messages.push('') ;
cryo_actions_box_messages.push('') ;
cryo_actions_box_messages.push('') ;

function cryo_capture_click(XY){
  // First check sectors
  var dx = XY[0]-cryo_cx ;
  var dy = XY[1]-cryo_cy ;
  var r = sqrt( dx*dx + dy*dy ) ;
  if(r>=cryo_r1 && r<=cryo_r2){
    var t = atan2(dy,dx)+0.5*pi ;
    if(t<0) t += 2*pi ;
    var index = floor(cryo_nSectors*t/(2*pi)) ;
    
    var s1 = index+1 ;
    var s2 = (index==cryo_nSectors-1) ? 1 : (index+2)%(cryo_nSectors+1) ;
    cryo_actions_box_title = 'Sector ' + s1 + '-' + s2 ;
    cryo_actions_box_messages[0] = 'Ignore problem' ;
    cryo_actions_box_messages[1] = 'Fix leak' ;
    cryo_actions_box_messages[2] = 'Adjust pressure' ;
    cryo_actions_box_messages[3] = 'PANIC!' ;
  }
  
}

function cryo_draw_all_sectors(context){
  context.strokeStyle = 'white' ;
  context.lineWidth = 2 ;
  
  for(var i=0 ; i<cryo_nSectors ; i++){ cryo_draw_sector(i) ; }
  
  context.beginPath() ;
  context.arc(cryo_cx, cryo_cy, cryo_r1, 0, 2*pi, true) ;
  context.stroke() ;
  
  context.beginPath() ;
  context.arc(cryo_cx, cryo_cy, cryo_r2, 0, 2*pi, true) ;
  context.stroke() ;
}

function cryo_draw_sector(index){
  context.fillStyle = '#00ff00' ;
  var dt = 2*pi*0.005 ;
  var dr = 10 ;
  var t1 = 2*pi*(index+0)/cryo_nSectors + dt - 0.5*pi ;
  var t2 = 2*pi*(index+1)/cryo_nSectors - dt - 0.5*pi ;
  
  var r1 = cryo_r1+dr ;
  var r2 = cryo_r2-dr ;
  var xA = cryo_cx+r1*cos(t1) ; var yA = cryo_cy+r1*sin(t1) ;
  var xB = cryo_cx+r2*cos(t1) ; var yB = cryo_cy+r2*sin(t1) ;
  var xC = cryo_cx+r2*cos(t2) ; var yC = cryo_cy+r2*sin(t2) ;
  var xD = cryo_cx+r1*cos(t2) ; var yD = cryo_cy+r1*sin(t2) ;
  
  context.beginPath() ;
  context.moveTo(xA, yA) ;
  context.lineTo(xB, yB) ;
  context.arc(cryo_cx, cryo_cy, r2, t1, t2, false) ;
  context.moveTo(xC, yC) ;
  context.lineTo(xD, yD) ;
  context.arc(cryo_cx, cryo_cy, r1, t2, t1, true ) ;
  context.fill() ;
  
  context.save() ;
  var r = 0.5*(r1+r2) ;
  var t = 0.5*(t1+t2) ;
  var x = cryo_cx+r*cos(t) ;
  var y = cryo_cy+r*sin(t) ;
  context.translate(x,y) ;
  context.rotate(0.5*pi+t) ;
  var font_size = 20 ;
  context.fillStyle = 'black' ;
  context.font = font_size + 'px arial' ;
  context.textAlign = 'center' ;
  context.textBaseline = 'top' ;
  var s1 = index+1 ;
  var s2 = (index==cryo_nSectors-1) ? 1 : (index+2)%(cryo_nSectors+1) ;
  context.fillText(s1+'-'+s2, 0, -0.5*font_size) ;
  context.restore() ;
}

function cryo_draw_temperature(context){
  var color1 = '00FF00' ;
  var color2 = '00FF00' ;
  if(cryo_graphics_heartbeat_counter%10==0) cryo_temperature = Math.floor(Math.random()*100) ;
  var flicker = (cryo_graphics_heartbeat_counter)%4>1 ;
  if(cryo_temperature<10){
  }
  else if(cryo_temperature<20){
    color1 = '#00FF00' ;
    color2 = (flicker) ? '#000000' : '#00FF00' ;
  }
  else if(cryo_temperature<77){
    color1 = '#FFFF00' ;
    color2 = (flicker) ? '#000000' : '#FFFF00' ;
  }
  else{
    color1 = '#FF0000' ;
    color2 = (flicker) ? '#FFFFFF' : '#FF0000' ;
  }
  var cx = 0.5*cw ;
  var cy = 0.5*ch ;
  context.textAlign = 'center' ;
  context.textBaseline = 'middle' ;
  
  var font_size = 20 ;
  context.fillStyle = color1 ;
  context.font = font_size + 'px ' + typeface ;
  context.fillText('Ambient temperature:', cryo_cx, cryo_cy-font_size) ;
  
  var font_size = 50 ;
  context.fillStyle = color2 ;
  context.font = font_size + 'px ' + typeface ;
  context.fillText(cryo_temperature+' K', cryo_cx, cryo_cy+0.6*font_size) ;
}



