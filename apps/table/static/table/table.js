$(document).ready(function() {
  $("#rel-select").val(release);
  var all_checkboxes;

  //define columns for each species
  var human_columns = [
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
    {"data": "assay", 'defaultContent': 'N/A'},
    {"data": "assay_category", 'defaultContent': 'N/A'},
    {"data": "cell_type", 'defaultContent': 'N/A'},
    {"data": "cell_type_category", 'defaultContent': 'N/A'},
    {"data": "publishing_group", 'defaultContent': 'N/A'},
    {"visible": false,
    'className': 'never',
    'data':"file_name", 'defaultContent': 'N/A'},
    {"visible": false,
    'className': 'never',
    'data':"publishing_group", 'defaultContent': 'N/A'},
    //more info
    {'width': 1,
     'className': 'more-info dt-center',
     'searchable': false,
     'orderable': false,
     'render': function () {
      //return '<span class="glyphicon glyphicon-triangle-top"></span>';
      return '<a class="more" href=#><i>more...</i></a>';
     }
    }
  ]

  var saccer_columns = [
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
    {"data": "assay", 'defaultContent': 'N/A'},
    {"data": "assay_category", 'defaultContent': 'N/A'},
    {"data": "cell_type", 'defaultContent': 'N/A'},
    {"data": "cell_type_category", 'defaultContent': 'N/A'},
    {"data": "publishing_group", 'defaultContent': 'N/A'},
    {"visible": false,
    'className': 'never',
    'data':"file_name", 'defaultContent': 'N/A'},
    {"visible": false,
    'className': 'never',
    'data':"publishing_group", 'defaultContent': 'N/A'},
    //more info
    {'width': 1,
    'className': 'more-info dt-center',
    'searchable': false,
    'orderable': false,
    'render': function () {
      //return '<span class="glyphicon glyphicon-triangle-top"></span>';
      return '<a class="more" href=#><i>more...</i></a>';
    }
    }
  ]

  //choose columns based on release
  var columns
  if (release == "sacCer3_GEO_2016-07") {
    columns = saccer_columns
  } else {
    columns = human_columns
  }

  //initialise DataTables plugin
  var main_table = $('#bw-table').DataTable( {
    //remove everything but the header and table
    "language": {
      "emptyTable": "Loading..."
    },
    'sDom': 'Ht',
    "info": false,
    "scrollY": newTableHeight(),
    "scroller": true,
    "scrollCollapse": true,
    //only load entries the user can see
    //"deferRender": true,
    "searching": true,
    //display message while loading
    "processing": true,
    //load json static file
    "ajax": {
      "url": jsonPath,
      "table": '#bw-table',
      "dataSrc": "datasets"
    },
    //associate json elements to columns(in order)
    "columns": columns,
    //order on first data column
    'order': [[1, 'asc']],
    "fnInitComplete": function(oSettings, json) {
      updateShownCount();
      $('#galaxy-warning').modal('show');
      all_checkboxes = $(':checkbox', main_table.rows({filter:'applied'}).nodes());
    }
  });

  $('#rel-select').on("change", function(e) {
    $("#release-form").submit();
  });

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
    if (main_table.page.info().recordsDisplay == main_table.page.info().recordsTotal) {
      all_checkboxes.prop('checked', true);
    } else {
      $(':checkbox', main_table.rows({filter:'applied'}).nodes()).prop('checked', true);
    }
  }

  function unselectAll(){
    if (main_table.page.info().recordsDisplay == main_table.page.info().recordsTotal) {
      all_checkboxes.prop('checked', false);
    } else {
      $(':checkbox', main_table.rows({filter:'applied'}).nodes()).prop('checked', false);
    }
  }

  $('#bw-table').on('click', 'input[type="checkbox"]', function(event){
      //important: must be before row click
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
    var len = main_table.page.info().recordsDisplay;
    $('#shown-count').text(len);
  }

  //scripts for row expansion
  $('#bw-table').on("click", '.more', function(event) {
    //important: must be before row click
    event.stopPropagation();
    var tr = $(this).closest('tr');
    var row = main_table.row(tr);
    //toggle arrow icon
    if ( row.child.isShown() ) {
      // close row if open
      row.child.hide();
    } else {
      // open row if closed
      row.child(format(row.data()), 'child').show();
    }
  });

  /* old script to expand when user clicks anywhere on row
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
  */

  //scripts for checkbox
  $('#bw-table').on("click", 'tbody tr', function() {
    var tr = $(this);
    var row = main_table.row(tr);
    var chkbx = tr.find('input[type=checkbox]');
    chkbx.click();
  });


  //child table to generate on expension
  function format(data) {
    if (release == "sacCer3_GEO_2016-07") {
      return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left: 50px;">'+
             '<tr>'+
                '<td>Treatment:</td>'+
                '<td>'+data.treatment+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Sample description:</td>'+
                '<td style="white-space: normal; max-width: 300px">'+data.sample_description+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Submission date:</td>'+
                '<td>'+data.release_date+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Quality:</td>'+
                '<td>'+data.quality+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>URL reference:</td>'+
                '<td>'+'<a href="'+data.url_reference+'" target="_blank">'+data.url_reference+'</a>'+'</td>'+
            '</tr>'+
            '</table>';
    } else {
      return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
             '<tr>'+
                '<td>File Name:</td>'+
                '<td>'+basename(data.file_name)+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Releasing Group:</td>'+
                '<td>'+data.releasing_group+'</td>'+
            '</tr>'+
            '</table>';
    }
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

  function clearAll() {
    clearSearch(old_column);
    clearSelectors();
  }

  function clearSearch(column_idx) {
    $('#search-bar').val('');
    search_content = '';
    handleSearchChange(column_idx);
  }

  function clearSelectors() {
    for (var i = 0; i < 5; ++i) {
      $(column_selectors[i] + 'options').val('');
    }
    handleSelectionChange(0);
  }

  //search bar filter
  /*
  $('#search-bar').on('change keyup copy', function() {
    var column_idx = $('#column-select').val();
    handleSearchChange(column_idx);
  });
  */
  var search_content = '';
  $('#search-bar').on('change keyup copy', function() {
    var column_idx = $('#column-select').val();
    search_content = $('#search-bar').val();
    handleSearchChange(column_idx);
    main_table.draw();
    updateShownCount();
  });

  function handleSearchChange(column_idx) {
    if (column_idx === "null" || column_idx === null) {
      //if -1(any), search on all columns
      main_table.search(search_content);
      handleSelectionChange(0);
    } else if (column_idx >= 1 && column_idx <= 5) {
      handleSelectionChange(column_idx);
    } else {
      applyFilter(getSearchRegex(i), i);
      handleSelectionChange(0);
    }
  }

  //column selectors
  column_selectors = ['#assay-select', '#assay-cat-select', '#cell-type-select', '#cell-type-cat-select', '#pub-group-select'];

  //handle column selectors
  $('#assay-select').on('change', function() {
    handleSelectionChange(1);
    main_table.draw();
    updateShownCount();
  });
  $('#assay-cat-select').on('change', function() {
    handleSelectionChange(2);
    main_table.draw();
    updateShownCount();
  });
  $('#cell-type-select').on('change', function() {
    handleSelectionChange(3);
    main_table.draw();
    updateShownCount();
  });
  $('#cell-type-cat-select').on('change', function() {
    handleSelectionChange(4);
    main_table.draw();
    updateShownCount();
  });
  $('#pub-group-select').on('change', function() {
    handleSelectionChange(5);
    main_table.draw();
    updateShownCount();
  });

  function handleSelectionChange(column_idx) {
    //apply new filter
    if (column_idx !== 0) {
        updateFilter(column_idx);
    }
    //for every column
    for (var i = 1; i <= 5; ++i) {
      //if not the column that changed
      if (i != column_idx) {
        //apply filter as only search bar
        if ($(column_selectors[i-1]).val() !== null) {
            applyFilter(getSearchRegex(i), i);
            updateSelectionOptions(i);
            updateFilter(i);
        } else {
            updateSelectionOptions(i);
        }
      }
    }
  }

  function updateSelectionOptions(column_idx) {
    var new_options = main_table.column(column_idx, { search:'applied' }).data().unique().sort();
    var all_options = $(column_selectors[column_idx-1] + ' option');
    var k = 0;
    for (var j = 0; j < new_options.length;++j) {
      while(new_options[j] != $(all_options[k]).val()) {
      $(all_options[k]).prop('disabled', true);
        ++k;
      }
        $(all_options[k]).prop('disabled', false);
        ++k;
    }
    while(k < all_options.length) {
      $(all_options[k]).prop('disabled', true);
      ++k;
    }
    $(column_selectors[column_idx-1]).select2({
      placeholder: $(column_selectors[column_idx-1]).attr('placeholder'),
      theme: "bootstrap"
    });
  }

  function getSearchRegex(column_idx) {
    var regex = '';
    if ($('#column-select').val() == column_idx) {
      var search_terms = search_content.split(' ');
      for (var i = 0; i < search_terms.length; ++i) {
        regex += "(?=.*" + search_terms[i] + ")";
      }
    }
    return regex;
  };

  function getSelectionRegex(column_idx) {
    var regex = '';
    var list = $(column_selectors[column_idx-1]).val();
    if (list !== null) {
      regex += list.join('$|^');
      regex = "(?=^" + regex + "$)";
    } else {
      regex = "(.*)"
    }
    return regex;
  }

  function getRegex(column_idx) {
    return getSelectionRegex(column_idx) + getSearchRegex(column_idx);
  }

  function applyFilter(regex, column_idx) {
    main_table.column(column_idx).search(regex, true, false);
  }

  function updateFilter(column_idx) {
    var regex = getRegex(column_idx);
    console.log(regex);
    main_table.column(column_idx).search(regex, true, false);
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
    return $(document).height() - 335;
  }

  //handling the galaxy form
  $('#submit').on( "click", function () {
    var data = main_table.rows(':has(:checkbox:checked)').data();
    var text = release + "\n";
    for (i = 0; i < data.length; i++) {
      text += data[i].id + "\n";
    }
    $("#datasets").val(text);
    var out_file_name = $('#out_file_name').val();
    if (out_file_name) {
      $("#out_title").val("GeEC_datasets_" + out_file_name);
    }
    $("#galaxy-form").submit();
  });

  $("#out_file_name").keyup(function(event){
    if(event.keyCode == 13){
        $("#submit").click();
    }
  });

  //show selected
  $('#show-selected').on('click', function() {
    toggleShowSelected();
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
    //clear any search
    clearAll();
    main_table.draw();
    updateShownCount();
  });

  //show all
  $('#show-all').on('click', function() {
    toggleShowSelected();
    //apply filter on checkbox:checked
    $.fn.dataTable.ext.search.pop();
    //clear any search
    clearAll();
    main_table.draw();
    updateShownCount();
  });

  function toggleShowSelected() {
    $('#show-selected').toggleClass('disabled');
    $('#show-all').toggleClass('disabled');
  }

  $(".select2").each(function() {
    $(this).select2({
      placeholder: $(this).attr('placeholder'),
      theme: "bootstrap"
    });
  });
});
