<!-- HTML Document -->

<div class="bbn-task-splitter bbn-overlay">
  <div class="bbn-task-ntainer">
    <div class="bbn-form-full bbn-c bbn-flex-width">
      <div class="bbn-block" style="margin: 0 2em">
        <select name="selection" class="bbn-xl" data-role="dropdownlist" data-bind="events: {change: change_selection}">
          <option value="user"><?= _("Mine") ?></option>
          <option value="group"><?= _("My groups'") ?></option>
          <option value="all"><?= _("All") ?></option>
        </select>
      </div>
      <div class="bbn-flex-fill">
        <input name="title" class="bbn-xl k-bn-w-100" placeholder="<?= _("Search or Title for the new task") ?>">
      </div>
      <div class="bbn-block" style="margin: 0 2em">
        <button class="k-n-xl" data-bind="click: create_task">
          <i class="nf nf-fa-flag_checkered"> </i> <?= _("Create a task") ?>
        </button>
      </div>
    </div>
  </div>
  <div class="bbn-task-ontainer">
    <div class="bbn-task--h-100" style=""></div>
  </div>
</div>
