<?php

/** @var bbn\Mvc\Controller $ctrl */
if ( isset($ctrl->arguments[0]) && ($ctrl->arguments[0] === 'tasks') ){
  array_shift($ctrl->arguments);
}
if ( !empty($ctrl->arguments) ){
  $ctrl->addData([
    'is_template' => true,
    'id' => $ctrl->arguments[0]
  ]);
  /** @todo false should be removed as last argument but idk why I need it */
  echo $ctrl->getView('', 'php', false);
  $ctrl->obj->data = $ctrl->getModel();
  if ( isset($ctrl->obj->data['info']) ){
    $ctrl->addJs()->setTitle($ctrl->obj->data['info']['title']);
  }
  $ctrl->obj->url = 'tasks/'.$ctrl->data['id'];
}
