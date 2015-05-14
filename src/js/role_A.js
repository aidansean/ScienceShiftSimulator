function task_A_pressButton(){
  this.parent = null ;
  this.name = 'PressButton' ;
  this.margin = 50 ;
  this.draw = function(){
    var c = this.parent.context ;
    c.fillStyle = 'rgb(255,255,255)' ;
    c.fillRect(0,0,cw,ch) ;
    
    var m = this.margin ;
    c.lineWidth = 5 ;
    c.strokeStyle = 'black' ;
    
    var rw = (cw-3*m)/2 ;
    var rh = (ch-3*m)/2 ;
    
    var xValues = [m , 2*m+rw , m , 2*m+rw] ;
    var yValues = [m , m , 2*m+rh , 2*m+rh] ;
    
    c.font = '20px arial' ;
    c.textAlign = 'center' ;
    c.baseAlign = 'middle' ;
    c.fillStyle = 'blue' ;
    for(var i=0 ; i<xValues.length ; i++){
      c.strokeRect(xValues[i],yValues[i],rw,rh) ;
      var x = xValues[i]+0.5*rw ;
      var y = yValues[i]+0.5*rh ;
      c.fillText('Power cycle magnet ' + (i+1),x,y) ;
    }
    
    this.parent.update_time_bar() ;
  }
  this.random_win_condition = function(){
    return Math.floor(Math.random()*4) ;
  }
  this.win_condition = this.random_win_condition() ;
  this.win_condition_text = function(cond){
    return 'Power cycle magnet number ' + (cond+1) ;
  }
  
  this.error_message = function(){
    return 'Power failure!' ;
  }
  
  this.click = function(evt){
    var win = this.win_condition ;
    var m = this.margin ;
    var w = this.parent.canvas.width  ;
    var h = this.parent.canvas.height ;
    var rw = (w-3*m)/2 ;
    var rh = (h-3*m)/2 ;
    var x1 = (win%2==0) ? m : 2*m+rw ;
    var y1 = (win<2   ) ? m : 2*m+rh ;
    var x2 = x1+rw ;
    var y2 = y1+rh ;
    var XY = XY_from_mouse(evt) ;
    if(XY[0]>=x1 && XY[0]<=x2 && XY[1]>=y1 && XY[1]<=y2){
      this.parent.succeed() ;
    }
    else{
      this.parent.fail() ;
    }
  }
}




