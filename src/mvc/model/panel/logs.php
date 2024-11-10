<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var bbn\Mvc\Model $model */
if ( isset($model->data['id_task']) ){
	$pm = new \bbn\Appui\Task($model->db);
  return $pm->getLog($model->data['id_task']);
}
return [];