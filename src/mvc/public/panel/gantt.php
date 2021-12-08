<?php

/** @var $ctrl \bbn\Mvc\Controller */
echo $ctrl->setTitle("Gantt")->addJs([
  'root' => $ctrl->data['root'],
  'lng' => [
    'priority' => _("Priority"),
    'type' => _("Type"),
    'state' => _("State"),
    'duration' => _("Duration"),
    'unknown' => _("Unknown"),
    'start' => _("Start"),
    'last' => _("Last"),
    'title' => _("Title")
  ]
])->getView();
