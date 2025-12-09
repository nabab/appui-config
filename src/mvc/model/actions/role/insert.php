<?php


/** @var bbn\Mvc\Model $model */

$res = false;
if ( isset($model->data['id_task'], $model->data['role'], $model->data['id_user']) ){
	$pm = new \bbn\Appui\Task($model->db);
  $res = $pm->addRole($model->data['id_task'], $model->data['role'], $model->data['id_user']);
}
return ['success' => $res];