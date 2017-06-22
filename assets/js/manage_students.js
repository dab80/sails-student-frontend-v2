(function() {

  //function to delete record by settin id on form and then submitting the form
  //sets value of student id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=student_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudent(record_id) {
    return $.get("http://localhost:1337/student/" + record_id, function(data) {
      console.log("got student");
    })
  }

  $(function() {

    //initialize variables for items in the DOM we will work with
    let manageStudentForm = $("#manageStudentForm");
    let addStudentButton = $("#addStudentButton");

    //-- Using the DataTables plugin to render the table on the page as a DataTable
    $('#studentTable').DataTable({
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
        targets: 7
      }]

    });

    $("#manageStudentForm").validate({
      // Make the color of the error text red
      errorClass: "text-danger",
      rules: {
        // *    First Name - required, at least 2 characters
        first_name: {
          required: true,
          minlength: 2
        },
        // *    Last Name  - required, at least 2 characters
        last_name: {
          required: true,
          minlength: 2
        },
        // *	  start_date - make sure date is yyyy-mm-dd
        start_date: {
          required: true,
          // *	  ADD any other validation that makes you happy
          pattern: /^\d{4}-((0\d)|(1[012]))-(([012]\d)|3[01])$/
        },
        // *	  checking min/max values
        sat: {
          min: 400,
          max: 1400
        }
      },
      messages: {
        first_name: {
          required: "First name is required!",
          minlength: jQuery.validator.format("At least {0} characters required!")
        },
        last_name: {
          required: "First name is required!",
          minlength: jQuery.validator.format("At least {0} characters required!")
        },
        start_date: {
          // * 3. Use a custom message for one validation
          pattern: "Format must be yyyy-mm-dd"
        },
        sat: {
          min: "The minimum value is 400",
          max: "The maximum value is 1400"
        }
      }

    }); //-- end of $("#manageStudentForm").validate

    //-- changing the nav bar highlight
    // $(".nav a").on("click", function() {
    //   $(".nav").find(".active").removeClass("active");
    //   $(this).parent().addClass("active");
    // });
    // $(document).on('click', '.navbar-nav li', function(e) {
      // $(this).addClass('active').siblings().removeClass('active');
    // });

    $(".navbar-nav a").on("click", function(){
  $(".navbar-nav").find(".active").removeClass("active");
  $(this).parent().addClass("active");
});

    //add student button functionality
    addStudentButton.click(function() {
      $("input").val("");
      manageStudentForm.attr("action", "/create_student");
      manageStudentForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageStudentForm.submit()
          }
        }
      });
    }) //-- end of addStudentButton.click(function()

    $("#studentTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("studentid")
      manageStudentForm.find("input[name=student_id]").val(recordId);
      manageStudentForm.attr("action", "/update_student");
      let student = getStudent(recordId);

      //populate form when api call is done (after we get student to edit)
      student.done(function(data) {
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

      manageStudentForm.dialog({
        title: "Edit Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageStudentForm.submit()
          }
        }
      });
    }) //-- end of $("#studentTable").on("click", "#editButton"...


    $("#studentTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("studentid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete Student": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
