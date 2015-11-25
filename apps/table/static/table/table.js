$(document).ready(function() {
  //initialise DataTables plugin
  var main_table = $('#bw-table').DataTable( {
    //remove everything but the main table
    "paging": false,
    "info": false,
    "searching": true,
    "scrollCollapse": true,
    "fixedHeader": true,
    "sScrollY" : newTableHeight(),
    'sDom': '<#content-search>Ht',
    //only load entries the user can see
    "deferRender": true,
    //display message while loading
    "processing": true,
    //load json static file
    "ajax": {
      "url": ihecJson,
      "table": '#bw-table',
      "dataSrc": "dataset"
    },
    //associate json elements to columns(in order)
    "columnDefs": [ {
      "targets": 5,
      "data": function (row, type, val, meta) {
        return basename(val);
      }
    }],
    "columns": [
        //checkboxes
        {'searchable': false,
         'orderable': false,
         'className': 'dt-center',
         'width': 1,
         'render': function () {
           return '<input type="checkbox">';
         }
        },
        //data
        {"data": "assay"},
        {"data": "assay_category"},
        {"data": "cell_type"},
        {"data": "cell_type_category"},
        {"data": "releasing_group"},
        {"visible": false,
        'className': 'never',
        'data':"qcTrackInternalFilePath"},
        {"visible": false,
        'className': 'never',
        'data':"institution"},
        /*
        {//"visible": false,
         'render': function () {
           return data.releasing_group+' '+data.institution;
         }
        },*/
        //more info
        {
         'width': 1,
         'className': 'more-info dt-center',
         'searchable': false,
         'orderable': false,
         'render': function () {
          return '<span class="glyphicon glyphicon-triangle-top"></span>';
        }
      },
      ],
    //order on first data column
    'order': [[1, 'asc']],
    "fnInitComplete": function(oSettings, json) {
      updateShownCount();
      $('#galaxy-warning').modal('show');
    }
  } );

  //scripts for selection
  $('#select-all').on("click", function(e) {
    if (this.checked) {
      selectAll();
    } else {
      unselectAll();
    }
    updateSelectCount();
  });

  function selectAll(){
    $(':checkbox').prop('checked', true);
  }

  function unselectAll(){
    $(':checkbox').prop('checked', false);
  }

  $('#bw-table').on('click', 'input[type="checkbox"]', function(event){
      //important: must be before row expension
      event.stopPropagation();
      updateSelectCount();
    });

  function updateSelectCount(){
    var len = main_table.rows(':has(:checkbox:checked)').data().length;
    $('#select-count').text(len);
    if (len === 0) {
      $('#submit').addClass('disabled');
    } else {
      $('#submit').removeClass('disabled');
    }
  }

  function updateShownCount(){
    var len = main_table.rows( { filter: 'applied' } ).data().toArray().length;
    $('#shown-count').text(len);
  }

  //scripts for row expansion
  $('#bw-table').on("click", 'tbody tr', function() {
      //important: must be before row selection
      var tr = $(this);
      var row = main_table.row(tr);
      //toggle arrow icon
      tr.find('span:first').toggleClass('glyphicon-triangle-top glyphicon-triangle-bottom');
      if ( row.child.isShown() ) {
          // close row if open
          row.child.hide();
        } else {
          // open row if closed
          row.child(format(row.data()), 'child').show();
        }
      });


  //child table to generate on expension
  function format(data) {
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<tr>'+
              '<td>File Name:</td>'+
              '<td>'+basename(data.qcTrackInternalFilePath)+'</td>'+
          '</tr>'+
          '<tr>'+
              '<td>Institution:</td>'+
              '<td>'+data.institution+'</td>'+
          '</tr>'+
          '</table>';
  }

  function basename(path) {
    return path.replace(/\\/g,'/').replace( /.*\//, '' );
  }


  //scripts for search
  var old_column = "null";
  $('#column-select').on('change', function() {
    clearSearch(old_column);
    old_column = $(this).val();
  });

  //search bar filter
  $('#search-bar').on('change keyup copy', function() {
    var col_idx = $('#column-select').val();
    updateSearch(col_idx);
  });

  //column selectors
  column_selectors = ['#assay-select', '#assay-cat-select', '#cell-type-select', '#cell-type-cat-select', '#rel-group-select'];
  $('#assay-select').on('change', function() {
    updateSearch(1);
    //updateSelects(1);
  });
  $('#assay-cat-select').on('change', function() {
    updateSearch(2);
    //updateSelects(2);
  });
  $('#cell-type-select').on('change', function() {
    updateSearch(3);
    //updateSelects(3);
  });
  $('#cell-type-cat-select').on('change', function() {
    updateSearch(4);
    //updateSelects(4);
  });
  $('#rel-group-select').on('change', function() {
    updateSearch(5);
    //updateSelects(5);
  });
/*
  function updateSelects(col_idx) {
    for (var i = 1; i <= 5; ++i) {
      if (i != col_idx) {
        var unique_vals = main_table.column(i, { search:'applied' }).data().unique().sort();
        var k = 0;
        var options = $(column_selectors[i-1] + ' option');
        for (var j = 0; j < unique_vals.length;++j) {
          while(unique_vals[j] != $(options[k]).val()) {
            //$(options[k]).attr('disabled', 'disabled');
            $(options[k]).hide();
            ++k;
          }
          //$(options[k]).removeAttr('disabled');
          $(options[k]).show();
          ++k;
        }
        while(k < options.length) {
          //$(options[k]).attr('disabled', 'disabled');
          $(options[k]).hide();
          ++k;
        }
        $(column_selectors[i-1]).trigger("chosen:updated");
      }
    }
  }
*/
  //creates an "or" regex TODO: use join instead
  function orFilter(idx, list) {
    if (list !== null){
      filter = list[0];
      for (var i = 1; i < list.length; ++i) {
        filter += '|' + list[i];
      }
    } else {
      filter = "";
    }
    return filter;
  }

  function clearSearch(col_idx) {
    $('#search-bar').val('');
    updateSearch(col_idx);
  }

  RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  function updateSearch(col_idx) {
    if (col_idx === "null" || col_idx === null) {
      //if -1(any), search on all columns
      main_table.search($('#search-bar').val()).draw();
    } else {
      //otherwise search on specified column
      var filter = "";
      if (col_idx >= 1 && col_idx <= 5) {
        filter += "(?=" + orFilter(col_idx, $(column_selectors[col_idx-1]).val()) + ")";
      }
      var search_terms = $('#search-bar').val().split(' ');
      for (var i = 0; i < search_terms.length; ++i) {
        filter += "(?=.*" + RegExp.escape(search_terms[i]) + ")";
      }
      main_table.column(col_idx).search(filter, true, false).draw();
    }
    updateShownCount();
    //updateSelects(col_idx);
  }

  //handle scrolling
  $(window).bind('resize', function () {
    var new_height = newTableHeight();
    $('.dataTables_scroll:eq(2)').css('height', new_height);
    $('.dataTables_scrollBody:eq(2)').css('max-height', new_height);
    var table = $('#bw-table').dataTable();
    table.fnSettings().oScroll.sY = new_height;
    table.fnDraw();
  });

  function newTableHeight(){
    //adjust whenever layout is changed
    return $(document).height() - 260;
  }

  //handling the galaxy form
  $('#submit').on( "click", function () {
    var data = main_table.rows(':has(:checkbox:checked)').data();
    var text = "@\n";
    for (i = 0; i < data.length; i++) {
      text += data[i].qcTrackMd5 + "\n";
    }
    $("#datasets").val(text);
    $("#galaxy-form").submit();
  });

  //show selected
  $('#show-selected').on('click', function() {
    //clear any search
    clearSearch(old_column);
    //apply filter on checkbox:checked
    $.fn.dataTable.ext.search.push(function(settings, data, row_idx){
      tr = main_table.row(row_idx).nodes().to$();
      //document.write(tr.has('input:checkbox:checked').html());
      if (tr.has('input:checkbox:checked').length) {
        return true;
      } else {
        return false;
      }
    });
    main_table.draw();
    updateShownCount();
  });

  //show all
  $('#show-all').on('click', function() {
    //clear any search
    clearSearch(old_column);
    //apply filter on checkbox:checked
    $.fn.dataTable.ext.search.pop();
    main_table.draw();
    updateShownCount();
  });

  $(".chosen").chosen();

});
