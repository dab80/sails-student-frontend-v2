(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of assignment id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=assignment_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getAssignment(record_id){
    return $.get("http://localhost:1337/assignment/" + record_id, function(data){
      console.log("got assignment");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageAssignmentForm = $("#manageAssignmentForm");
    let addAssignmentButton = $("#addAssignmentButton");

    //-- Using the DataTables plugin to render the table on the page as a DataTable
    $('#assignmentTable').DataTable({
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

    $("#manageAssignmentForm").validate({
    // Make the color of the error text red
      errorClass: "text-danger",
      rules: {
        student_id: {
          digits: true,
          maxlength: 11
        },
        assignment_nbr: {
          digits: true,
          maxlength: 11
        },
        grade_id: {
          digits: true,
          maxlength: 11
        },
        class_id: {
          digits: true,
          maxlength: 11
        }
      },
      messages: {
        student_id: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        },
        assignment_nbr: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        },
        grade_id: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        },
        class_id: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        }
      }

    });//-- end of $("#manageStudentForm").validate

    //add assignment button functionality
    addAssignmentButton.click(function(){
      $("input").val("");
      manageAssignmentForm.attr("action", "/create_assignment");
      manageAssignmentForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageAssignmentForm.submit()
          }
        }
      });
    })

  	$("#assignmentTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("assignmentid")
      manageAssignmentForm.find("input[name=assignment_id]").val(recordId);
      manageAssignmentForm.attr("action", "/update_assignment");
      let assignment = getAssignment(recordId);

      //populate form when api call is done (after we get assignment to edit)
      assignment.done(function(data){
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

      manageAssignmentForm.dialog({
        title: "Edit Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageAssignmentForm.submit()
          }
        }
      });
    })


    $("#assignmentTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("assignmentid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Assignment": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
