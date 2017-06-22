(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of major_class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=major_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getMajorClass(record_id){
    return $.get("http://localhost:1337/major_class/" + record_id, function(data){
      console.log("got major_class");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageMajorClassForm = $("#manageMajorClassForm");
    let addMajorClassButton = $("#addMajorClassButton");

    //-- Using the DataTables plugin to render the table on the page as a DataTable
    $('#major_classTable').DataTable({
      dom: 'Bfrtip',

      //-- Using the buttons extention to enable the copy, csv, excel, pdf, and print
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],

      //-- Using the colReorder Plugin to add the ability to reorder columns
      colReorder: true,

      //-- Allowing the table to scroll horizontal, if needed
      scrollX: true,

      //-- Allowing the row to be selected
      select: true
    });

    $("#manageMajorClassForm").validate({
    // Make the color of the error text red
      errorClass: "text-danger",
      rules: {
        major_id: {
          digits: true,
          maxlength: 11
        },
        class_id: {
          digits: true,
          maxlength: 11
        }
      },
      messages: {
        major_id: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        },
        class_id: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        }
      }

    });//-- end of $("#manageStudentForm").validate

    //add major_class button functionality
    addMajorClassButton.click(function(){
      $("input").val("");
      manageMajorClassForm.attr("action", "/create_major_class");
      manageMajorClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })

  	$("#major_classTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("major_classid")
      manageMajorClassForm.find("input[name=major_class_id]").val(recordId);
      manageMajorClassForm.attr("action", "/update_major_class");
      let major_class = getMajorClass(recordId);

      //populate form when api call is done (after we get major_class to edit)
      major_class.done(function(data){
        $.each(data, function(name, val){
            var $el = $('[name="'+name+'"]'),
                type = $el.attr('type');

            switch(type){
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val);
            }
        });
      })

      manageMajorClassForm.dialog({
        title: "Edit Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })


    $("#major_classTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("major_classid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete MajorClass": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
