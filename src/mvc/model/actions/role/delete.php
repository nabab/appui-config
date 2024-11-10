<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var bbn\Mvc\Model $model */

$res = false;
if ( isset($model->data['id_task'], $model->data['id_user']) ){
	$pm = new \bbn\Appui\Task($model->db);
  $res = $pm->removeRole($model->data['id_task'], $model->data['id_user']);
}
return ['success' => $res];