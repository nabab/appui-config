<?php
/*
 * Describe what it does
 *
 **/

/** @var $model \bbn\Mvc\Model*/
if ( isset($model->data['id_task']) ){
	$pm = new \bbn\Appui\Task($model->db);
  return $pm->getLog($model->data['id_task']);
}
return [];