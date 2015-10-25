$(document).ready(function() {
  //initialise DataTables plugin
  var main_table = $('#bw_table').DataTable( {
    //remove everything but the main table
    "paging": false,
    "info": false,
    "searching": true,
    "scrollCollapse": true,
    "fixedHeader": true,
    "sScrollY" : new_table_height(),
    'sDom': '<#content_search>Ht',
    //only load entries the user can see
    "deferRender": true,
    //display message while loading
    "processing": true,
    //load json static file
    "ajax": {
      "url": ihec_json,
      "table": '#bw_table',
      "dataSrc": "dataset"
    },
    //associate json elements to columns(in order)
    "columns": [
        //checkboxes
        {'searchable': false,
        'orderable': false,
        'className': 'dt-center',
        'width': 1,
        'render': function () {
         return '<input type="checkbox">';}
       },
        //data
        {"data": "assay"},
        {"data": "assay_category"},
        {"data": "cell_type"},
        {"data": "cell_type_category"},
        //more info
        {
         'width': 1,
         'className': 'more_info dt-center',
         'searchable': false,
         'orderable': false,
         'render': function () {
          return '<span class="glyphicon glyphicon-triangle-top"></span>'
        }
      },
      ],
    //order on first data column
    'order': [[1, 'asc']]
  } );


  //scripts for selection
  $('#select_all').on("click", function(e) {
    if (this.checked) {
      select_all();
    } else {
      unselect_all();
    }
    update_select_count()
  })

  function select_all(){
    $(':checkbox').prop('checked', true);
  }

  function unselect_all(){
    $(':checkbox').prop('checked', false);
  }

  $('#bw_table').on('click', 'input[type="checkbox"]', function(event){
      //important: must be before row expension
      event.stopPropagation();
      update_select_count();
    })

  function update_select_count(){
    var len = main_table.rows(':has(:checkbox:checked)').data().length;
    $('#select_count').text(len);
    if (len == 0) {
      $('#submit').addClass('disabled')
    } else {
      $('#submit').removeClass('disabled')
    }
  }

  //scripts for row expansion
  $('#bw_table').on("click", 'tbody tr', function() {
      //important: must be before row selection
      var tr = $(this)
      var row = main_table.row(tr)
      //toggle arrow icon
      tr.find('span:first').toggleClass('glyphicon-triangle-top glyphicon-triangle-bottom');
      if ( row.child.isShown() ) {
          // close row if open
          row.child.hide();
        } else {
          // open row if closed
          row.child(format(row.data()), 'child').show();
        }
      })


  //child table to generate on expension
  function format(data) {
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
          '<tr>'+
              '<td>name:</td>'+
              '<td>'+basename(data.qcTrackInternalFilePath)+'</td>'+
          '</tr>'+
          '<tr>'+
              '<td>institution:</td>'+
              '<td>'+data.releasing_group+' '+data.institution+'</td>'+
          '</tr>'+
          '</table>';
  }

  function basename(path) {
    return path.replace(/\\/g,'/').replace( /.*\//, '' );
  }


  //scripts for search
  var old_column = "-1"
  $('#column_select').on('change', function() {
    clear_search(old_column);
    old_column = $(this).val()
  })

  $('#search_bar').on('keyup paste change', function() {
    update_search();
  })

  function clear_search(col_idx) {
    $('#search_bar').val('');
    if (col_idx == "-1") {
      //if -1(any), clear table filter
      main_table.search('').draw();
    } else {
      //otherwise clear filter on old column
      main_table.column(col_idx).search('').draw();
    }
  }

  function update_search() {
    col_idx = $('#column_select').val();
    if (col_idx == "-1") {
      //if -1(any), search on all columns
      main_table.search($('#search_bar').val()).draw();
    } else {
      //otherwise search on specified column
      main_table.column(col_idx).search($('#search_bar').val()).draw();
    }
  }


  //scripts for submit button
  $('#submit').on('click', function() {
    alert('hello');
  })

  //handle scrolling
  $(window).bind('resize', function () {
    var NewHeight = new_table_height();
    $('.dataTables_scroll:eq(2)').css('height', NewHeight);
    $('.dataTables_scrollBody:eq(2)').css('max-height', NewHeight);
    var oTable = $('#bw_table').dataTable();
    oTable.fnSettings().oScroll.sY = NewHeight;
    oTable.fnDraw();
  });

  function new_table_height(){
    //adjust whenever layout is changed
    return $(document).height() - 121;
  }

})
