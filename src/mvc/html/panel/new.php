<!-- HTML Document -->

<form action="<?= $root ?>/insert">
  <input type="hidden" name="ref" data-bind="value: ref">
  <div class="bbn-line-breaker bbn-task-form-container">

    <div class="bbn-form-full">
      <input name="title" class="bbn-textbox bbn-lg title" placeholder="Title/short description of the new task" required="required">
    </div>

    <div class="bbn-form-label">
      <?= _("Comment") ?><br>
      <select class="comment_type" data-role="dropdownlist" data-bind="events: {change: change_comment_type}">
        <option value="text"><?= _("Simple text") ?></option>
        <option value="html"><?= _("Rich text") ?></option>
        <option value="gfm"><?= _("Markdown") ?></option>
        <option value="php"><?= _("PHP code") ?></option>
        <option value="js"><?= _("JavaScript code") ?></option>
        <option value="css"><?= _("CSS code") ?></option>
      </select><br>
    </div>
    <div class="bbn-form-field">
      <textarea class="bbn-textbox" name="comment" style="width: 100%"></textarea>
    </div>

    <div class="bbn-form-label"><?= _("Category") ?></div>
    <div class="bbn-form-field">
      <input name="type" style="width: inherit" required="required">
    </div>

    <div class="bbn-form-label"><?= _("Priority") ?></div>
    <div class="bbn-form-field">
      <select data-role="dropdownlist">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5" selected>5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
      </select>
    </div>

    <div class="bbn-form-label"><?= _("Deadline") ?></div>
    <div class="bbn-form-field">
      <input type="date" data-role="datepicker">
    </div>

    <div class="bbn-form-label"><?= _("Files") ?></div>
    <div class="bbn-form-field">
      <div class="bbn-task-upload-wrapper bbn-task-files-container"> </div>
    </div>

    <div class="bbn-form-label"><?= _("Links") ?></div>
    <div class="bbn-form-field">
      <div class="bbn-widget k-upload bbn-header">
        <div class="k-dropzone">
          <input type="text" name="link" class="bbn-textbox" style="width: 100%" placeholder="<?= _("Type or paste your URL and press Enter to valid") ?>">
        </div>
        <table class="k-upload-files bbn-task-links-container">
        </table>
      </div>
    </div>

    <div class="bbn-form-full">
      <div class="bbn-block">
        <div class="bbn-header bbn-lg"><div><?= _("Roles") ?></div></div>
        <div class="bbn-content">
          <div class="bbn-block bbn-task-assigned">
            <div class="bbn-header"><?= _("Manager") ?></div>
            <div class="bbn-content bbn-task-managers">
              <input type="hidden" name="managers">
              <ul></ul>
            </div>
          </div>
          <div class="bbn-spacer"> </div>
          <div class="bbn-block bbn-task-assigned">
            <div class="bbn-header"><?= _("Worker") ?></div>
            <div class="bbn-content bbn-task-doers">
              <input type="hidden" name="doers">
              <ul></ul>
            </div>
          </div>
          <div class="bbn-spacer"> </div>
          <div class="bbn-block bbn-task-assigned">
            <div class="bbn-header"><?= _("Spectator") ?></div>
            <div class="bbn-content bbn-task-viewers">
              <input type="hidden" name="viewers">
              <ul></ul>
            </div>
          </div>
          <div class="bbn-form-full">
            <div class="bbn-task-usertree"></div>
            <div class="bbn-task-roles-desc container-placeholder bbn-lg">
              <i class="nf nf-fa-question_circle"> </i>
              <?= _("Drag and drop the users into the corresponding role block") ?>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bbn-form-label"> </div>
    <div class="bbn-form-field">
      <button class="k-button bbn-lg" data-bind="click: insert">
        <i class="nf nf-fa-save"> </i>
        <?= _("Create task") ?>
      </button>
    </div>

  </div>

</form>
