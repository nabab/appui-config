<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var $model \bbn\Mvc\Model*/
if ( isset($model->data['id']) ){
  $task = new \bbn\Appui\Task($model->db);
  //$statuses = empty($model->data['closed']) ? 'opened|ongoing|holding' : false;
  return $task->getTree($model->data['id']);
}
return [];