function task_A_SetFlow(){
  this.parent = null ;
  this.name = 'SetFlow' ;
  this.margin = 50 ;
  
  var m = this.margin ;
  var dx = (cw-4*m)/4 ;
  var x1 = m ;
  var x2 = m + 2*dx ;
  var x3 = x2 + m  ;
  var x3b = x3 + dx/2 ;
  var x4 = x3 + dx ;
  var x5 = x4 + m  ;
  var x5b = x5 + dx/2 ;
  var x6 = x5 + dx ;
  var y1 = m ;
  var y2 = ch-m ;
  
  this.points_u = [ [x3,y2] , [x4,y2 ] , [x3b,y1] ] ;
  this.points_d = [ [x5,y1] , [x5b,y2] , [x6,y1 ] ] ;
  
  var u = this.points_u ;
  var d = this.points_d ;
  
  this.triangle_area = 1/2*(-u[1][1]*u[2][0] + u[0][1]*(-u[1][0] + u[2][0]) + u[0][0]*(u[1][1] - u[2][1]) + u[1][0]*u[2][1]) ;
  
  this.error_message = function(){
    return 'Helium flow out of control!' ;
  }
  
  this.draw = function(){
    var c = this.parent.context ;
    c.fillStyle = 'rgb(255,255,255)' ;
    c.fillRect(0,0,cw,ch) ;
    
    c.font = '100px arial' ;
    c.textAlign = 'center' ;
    c.baseAlign = 'middle' ;
    c.fillStyle = 'black' ;
    
    var x = cw/3 ;
    var y = ch/2 ;
    c.fillText(this.flow, x, y) ;
    
    var u = this.points_u ;
    var d = this.points_d ;
    
    c.fillStyle = 'green' ;
    c.beginPath() ;
    c.moveTo(u[0][0],u[0][1]) ;
    c.lineTo(u[1][0],u[1][1]) ;
    c.lineTo(u[2][0],u[2][1]) ;
    c.lineTo(u[0][0],u[0][1]) ;
    c.fill() ;
    
    c.fillStyle = 'red' ;
    c.beginPath() ;
    c.moveTo(d[0][0],d[0][1]) ;
    c.lineTo(d[1][0],d[1][1]) ;
    c.lineTo(d[2][0],d[2][1]) ;
    c.lineTo(d[0][0],d[0][1]) ;
    c.fill() ;
    
    this.parent.update_time_bar() ;
  }
  this.random_win_condition = function(){
    return 5+Math.floor(Math.random()*10) ;
  }
  this.win_condition = this.random_win_condition() ;
  this.win_condition_text = function(cond){
    return 'Set flow to ' + (cond) + 'm<sup>3</sup>/s' ;
  }
  this.flow = this.random_win_condition() ;
  
  this.click = function(evt){
    // Essentially look to see the mouse is inside the triangles using barycentres
    var XY = XY_from_mouse(evt) ;
    var u = this.points_u ;
    var d = this.points_d ;
    var area = this.triangle_area ;
    var su = 1/(2*area)*(u[0][1]*u[2][0] - u[0][0]*u[2][1] + (u[2][1] - u[0][1])*XY[0] + (u[0][0] - u[2][0])*XY[1]) ;
    var tu = 1/(2*area)*(u[0][0]*u[1][1] - u[0][1]*u[1][0] + (u[0][1] - u[1][1])*XY[0] + (u[1][0] - u[0][0])*XY[1]) ;
    var sd = 1/(2*area)*(d[0][1]*d[2][0] - d[0][0]*u[2][1] + (d[2][1] - d[0][1])*XY[0] + (d[0][0] - d[2][0])*XY[1]) ;
    var td = 1/(2*area)*(d[0][0]*d[1][1] - d[0][1]*u[1][0] + (d[0][1] - d[1][1])*XY[0] + (d[1][0] - d[0][0])*XY[1]) ;
    
    var in_u = (0<=su && su<=1 && 0<=tu && tu<=1 && su+tu<=1) ;
    var in_d = (0<=sd && sd<=1 && 0<=td && td<=1 && sd+td<=1) ;
    
    if(in_u) this.flow++ ;
    if(in_d) this.flow-- ;
  }
  this.timeout = function(){
    if(this.flow==this.win_condition){
      this.parent.succeed() ;
    }
    else{
      this.parent.fail() ;
    }
  }
}



function role_A(){
  this.task_bases = [] ;
  this.task_bases['PressButton'] = new task_A_pressButton() ;
  this.task_bases['SetFlow'    ] = new task_A_SetFlow() ;
  this.task_keys = [] ;
  for(var key in this.task_bases){ this.task_keys.push(key) ; }
  this.name = 'A' ;
  this.title = 'Magnet expert' ;
  this.score = 0 ;
  this.create_task = function(canvas, taskname, time, id, game_id){
    var task_base = this.task_bases[taskname] ;
    var task = new task_object(canvas, time, task_base, id, game_id, this.name) ;
    task.win_condition = task.base.random_win_condition() ;
    return task ;
  }
  this.fetch_task = function(){ fetch_task('A') ; }
  this.create_random_task = function(canvas, time, id, game_id){
    var index = Math.floor(Math.random()*this.task_keys.length) ;
    var task_name = this.task_keys[index] ;
    return this.create_task(canvas, task_name, time, id, game_id) ;
  }
  
  xmlhttp_desk[this.name] = GetXmlHttpObject() ;
  var x = xmlhttp_desk[this.name] ;
  var request = 'action=none' ;
  x.open('GET', 'request.php?'+request+'&sid='+Math.random(),true) ;
  x.send(null) ;
}

desks['A'] = new role_A() ;

