<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var $model \bbn\Mvc\Model*/
$pm = new \bbn\Appui\Task($model->db);
return [
  'success' => isset($model->data['id_task'], $model->data['prop']) ?
    $pm->update(
      $model->data['id_task'],
      $model->data['prop'],
      isset($model->data['val']) ? $model->data['val'] : null) :
    false
];