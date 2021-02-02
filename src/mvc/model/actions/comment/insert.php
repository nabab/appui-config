<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var $model \bbn\Mvc\Model*/
if ( isset($model->data['id']) ){
  $pm = new \bbn\Appui\Task($model->db);
  $res = $pm->comment($model->data['id'], [
    'files' => !empty($model->data['files']) ? $model->data['files'] : false,
    'title' => isset($model->data['title']) ? $model->data['title'] : '',
    'text' => isset($model->data['text']) ? $model->data['text'] : ''
  ]);
  return [
    'success' => $res,
    'comment' => $pm->getComment($model->data['id'], $res)
  ];
}
