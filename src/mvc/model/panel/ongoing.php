<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var $model \bbn\Mvc\Model*/
$pm = new \bbn\Appui\Task($model->db);
return $pm->getMine(empty($model->data['id']) ? null : $model->data['id']);
