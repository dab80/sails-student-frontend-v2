(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student_class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=student_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudentClass(record_id){
    return $.get("http://localhost:1337/student_class/" + record_id, function(data){
      console.log("got student_class");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageStudentClassForm = $("#manageStudentClassForm");
    let addStudentClassButton = $("#addStudentClassButton");

    //-- Using the DataTables plugin to render the table on the page as a DataTable
    $('#student_classTable').DataTable({
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

    $("#manageStudentClassForm").validate({
    // Make the color of the error text red
      errorClass: "text-danger",
      rules: {
        student_id: {
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
        class_id: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        }
      }

    });//-- end of $("#manageStudentForm").validate

    //add student_class button functionality
    addStudentClassButton.click(function(){
      $("input").val("");
      manageStudentClassForm.attr("action", "/create_student_class");
      manageStudentClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })

  	$("#student_classTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("student_classid")
      manageStudentClassForm.find("input[name=student_class_id]").val(recordId);
      manageStudentClassForm.attr("action", "/update_student_class");
      let student_class = getStudentClass(recordId);

      //populate form when api call is done (after we get student_class to edit)
      student_class.done(function(data){
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

      manageStudentClassForm.dialog({
        title: "Edit Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })


    $("#student_classTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("student_classid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete StudentClass": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
