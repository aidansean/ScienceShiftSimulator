function XY_from_mouse(evt){
  var X = evt.pageX - evt.target.offsetLeft ;
  var Y = evt.pageY - evt.target.offsetTop  ;
  return [X,Y] ;
}

function isRightClick(evt){
  var rightclick = false ;
  if(!evt) var evt = window.event ;
  if(evt.which) rightclick = (evt.which==3) ;
  else if(evt.button) rightclick = (evt.button==2) ;
  return rightclick ;
}

function keydown(evt){
  var keyDownID = window.event ? event.keyCode : (evt.keyCode != 0 ? evt.keyCode : evt.which) ;
  switch(keyDownID){
    case 37: break ; // left
    case 38: break ; // up
    case 39: break ; // right
    case 40: break ; // down
    case 32: // space
      evt.preventDefault() ;
      game_status = (game_status+1)%3 ;
      break ;
  }
}
