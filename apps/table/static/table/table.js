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
         'className': 'more-info dt-center',
         'searchable': false,
         'orderable': false,
         'render': function () {
          return '<span class="glyphicon glyphicon-triangle-top"></span>';
        }
      },
      ],
    //order on first data column
    'order': [[1, 'asc']]
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
  var old_column = "-1";
  $('#column-select').on('change', function() {
    clearSearch(old_column);
    old_column = $(this).val();
  });

  $('#search-bar').on('keyup paste change', function() {
    updateSearch();
  });

  function clearSearch(colIdx) {
    $('#search-bar').val('');
    if (colIdx == "-1") {
      //if -1(any), clear table filter
      main_table.search('').draw();
    } else {
      //otherwise clear filter on old column
      main_table.column(colIdx).search('').draw();
    }
  }

  function updateSearch() {
    colIdx = $('#column-select').val();
    if (colIdx == "-1") {
      //if -1(any), search on all columns
      main_table.search($('#search-bar').val()).draw();
    } else {
      //otherwise search on specified column
      main_table.column(colIdx).search($('#search-bar').val()).draw();
    }
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
    return $(document).height() - 121;
  }

});
