<?php
   //sets the content type to javascript 
   header('Content-type: text/javascript');

   // includes all js files of the directory
   foreach(glob("assets/geojson/*.js") as $file) {
      readfile($file);
   }
?>