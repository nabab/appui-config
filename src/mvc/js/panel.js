// Javascript Document
//$(ele).closest(".bbn-content").css("padding", "0px");

// Main tabNav
var tabnav = $("#appui_task_tabnav").tabNav({
  baseTitle: 'Projects - ',
  baseURL: data.root + 'panel/',
  scrollable: false,
  autoload: true,
  list: [{
    url: "search",
    fixed: true,
    load: true,
    fcolor: '#000',
    bcolor: '#FFF',
    label: '<i class="nf nf-fa-home bbn-lg" title="' + data.lng.new_task_search+ '"> </i>'
  }]
});

// Populates the group array with the users for each as item
$.each(data.groups, function(i, v){
  data.groups[i].items = $.map($.grep(appui.users, function(user){
    return user.active && (user.id_group === v.id);
  }), function(user){
    user.id = user.value;
    return user;
  });
});

// All the following vars will be always accessible
bbn.fn.extend(bbn.tasks, {
  priority_colors: ['#F00', '#F40', '#F90', '#FC0', '#9B3', '#7A4', '#5A5', '#396', '#284', '#063'],
  // Translations
  lng: data.lng,
  // Tasks' categories tree
  categories: data.categories,
  // Tasks' states
  states: data.states,
  // Tasks' roles
  roles: data.roles,
  // The same 3, as text/value options
  options: data.options,
  // Function on the media links in the comments of the task main view
  download_media: function(id){
    if ( id ){
      this.postOut(data.root + 'download/media/' + id);
    }
  },
  // Form creating a new task
  formNew: function(v){
    bbn.fn.popup($("#tpl-task_form_new").html(), bbn.tasks.lng.new_task, 800, 250, function(cont){
      $("input[name=title]", cont).val(v);
      bbn.tasks.typeField(cont);
      $("form").attr("action", data.root + 'actions/task/insert').data("script", function(e, f){
        if ( e.success ){
          bbn.fn.closePopup();
          tabnav.tabNav("link", data.root + 'panel/tasks/' + e.success);
        }
        else{
          bbn.fn.error();
        }
      });
    })
  },
  // The special field for the type of task (tree inside a dropdown)
  typeField: function(container, info){
    var ddTree = $("input[name=type]", container).kendoDropDownTreeView({
      treeview: {
        select: function(e){
          var dt = e.sender.dataItem(e.node);
          if ( dt ){
            ddTree.element.val(dt.id).change();
          }
        },
        dataTextField: "text",
        dataValueField: "id",
        dataSource: new kendo.data.HierarchicalDataSource({
          data: bbn.tasks.categories,
          schema: {
            model: {
              id: "id",
              hasChildren: "is_parent",
              children: "items",
              fields: {
                text: {type: "string"},
                is_parent: {type: "bool"}
              }
            }
          }
        })
      }
    }).data("kendoDropDownTreeView");
    return ddTree;
  },
  // app is the function launched when opening a task, it manages the tabNav for each task and all the functions
  app: function(info, ele){
    if ( info.id ){
      var app = this,
          tabstrip = $("#appui_task" + info.id, ele),
          _init = function(info, ele){
            if ( info.notes ){
              $.each(info.notes, function(i, v){
                var m = new dayjs(v.creation);
                info.notes[i].since = m.fromNow();
              });
            }
            var obs = kendo.observable({
              creator: apst.userFull(info.id_user),
              creation: bbn.fn.fdate(info.creation_date),
              ref: (new dayjs()).unix(),
              has_deadline: function(){
                return this.get("deadline") ? true : false;
              },
              remove_deadline: function(){
                this.set("deadline", null);
                this.update("deadline", null);
              },
              has_comments: function(){
                return info.notes.length ? true : false;
              },
              is_manager: function(){
                var managers = this.roles.get("managers");
                if ( managers && ($.inArray(appui.user.id, managers) > -1) ){
                  return true;
                }
                return false;
              },
              is_worker: function(){
                var workers = this.roles.get("workers");
                if ( workers && ($.inArray(appui.user.id, workers) > -1) ){
                  return true;
                }
                return false;
              },
              is_viewer: function(){
                var viewers = this.roles.get("viewers");
                if ( viewers && ($.inArray(appui.user.id, viewers) > -1) ){
                  return true;
                }
                return false;
              },
              make_me_display: function(){
                return this.is_added() ? 'none' : 'inline-block';
              },
              make_me: function(e){
                var mvvm = this,
                    role = $(e.item).attr("data-task-role");
                if ( role && bbn.tasks.roles[role] ){
                  this.post(data.root + 'actions/role/insert', {id_task: info.id, role: bbn.tasks.roles[role], id_user: appui.user.id}, function(d){
                    if ( app.userUID ){
                      // @todo Do something to update the roles tab
                      app.tree.findByUid(app.userUID);
                    }
                    if ( !mvvm.roles[role] ){
                      mvvm.roles.set(role, []);
                    }
                    mvvm.roles[role].push(appui.user.id);
                    tabstrip.tabNav("enable", 1);
                  });
                }
              },
              unmake_me: function(e){
                var prop,
                		mvvm = this;
                if ( this.is_manager() ){
                  prop = "managers";
                }
                if ( this.is_viewer() ){
                  prop = "viewers";
                }
                if ( this.is_worker() ){
                  prop = "workers";
                }
                if ( prop ){
                  appui.confirm(bbn.tasks.lng.sure_to_unfollow, function(){
                    this.post(data.root + "actions/role/delete", {id_task: info.id, id_user: appui.user.id, role: bbn.tasks.roles[prop]}, function(d){
                      var idx = $.inArray(appui.user.id, mvvm.roles.get(prop))
                      if ( idx > -1 ){
                        mvvm.roles[prop].splice(idx, 1);
                        tabstrip.tabNav("disable", 1);
                      }
                    });
                  });
                }
              },
              is_added: function(){
                return this.is_manager() || this.is_worker() || this.is_viewer();
              },
              is_master: function(){
                if ( this.is_manager() ){
                  return true;
                }
                return appui.user.id === this.get("id_user");
              },
              can_change: function(){
                return !this.is_closed() && this.is_master();
              },
              statef: function(){
                return bbn.fn.getField(bbn.tasks.options.states, "text", "value", this.get("state"));
              },
              can_close: function(){
                if ( this.is_manager() && !this.is_closed() ){
                  return true;
                }
                return false;
              },
              close: function(){
                var mvvm = this;
                appui.confirm(bbn.tasks.lng.sure_to_close, function(){
                  this.post(data.root + "actions/task/update", {id_task: info.id, prop: "state", val: bbn.tasks.states.closed}, function(d){
                    if ( d.success ){
                      mvvm.set("state", bbn.tasks.states.closed);
                    }
                  });
                });
              },
              can_hold: function(){
                if ( ((this.get("state") === bbn.tasks.states.ongoing) || (this.get("state") === bbn.tasks.states.opened)) && (this.is_manager() || this.is_worker()) ){
                  return true;
                }
                return false;
              },
              hold: function(e){
                var mvvm = this;
                appui.confirm(bbn.tasks.lng.sure_to_hold, function(){
                  this.post(data.root + "actions/task/update", {id_task: info.id, prop: "state", val: bbn.tasks.states.holding}, function(d){
                    if ( d.success ){
                      mvvm.set("state", bbn.tasks.states.holding);
                    }
                  });
                })
              },
              can_resume: function(e){
                if ( (this.is_holding() || this.is_opened()) && (this.is_manager() || this.is_worker()) ){
                  return true;
                }
                return false;
              },
              resume: function(e){
                var mvvm = this;
                appui.confirm(bbn.tasks.lng.sure_to_resume, function(){
                  this.post(data.root + "actions/task/update", {id_task: info.id, prop: "state", val: bbn.tasks.states.ongoing}, function(d){
                    if ( d.success ){
                      mvvm.set("state", bbn.tasks.states.ongoing);
                    }
                  });
                })
              },
              is_holding: function(){
                return this.get("state") === bbn.tasks.states.holding;
              },
              is_closed: function(){
                return this.get("state") === bbn.tasks.states.closed;
              },
              is_opened: function(){
                return (this.get("state") === bbn.tasks.states.opened);
              },
              is_ongoing: function(){
                return (this.get("state") === bbn.tasks.states.ongoing);
              },
              is_opened_or_ongoing: function(){
                return this.is_ongoing() || this.is_opened();
              },
              is_active: function(){
                return !this.is_closed() && !this.is_holding();
              },
              is_holding_or_opened: function(){
                return this.is_holding() || this.is_opened();
              },
              can_assist: function(){
                return true;
              },
              can_ping: function(){
                return true;
              },
              add_code: function(){},
              add_link: function(){},
              add_comment: function(e){
                var ko = this,
                    v = {
                      id: ko.id,
                      title: $("input[name=comment_title]", ele).val() || '',
                      text: $("textarea[name=comment]", ele).val() || '',
                      ref: $("input[name=ref]", ele).val(),
                    };
                if ( !v.title && !v.text ){
                  appui.alert(bbn.tasks.lng.no_comment_text)
                }
                else{
                  this.post(data.root + 'actions/comment/insert', v, function(d){
                    if ( d.success && d.comment ){
                      d.comment.creation = new Date().getSQL(1);
                      var m = new dayjs(d.comment.creation);
                      d.comment.since = m.fromNow();
                      ko.notes.push(d.comment);
                      app.createUpload();
                      $("textarea[name=comment]", ele).data("kendoEditor").value('');
                      $("input[name=comment_title]", ele).val('').trigger("change").parent().parent().hide().prev().hide();
                    }
                    else{
                      appui.alert();
                    }
                  });
                }
              },
              hideCommentForm: function(){
                
              },
              preventEnter: function(e){
                if ( e.key === "Enter" ){
                  e.preventDefault();
                  e.stopPropagation();
                }
              },
              preventAll: function(e){
                if ( e.key !== "Tab" ){
                  e.preventDefault();
                  e.stopImmediatePropagation();
                }
              },
              types_roles: data.roles,
              change_role: function(){
                var role = $("input[name=role]", ele).data("kendoDropDownList").value();
                if ( role ){
                  bbn.fn.window(appui.plugins['appui-usergroup'] + "/picker", {picker: "#appui_pm_form_container input[name=id_user]"}, 350, 700);
                }
              },
              update: function(e, f){
                if ( f !== undefined ){
                  return app.update(e, f, info.id);
                }
                if ( e.sender ){
                  return app.update($(e.sender.element).attr("name"), e.sender.value(), info.id);
                }
                if ( e.target ){
                  return app.update($(e.target).attr("name"), $(e.target).val(), info.id);
                }
              }
            });
            for ( var n in info ){
              obs.set(n, info[n]);
            }
            return obs;
          };
      bbn.fn.extend(app, {
        mainInit: false,
        roleInit: false,
        logsInit: false,
        userUID: false,
        fileIconClass: function(file){
          if ( file.extension ){
            var ext = file.extension.substring(1),
                cls = "file-o";
            if ( ext === "pdf" ){
              return "file-pdf-o";
            }
            else if ( $.inArray(ext, ["xls", "xlsx", "csv", "ods"]) > -1 ){
              return "file-excel-o";
            }
            else if ( $.inArray(ext, ["rtf", "doc", "docx", "odt"]) > -1 ){
              return "file-word-o";
            }
            else if ( $.inArray(ext, ["svg", "gif", "png", "jpg", "jpeg"]) > -1 ){
              return "file-picture-o";
            }
            else if ( $.inArray(ext, ["zip", "gz", "rar", "7z", "bz2", "xz"]) > -1 ){
              return "file-archive-o";
            }
            return "file-o";
          }
          return false;
        },
        createUpload: function(files){
          var uploader = $('<input name="file" type="file"/>'),
              uploadedFiles = files ? files : [],
              uploadWrapper = $("div.bbn-task-upload-wrapper", ele);
          uploadWrapper.empty().append(uploader);
          uploader.kendoUpload({
            localization: {
              select: "Fichiers / Images"
            },
            async: {
              saveUrl: data.root + "upload/" + info.ref,
              removeUrl: data.root + "unupload/" + info.ref
            },
            template: function(e){
              var size,
                  unit;
              if ( e.size > 5000000 ){
                unit = 'Mb';
                size = Math.floor(e.size / 1024 / 1024).toString();
              }
              else if ( e.size > 1024 ){
                unit = 'Kb';
                size = Math.floor(e.size / 1024).toString();
              }
              else{
                unit = 'b';
                size = e.size;
              }
              if ( e.files && e.files[0] ){
                var st = '<div class="k-progress"><table><tbody><tr><td class="bbn-task-link-image">',
                    done = false;
                if ( e.files[0].imgs ){
                  $.each(e.files[0].imgs, function(i, v){
                    if ( v.h96 ){
                      st += '<img src="' + data.root + 'image/tmp/' + info.ref + v.h96 + '">';
                      done = 1;
                      return false;
                    }
                  });
                }
                if ( !done ){
                  st += '<i class="nf nf-fa-' + app.fileIconClass(e.files[0]) + '"> </i>';
                }
                st += '</td><td class="bbn-task-link-title">' + e.name + '</td>' +
                  '<td class="bbn-task-link-actions">' +
                  '<span class="k-upload-pct">' + kendo.toString(size, 'n0') + ' ' + unit + '</span>' +
                  '<button class="k-button k-button-bare k-upload-action" type="button">' +
                  '<span class="k-icon k-i-close k-delete" title="Supprimer"></span>' +
                  '</button>' +
                  '</td></tr></tbody></table></div>';
                return st;
              }
            },

            // @todo Voir la taille
            files: uploadedFiles,
            upload: function(e){
              if ( e.files && e.files[0] ){
                var idx = bbn.fn.search(uploadedFiles, "name", e.files[0].name);
                if ( idx > -1 ){
                  e.preventDefault();
                  uploadWrapper = $("div.bbn-task-upload-wrapper", ele);
                  bbn.fn.analyzeContent(uploadWrapper);
                  appui.alert(bbn.tasks.lng.file_exists);
                  return false;
                }
                else{
                  $(ele).bbn("redraw", true);
                }
              }
            },
            success: function(e){
              if ( e.response && e.response.files && e.files && e.response.success ){
                var file = uploader.val();
                if ( e.operation === 'upload' ){
                  $.each(e.response.files, function(i, f){
                    if ( f.size ){
                      uploadedFiles.push(f);
                    }
                  });
                }
                else if ( (e.operation === 'remove') ){
                  $.each(e.files, function(i, f){
                    if ( (idx = $.inArray(f.rawFile.name, uploadedFiles)) > -1 ){
                      uploadedFiles.splice(idx, 1);
                    }
                  });
                }
                app.createUpload(uploadedFiles);
              }
              else{
                appui.alert(bbn.tasks.lng.problem_file);
              }
            },
            error:function(e){
              appui.alert(bbn.tasks.lng.error_uploading)
            }
          });
          bbn.fn.analyzeContent(uploadWrapper);
        },
        mainView: function(){
          app.mainInit = true;
          var textarea = $("textarea", ele),
              cont_textarea = textarea.parent();
          textarea.kendoEditor({
            encoded: false,
            tools: [
              "formatting",
              "bold",
              "italic",
              "underline",
              "justifyLeft",
              "justifyCenter",
              "justifyRight",
              "insertUnorderedList",
              "insertOrderedList",
              "indent",
              "outdent",
              "createLink",
              "unlink"
            ]
          });
          var ddTree = bbn.tasks.typeField(ele, info);
          app.createUpload();
          $("input[name=link]", ele).keydown(function(e){
            if ( e.key === "Enter" ){
              e.preventDefault();
              var $input = $(this),
                  v = $input.val(),
                  $target = $("table.bbn-task-links-container", ele),
                  $li;
              if ( v.toLowerCase().indexOf("http") !== 0 ){
                v = "http://" + v;
              }
              $target.append(
                '<tr><td class="k-file k-file-progress">' +
                '<div class="k-progress">' +
                '<table><tr>' +
                '<td class="bbn-task-link-image"><i class="nf nf-fa-link"> </i></td>' +
                '<td class="bbn-task-link-title"><div><strong><a href="' + v + '">' + v + '</a></strong><br></div></td>' +
                '<td class="bbn-task-link-actions">' +
                '<span class="k-upload-pct"> </span>' +
                '<button type="button" class="k-button k-button-bare k-upload-action" style="display: inline-block;">' +
                '<span title="Supprimer" class="k-icon k-i-close k-delete"></span>' +
                '</button>' +
                '</tr></table>' +
                '</div>' +
                '</td></tr>'
              );
              bbn.fn.analyzeContent($target, 1);
              $input.val("");
              $li = $target.find("tr:last").parent().closest("tr");
              this.post(data.root + "link_preview", {url: v, ref: info.ref}, function(d){
                if ( d.res && d.res.realurl ){
                  $li.find("td.k-file").removeClass("k-file-progress").addClass("k-file-success");
                  if ( d.res.pictures ){
                    $.each(d.res.pictures, function(i, v){
                      if ( v.h96 ){
                        $li.find("td.bbn-task-link-image").html('<img src="pm/image/tmp/' + info.ref + '/' + v.h96 + '">');
                        return false;
                      }
                    });
                  }
                  var st = '<strong><a href="' + d.res.realurl + '">' +
                      ( d.res.title ? d.res.title : d.res.realurl ) +
                      '</a></strong><br>';
                  if ( d.res.desc ){
                    st += d.res.desc;
                  }
                  bbn.fn.insertContent(st, $li.find("td.bbn-task-link-title div"));
                }
                else{
                  $li.find("td.k-file").removeClass("k-file-progress").addClass("k-file-error");
                }
              });
            }
          });
          /*
          $("img.profile", ele).initial({
            width: 16,
            height: 16,
            name: "Thomas Nabet",
            charCount: 2,
            fontSize: 12,
            fontWeight: 600
          });
          */
        },
        rolesView: function(){
          app.roleInit = true;
          var $li,
              roles = {},
              tmp,
              types_roles = ['managers', 'viewers', 'workers'],
              treeDS = new kendo.data.HierarchicalDataSource({
                data: data.groups,
                schema: {
                  model: {
                    id: "id",
                    hasChildren: "is_parent",
                    children: "items",
                    fields: {
                      text: {type: "string"},
                      is_parent: {type: "bool"}
                    }
                  }
                }
              }),
              dragCfg = {
                helper: "clone",
                containment: $("div.appui_task_form_container", ele),
                scroll: false,
                start: function(e, ui){
                  var dataItem = app.roleTree.dataItem(e.target).toJSON();
                  if ( dataItem.is_parent && !dataItem.expanded ){
                    app.roleTree.expand(e.target);
                  }
                }
              };


          app.roleTree = $("div.bbn-task-usertree", ele).kendoTreeView({
            dataSource: treeDS,
            loadOnDemand: false,
            select: function (e) {
              if ( data.picker ){
                var r = this.dataItem(e.node);
                $(data.picker).val(r.id).trigger("change");
                bbn.fn.closePopup();
              }
            },
            template: function (e) {
              if ( e.item.is_parent ){
                return '<i class="nf nf-fa-users"> </i> ' + e.item.text;
              }
              return apst.userFull(e.item.id);
            }
          }).data("kendoTreeView");
          $li = $("li.k-item", app.roleTree.element);
          /*
          $("input:first", ele).keyup(function(){
            var v = $(this).val().toLowerCase();
            $li.filter(":hidden").show();
            if ( v.length ){
              $li.filter(function(){
                var txt = bbn.fn.removeAccents($(this).find("span:not(.k-icon):first").text().toLowerCase());
                return txt.indexOf(v) === -1;
              }).hide();
            }
            var data = treeDS.data();
            data.forEach(function(a){
              bbn.fn.log(a, this);
              a.filter({field: "text", operator: "contains", value: $(this).val()});
            })
            bbn.fn.log(treeDS, treeDS.data());
            treeDS.filter({field: "text", operator: "contains", value: $(this).val()});
            Porca putana!
          });
          */

          for ( var v in bbn.tasks.roles){
            if ( tmp = info.roles.get(v) ){
              roles[v] = tmp;
            }
          }
          $li.draggable(dragCfg).each(function(){
            var dataItem = app.roleTree.dataItem(this);
            if ( !dataItem.is_parent ){
              if ( dataItem.id === appui.user.id ){
                app.userUID = dataItem.uid;
              }
              for ( var n in roles ){
                if ( $.inArray(dataItem.id, roles[n]) > -1 ){
                  app.addUser(dataItem, $(".bbn-task-" + n, ele)[0], false);
                }
              }
            }
          });

          $("div.bbn-task-assigned", ele).droppable({
            accept: ".bbn-task-usertree li",
            hoverClass: "bbn-dropable-hover",
            activeClass: "bbn-dropable-active",
            drop: function(e, ui){
              var dataItem = app.roleTree.dataItem(ui.draggable),
                  $ele = this,
                  items = [];
              if ( dataItem.is_parent ){
                if ( dataItem.items && dataItem.items.length ){
                  items = dataItem.items;
                }
              }
              else{
                items.push(dataItem);
              }
              $.each(items, function(i, v){
                app.addUser(v, $ele, true);
              });
            }
          });
        },
        rolesView2: function(){
          var action = info.can_change() ? "enable" : "disable";
          if ( app.roleTree && app.roleTree.element ){
            var $li = $("li.k-item.ui-draggable", app.roleTree.element);
            $li.each(function(){
              $(this).draggable(action);
            })
          }
        },
        logsView: function(){
          app.logsInit = true;
          var tab = $("div.tab-logs", ele);
          tab.kendoGrid({
            dataSource: {
              sort: {
                field: "chrono",
                dir: "desc"
              },
              transport: {
                read: function(e){
                  this.post(data.root + 'panel/logs', {id_task: info.id}, function(d){
                    if ( d.data ){
                      return e.success(d.data);
                    }
                  })
                }
              },
              schema: {
                model: {
                  fields: {
                    id_user: {
                      type: "number"
                    },
                    date: {
                      type: "date"
                    },
                    action: {
                      type: "string"
                    }
                  }
                }
              }
            },
            autoBind: false,
            sortable: true,
            columns: [{
              title: " ",
              width: 38,
              attributes: {
                style: "padding: 1px"
              },
              sortable: false,
              template: function(e){
                return apst.userAvatarImg(e.id_user);
              }
            }, {
              title: bbn.tasks.lng.user,
              title: bbn.tasks.lng.user,
              field: "id_user",
              width: 150,
              template: function(e){
                return apst.userName(e.id_user);
              }
            }, {
              title: bbn.tasks.lng.date,
              field: "chrono",
              width: 150,
              template: function(e){
                return bbn.fn.fdate(e.chrono);
              }
            }, {
              title: bbn.tasks.lng.action,
              field: "action",
              encoded: false
            }]
          });
        },
        addUser: function(dataItem, cont, insert){
          var id = dataItem.get("id"),
              $cont = $(cont),
              $ul = $cont.find("ul"),
              $input = $cont.find("input"),
              prop = $input.attr("name"),
              $container = $cont.closest(".bbn-task-roles-container"),
              $ele = app.roleTree.findByUid(dataItem.get("uid"));
          if ( $ele.css("display") !== 'none' ){
            var v = info.roles.get(prop);
            if ( !v ){
              info.roles.set(prop, []);
              v = info.roles.get(prop);
            }
            if ( $.inArray(id, v) === -1 ){
              v.push(id);
              $input.val(JSON.stringify(info.roles[prop].toJSON()));
              if ( insert ){
                this.post(data.root + 'actions/role/insert', {id_task: info.id, role: prop, id_user: id}, function(d){
                  if ( !d.success ){
                    appui.alert();
                  }
                });
              }
            }
            $ul.append(
              $('<li class="k-item">' + $ele.html() + '</li>').mousedown(function(e){
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                return false;
              })
            );
            $ele.hide();
            if ( prop !== 'managers' ){
              var $closer = $('<i class="nf nf-fa-times bbn-p"/>');
              $ul.find("li.k-item:last span:last").append(
                '&nbsp;',
                $closer.click(function(){
                  if ( !info.can_change() ){
                    appui.alert(bbn.tasks.lng.no_role_permission);
                    return;
                  }
                  var idx = $.inArray(id, info.roles.get(prop));
                  bbn.fn.log("remove", idx, id, info.roles.get(prop), prop);
                  if ( (idx > -1) ){
                    this.post(data.root + 'actions/role/delete', {id_task: info.id, role: prop, id_user: id}, function(d){
                      if ( !d.success ){
                        appui.alert();
                      }
                      else{
                        $ele.show();
                        info.roles.get(prop).splice(idx, 1);
                        $input.val(JSON.stringify(info.roles.get(prop).toJSON()));
                        $closer.closest("li").remove();
                      }
                    });
                  }
                })
              );
            }
          }

        },
        update: function(prop, val){
          if ( prop === 'deadline' ){
            val = kendo.toString(val,"yyyy-MM-dd");
          }
          this.post(data.root + 'actions/task/update', {
            id_task: info.id,
            prop: prop,
            val: val
          }, function(d){
            if ( !d.success ){
              appui.alert();
            }
          })
        }
      });
      info = _init(info, ele);
      tabnav.tabNav("setColor", bbn.tasks.priority_colors[info.priority-1], "#FFF", tabstrip);
      if ( tabstrip.length ){
        tabstrip.tabNav({
          baseURL: "panel/",
          list: [{
            url: "main",
            title: '<i class="nf nf-fa-eye"> </i> &nbsp; ' + bbn.tasks.lng.global_view,
            content: $("#tpl-task_tab_main").html(),
            fixed: true,
            callonce: function(ele){
              return app.mainView();
            }
          }, {
            url: "people",
            title: '<i class="nf nf-fa-users"> </i> &nbsp; ' + bbn.tasks.lng.roles,
            content: $("#tpl-task_tab_roles").html(),
            fixed: true,
            callonce: function(ele){
              app.rolesView();
              return true;
            },
            callback: function(ele){
              return app.rolesView2();
            },
            disabled: !info.is_master()
          }, {
            url: "logs",
            title: '<i class="nf nf-fa-list"> </i> &nbsp; ' + bbn.tasks.lng.journal,
            content: '<div class="tab-logs bbn-overlay"></div>',
            fixed: true,
            callonce: function(ele){
              app.logsView();
              return true;
            },
            callback: function(ele){
              $("div.tab-logs", ele).data("kendoGrid").dataSource.read();
            }
          }]
        });
        kendo.bind(tabstrip, info);
      }
    }
  }
});
