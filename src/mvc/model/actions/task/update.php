<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var bbn\Mvc\Model $model */
$pm = new \bbn\Appui\Task($model->db);
return [
  'success' => isset($model->data['id_task'], $model->data['prop']) ?
    $pm->update(
      $model->data['id_task'],
      $model->data['prop'],
      isset($model->data['val']) ? $model->data['val'] : null) :
    false
];