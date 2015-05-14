function draw_face(context){
  context.fillStyle = 'rgb(100,100,100)' ;
  context.fillRect(0,0,100,100) ;
  
  context.fillStyle = 'rgb(255,255,255)' ;
  context.save() ;
  context.translate(50,150) ;
  context.arc(0,0,80,0,2*Math.PI,true)
  context.fill() ;
  context.restore() ;
  
  context.translate(50,40) ;
  context.arc(0,0,35,0,2*Math.PI,true)
  context.fill() ;
}
function wrapText(context,text,x,y_in,maxWidth,lineHeight,draw){
  // Taken from www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
  if(text==undefined) return 0 ;
  var words = text.split(' ') ;
  var line = '' ;
  var w = 0 ;
  var h = 0 ;
  var y = 0 ;

  for(var n=0 ; n<words.length ; n++){
    var testLine = line + words[n] + ' ' ;
    var testWidth = context.measureText(testLine).width ;
    if(testWidth>maxWidth){
      y = y_in+h ;
      if(draw) context.fillText(line, x, y) ;
      line = words[n] + ' ' ;
      h += lineHeight ;
    }
    else{
      line = testLine ;
      if(testWidth>w) w = testWidth ;
    }
  }
  y = y_in+h ;
  context.textBaseline = 'top' ;
  if(draw) context.fillText(line, x, y) ;
  h += lineHeight ;
  if(draw==-1) return w ;
  return h ;
}

