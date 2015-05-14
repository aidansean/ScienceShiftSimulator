var pi = Math.PI ;
function cos(x)    { return Math.cos(x)     ; }
function sin(x)    { return Math.sin(x)     ; }
function sqrt(x)   { return Math.sqrt(x)    ; }
function atan2(y,x){ return Math.atan2(y,x) ; }
function pow(x,y)  { return Math.pow(x,y)   ; }
function floor(x)  { return Math.floor(x)   ; }

function Create(type){ return document.createElement(type) ; }
function Get(id){ return document.getElementById(id) ; }

function get_digits(start,end,number){
  var string = ''+number ;
  var result = parseInt(string.substr(1+start,end-start+1)) ;
  return result ;
}
function getParameterByName(name){
  // Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search) ;
  return match && decodeURIComponent(match[1].replace(/\+/g, ' ')) ;
}

