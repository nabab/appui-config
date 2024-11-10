<?php
/*
 * Describe what it does or get another gastro-enterite!
 *
 **/

/** @var bbn\Mvc\Controller $ctrl */

// cd ~/_lib/vendor/bbn/bbn-task/src
// find . -iname "*.php" | xargs xgettext
// msgfmt -o appui_task.mo appui_task.po
// Better:
// 1st time
// find ../../../mvc -iname "*.php" | xargs xgettext -d appui_task -p ./
// after with -j to j0oin with existing
// find ../../../mvc -iname "*.php" | xargs xgettext -d appui_task -j
// msgfmt -o appui_task.mo appui_task.po

$ctrl->data['root'] = $ctrl->getDir().'/';
return 1;