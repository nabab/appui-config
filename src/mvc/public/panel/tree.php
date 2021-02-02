<?php
/*
 * Describe what it does to show you're not that dumb!
 *
 **/

/** @var $ctrl \bbn\Mvc\Controller */
if ( !isset($ctrl->arguments[0]) ){
  $ctrl->addData([
    'cat' => '0',
    'is_admin' => $ctrl->inc->user->isAdmin(),
    'lng' => [
      'problem_while_moving' => _("Sorry, a problem occured while moving this item, and although the tree says otherwise the item has not been moved."),
      'please_refresh' => _("Please refresh the tab in order to see the awful truth..."),
      'confirm_move' => _("Are you sure you want to move this task?")
    ]
  ]);
  $ctrl->combo("Tasks' tree", $ctrl->data);
}
else{
  $ctrl->obj->data = $ctrl->getModel(['id' => $ctrl->arguments[0]]);
}
