(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of grade id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=grade_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getGrade(record_id){
    return $.get("http://localhost:1337/grade/" + record_id, function(data){
      console.log("got grade");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageGradeForm = $("#manageGradeForm");
    let addGradeButton = $("#addGradeButton");

    //-- Using the DataTables plugin to render the table on the page as a DataTable
    $('#gradeTable').DataTable({
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

    $("#manageGradeForm").validate({
    // * 4. Make the color of the error text red
      errorClass: "text-danger",
      rules: {
        // *    First Name - required, at least 2 characters
        grade: {
          maxlength: 30
        }
      },
      messages: {
        grade: {
          maxlength: jQuery.validator.format("A maximux of {0} characters allowed")
        }
      }

    });//-- end of $("#manageStudentForm").validate

    //add grade button functionality
    addGradeButton.click(function(){
      $("input").val("");
      manageGradeForm.attr("action", "/create_grade");
      manageGradeForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageGradeForm.submit()
          }
        }
      });
    })

  	$("#gradeTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("gradeid")
      manageGradeForm.find("input[name=grade_id]").val(recordId);
      manageGradeForm.attr("action", "/update_grade");
      let grade = getGrade(recordId);

      //populate form when api call is done (after we get grade to edit)
      grade.done(function(data){
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

      manageGradeForm.dialog({
        title: "Edit Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageGradeForm.submit()
          }
        }
      });
    })


    $("#gradeTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("gradeid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Grade": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
