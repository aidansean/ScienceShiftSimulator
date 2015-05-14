<?php
$title = 'LHC Beam Driver' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('js/settings.js', 'js/helper.js', 'js/ajax.js', 'js/functions.js', 'js/controls.js', 'js/draw.js', 'js/task.js', 'js/role_A.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
include_once('mysql.php') ;
?>

<div class="right">
  <div class="blurb">
    <div id="div_timer"></div>
    <canvas id="canvas_main" width="750px" height="250px"></canvas>
    <input type="submit" id="button_create_task_A" value="Create task A"/><br />
    <input type="submit" id="button_fetch_task_A" value="Fetch task A"/>
    <div id="div_debug_xml"></div>
    <div id="div_debug"></div>
    <div id="div_debug2"></div>
    <div id="div_debug3"></div>
    <div id="div_hidden_image">
      <img id="img_ACR" src="images/ACR.jpg"/>
    </div>
  </div>
</div>

<?php foot() ; ?>