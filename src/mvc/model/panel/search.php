<?php
/*
 * Describe what it does or you're a pussy
 *
 **/

/** @var bbn\Mvc\Model $model */

if ( isset($model->data['search']) ){
  $pm = new \bbn\Appui\Task($model->db);
  if ( $rows = $pm->search($model->data['search']) ){
    return ['rows' => $rows];
  }
}
return ['rows' => []];