function GetXmlHttpObject(){
  if(window.XMLHttpRequest){
    // code for IE7+, Firefox, Chrome, Opera, Safari
    return new XMLHttpRequest() ;
  }
  if(window.ActiveXObject){
    // code for IE6, IE5
    return new ActiveXObject("Microsoft.XMLHTTP") ;
  }
  return null ;
}

//var xmlhttp_create_new_game = GetXmlHttpObject() ;
//var xmlhttp_team_roster     = GetXmlHttpObject() ;
var xmlhttp_coordToDesk = [] ;
var xmlhttp_desk        = [] ;
