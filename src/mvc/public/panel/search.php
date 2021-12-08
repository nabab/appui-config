<?php

/** @var $ctrl \bbn\Mvc\Controller */
if ( !isset($ctrl->post['search']) ){
  $ctrl->combo('<i class="nf nf-fa-home bbn-lg" title="'._("New task").' / '._("Search").'"> </i>', [
    'root' => $ctrl->data['root'],
    'lng' => $ctrl->getModel('./lng/search')
  ]);
}
else{
  $ctrl->obj->data = $ctrl->getModel($ctrl->post);
}