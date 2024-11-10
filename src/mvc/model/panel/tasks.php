<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var bbn\Mvc\Model $model */
if ( isset($model->data['id']) ){
  $task = new \bbn\Appui\Task($model->db);
  return [
    'info' => $task->info($model->data['id'], true)
  ];
}
return [];