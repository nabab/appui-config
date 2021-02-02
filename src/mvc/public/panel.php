<?php
/*
 * Describe what it does to show you're not that dumb!
 *
 **/
use bbn\X;

/** @var $ctrl \bbn\Mvc\Controller */

// Needed for the tabNav!!

/*
if ( $ctrl->getUrl() === $ctrl->obj->url ){
  $ctrl->obj->current = $ctrl->getDir().'/projects/ongoing';
}
$new = $ctrl->add('./new');
if ( $obj = $new->get() ){
	$ctrl->data['title'] = $obj->title;
  $ctrl->data['content'] = $obj->content;
  $ctrl->data['script'] = $obj->script;
  if ( !empty($obj->data) ){
    $ctrl->addData($obj->data);
  }
}
*/

/*
if ( empty($ctrl->post['appui_baseURL']) ){
  $ctrl->combo('<i class="nf nf-fa-bug"> </i> &nbsp; '._("Projects"), true);
  $ctrl->obj->bcolor = '#000000';
  $ctrl->obj->fcolor = '#FFFFFF';
  $ctrl->obj->url = $ctrl->getDir();
}
else if ( !empty($ctrl->arguments) ){
  $controller = $ctrl->add('./'.implode($ctrl->arguments, '/'), X::mergeArrays($ctrl->data, $ctrl->post), true);
  $ctrl->obj = $controller->get();
  if ( !isset($ctrl->obj->url) ){
    $ctrl->obj->url = implode($ctrl->arguments, '/');
  }
}
*/
$ctrl->combo('<i class="nf nf-fa-bug"> </i> &nbsp; '._("Projects"), true);
$ctrl->obj->bcolor = '#000000';
$ctrl->obj->fcolor = '#FFFFFF';
$ctrl->obj->url = $ctrl->getPath();
