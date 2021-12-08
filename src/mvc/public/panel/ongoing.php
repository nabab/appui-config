<?php

/** @var $ctrl \bbn\Mvc\Controller */
if ( !isset($ctrl->post['id']) ){
  echo $ctrl->setTitle('<i class="nf nf-fa-clock"> </i> &nbsp; _("Mes tâches en cours")')->addJs([
    'root' => $ctrl->data['root'],
    'lng' => [
      'title' => _("Title"),
      'type' => _("Type"),
      'state' => _("State"),
      'duration' => _("Duration"),
      'unknown' => _("Unknown"),
      'start' => _("Start"),
      'last'=> _("Last"),
      'deadline' => _("Deadline"),
      'see_task' => _("See task")
    ]
  ])->getView();
}
else{
  $ctrl->obj->tasks = $ctrl->getModel($ctrl->post);
}