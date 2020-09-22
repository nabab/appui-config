<?php
/*
 * Describe what it does to show you're not that dumb!
 *
 **/
use bbn\x;

/** @var $ctrl \bbn\mvc\controller */

// Needed for the tabNav!!

/*
if ( $ctrl->get_url() === $ctrl->obj->url ){
  $ctrl->obj->current = $ctrl->get_dir().'/projects/ongoing';
}
$new = $ctrl->add('./new');
if ( $obj = $new->get() ){
	$ctrl->data['title'] = $obj->title;
  $ctrl->data['content'] = $obj->content;
  $ctrl->data['script'] = $obj->script;
  if ( !empty($obj->data) ){
    $ctrl->add_data($obj->data);
  }
}
*/

/*
if ( empty($ctrl->post['appui_baseURL']) ){
  $ctrl->combo('<i class="nf nf-fa-bug"> </i> &nbsp; '._("Projects"), true);
  $ctrl->obj->bcolor = '#000000';
  $ctrl->obj->fcolor = '#FFFFFF';
  $ctrl->obj->url = $ctrl->get_dir();
}
else if ( !empty($ctrl->arguments) ){
  $controller = $ctrl->add('./'.implode($ctrl->arguments, '/'), x::merge_arrays($ctrl->data, $ctrl->post), true);
  $ctrl->obj = $controller->get();
  if ( !isset($ctrl->obj->url) ){
    $ctrl->obj->url = implode($ctrl->arguments, '/');
  }
}
*/
$ctrl->combo('<i class="nf nf-fa-bug"> </i> &nbsp; '._("Projects"), true);
$ctrl->obj->bcolor = '#000000';
$ctrl->obj->fcolor = '#FFFFFF';
$ctrl->obj->url = $ctrl->get_path();
