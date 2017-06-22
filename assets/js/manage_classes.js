(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getClass(record_id){
    debugger;
    return $.get("http://localhost:1337/class/" + record_id, function(data){
      console.log("got class");
    })
  }

  $(function(){

    $(".nav a").on("click", function() {
      $(".nav").find(".active").removeClass("active");
      $(this).parent().addClass("active");
    });

    //initialize variables for items in the DOM we will work with
    let manageClassForm = $("#manageClassForm");
    let addClassButton = $("#addClassButton");

    //-- Using the DataTables plugin to render the table on the page as a DataTable
    $('#classTable').DataTable({
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

    $("#manageClassForm").validate({
    // Make the color of the error text red
      errorClass: "text-danger",
      rules: {
        instructor_id: {
          digits: true,
          maxlength: 10
        },
        subject: {
          minlength: 2,
          maxlength: 30
        },
        course: {
          digits: true,
          maxlength: 4
        }
      },
      messages: {
        instructor_id: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        },
        subject: {
          minLength: jQuery.validator.format("A maximux of {0} characters allowed"),
          maxlength: jQuery.validator.format("A maximux of {0} characters allowed")
        },
        course: {
          digits: "Only digits are permitted!",
          maxlength: jQuery.validator.format("A maximux of {0} digits allowed")
        }
      }

    });//-- end of $("#manageStudentForm").validate

    //add class button functionality
    addClassButton.click(function(){
      $("input").val("");
      manageClassForm.attr("action", "/create_class");
      manageClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageClassForm.submit()
          }
        }
      });
    })

  	$("#classTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("classid")
      manageClassForm.find("input[name=class_id]").val(recordId);
      manageClassForm.attr("action", "/update_class");
      let classes = getClass(recordId);

      //populate form when api call is done (after we get classes to edit)
      classes.done(function(data){
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

      manageClassForm.dialog({
        title: "Edit Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageClassForm.submit()
          }
        }
      });
    })


    $("#classTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("classid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
