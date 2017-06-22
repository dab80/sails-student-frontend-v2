(function() {

  //function to delete record by settin id on form and then submitting the form
  //sets value of instructor id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=instructor_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getInstructor(record_id) {
    return $.get("http://localhost:1337/instructor/" + record_id, function(data) {
      console.log("got instructor");
    })
  }

  $(function() {

    //initialize variables for items in the DOM we will work with
    let manageInstructorForm = $("#manageInstructorForm");
    let addInstructorButton = $("#addInstructorButton");

    //-- Using the DataTables plugin to render the table on the page as a DataTable
    $('#instructorTable').DataTable({
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
      select: true,

      //-- make the column (target is 0 based) with the buttons wider
      columnDefs: [{
        width: '20%',
        targets: 6
      }]

    });

    $("#manageInstructorForm").validate({
      // Make the color of the error text red
      errorClass: "text-danger",
      rules: {
        // *    First Name - required, at least 2 characters
        first_name: {
          minlength: 2,
          maxlength: 30
        },
        // *    Last Name  - required, at least 2 characters
        last_name: {
          minlength: 2,
          maxlength: 30
        },
        major_id: {
          digits: true,
          maxlength: 11
        },
        years_of_experience: {
          digits: true,
          maxlength: 2
        },
        tenured: {
          digits: true,
          maxlength: 1
        }
      },
      messages: {
        first_name: {
          minLength: jQuery.validator.format("A maximux of {0} characters allowed"),
          maxlength: jQuery.validator.format("A maximux of {0} characters allowed")
        },
        last_name: {
          minLength: jQuery.validator.format("A maximux of {0} characters allowed"),
          maxlength: jQuery.validator.format("A maximux of {0} characters allowed")
        },
        major_id: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        },
        years_of_experience: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        },
        tenured: {
        digits: "Only 1 or 0 will be accepted!",
        maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        }
      }

    }); //-- end of $("#manageStudentForm").validate

    //add instructor button functionality
    addInstructorButton.click(function() {
      $("input").val("");
      manageInstructorForm.attr("action", "/create_instructor");
      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })

    $("#instructorTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("instructorid")
      manageInstructorForm.find("input[name=instructor_id]").val(recordId);
      manageInstructorForm.attr("action", "/update_instructor");
      let instructor = getInstructor(recordId);

      //populate form when api call is done (after we get instructor to edit)
      instructor.done(function(data) {
        $.each(data, function(name, val) {
          var $el = $('[name="' + name + '"]'),
            type = $el.attr('type');

          switch (type) {
            case 'checkbox':
              $el.attr('checked', 'checked');
              break;
            case 'radio':
              $el.filter('[value="' + val + '"]').attr('checked', 'checked');
              break;
            default:
              $el.val(val);
          }
        });
      })

      manageInstructorForm.dialog({
        title: "Edit Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })


    $("#instructorTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("instructorid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete Instructor": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
