<?php


/** @var bbn\Mvc\Model $model */
$pm = new \bbn\Appui\Task($model->db);
return $pm->getMine(empty($model->data['id']) ? null : $model->data['id']);
