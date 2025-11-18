// Javascript Document
var ds = new kendo.data.TreeListDataSource({
      sort: [{
        field: "priority",
        dir: "asc"
      }],
      transport: {
        read: function(e){
          this.post(data.root + 'treelist', e.data ? e.data : {}, function(d){
            if ( d && d.tasks ){
              e.success(d.tasks);
            }
            else{
              e.error();
            }
          });
        }
      },
      schema: {
        model: {
          id: "id",
          parentId: "id_parent",
          fields: {
            id: {type: "number", nullable: false},
            id_parent: {type: "number", nullable: true},
            is_parent: {type: "boolean"},
            first: {type: "date"},
            last: {type: "date"},
            label: {type: "string"},
            priority: {type: "number"},
            state: {type: "string"},
            type: {type: "string"},
            id_user: {type: "string"},
          }
        }
      }
    }),
    gant_container = $("div.bbn-task-gantt", ele);

gant_container.kendoTreeList({
  pageable: {
    refresh: true
  },
  sortable: true,
  dataSource: ds,
  columnMenu: true,
  dataBound: function(e){
    e.sender.element.find("tbody tr").each(function(){
      var v = e.sender.dataItem(this);
      $(this).find("td:eq(1)").css({
        backgroundColor: bbn.tasks.priority_colors[v.priority-1],
        color: v.priority > 6 ? '#666' : '#EEE'
      })
    });
  },
  columns: [
    {
      field: "title",
      label: data.lng.title,
      expandable: true,
    }, {
      field: "priority",
      label: "!",
      attributes: {
        style: "text-align: center; font-weight: bold; border-top: 1px solid #FFF"
      },
      width: 60
    }, {
      field: "id_parent",
      hidden: true
    }, {
      field: "is_parent",
      hidden: true
    }, {
      field: "type",
      label: data.lng.type,
      width: 150
    }, {
      field: "num_notes",
      label: "#",
      width: 50
    }, {
      field: "state",
      label: data.lng.state,
      width: 120
    }, {
      field: "duration",
      label: data.lng.duration,
      width: 100,
      template: function(e){
        if ( !e.duration ){
          return data.lng.unknown;
        }
        if ( e.duration < 3600 ){
          return Math.round(e.duration/60) + ' mn';
        }
        if ( e.duration < (24*3600) ){
          return Math.round(e.duration/3600) + ' h';
        }
        return Math.round(e.duration/(24*3600)) + ' j';
      },
      hidden: true
    }, {
      field: "first",
      label: data.lng.start,
      width: 100,
      hidden: true,
      template: function(e){
        var t = bbn.date(e.first);
        return t.fromNow();
      }
    }, {
      field: "last",
      label: data.lng.last,
      width: 100,
      hidden: true,
      template: function(e){
        var t = bbn.date(e.last);
        return t.format("DD MMM YY");
      }
    }, {
      field: "target_date",
      label: data.lng.deadline,
      width: 100,
      template: function(e){
        var t = bbn.date(e.last);
        return t.format("DD MMM YY");
      }
    }, {
      field: "id",
      label: " ",
      width: 50,
      template: function(e){
        return '<a href="' + data.root + 'tasks/' + e.id + '" title="' + data.lng.see_task + '"><button class="k-button"><i class="nf nf-fa-eye"> </i></button></a>';
      }
    }
  ]
});
