// get pagination
function pagination(totalpages, currentpage) {
  var pagelist = "";
  if (totalpages > 1) {
    currentpage = parseInt(currentpage);
    pagelist += `<ul class="pagination justify-content-center">`;
    const prevClass = currentpage == 1 ? " disabled" : "";
    pagelist += `<li class="page-item${prevClass}"><a class="page-link" href="#" data-page="${
      currentpage - 1
    }">Previous</a></li>`;
    for (let p = 1; p <= totalpages; p++) {
      const activeClass = currentpage == p ? " active" : "";
      pagelist += `<li class="page-item${activeClass}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
    }
    const nextClass = currentpage == totalpages ? " disabled" : "";
    pagelist += `<li class="page-item${nextClass}"><a class="page-link" href="#" data-page="${
      currentpage + 1
    }">Next</a></li>`;
    pagelist += `</ul>`;
  }

  $("#pagination").html(pagelist);
}

// get item row
function getitemrow(item) {
  var itemRow = "";
  if (item) {
    const itemphoto = item.photo ? item.photo : "default.png";
    itemRow = `<tr>
          <td class="align-middle"><img src="uploads/${itemphoto}" class="img-thumbnail rounded float-left"></td>
          <td class="align-middle">${item.pname}</td>
          <td class="align-middle">${item.email}</td>
          <td class="align-middle">${item.phone}</td>
          <td class="align-middle">
            <a href="#" class="btn btn-success mr-3 profile" data-toggle="modal" data-target="#itemViewModal"
              title="Prfile" data-id="${item.id}"><i class="fa fa-address-card-o" aria-hidden="true"></i></a>
            <a href="#" class="btn btn-warning mr-3 edititem" data-toggle="modal" data-target="#itemModal"
              title="Edit" data-id="${item.id}"><i class="fa fa-pencil-square-o fa-lg"></i></a>
            <a href="#" class="btn btn-danger deleteitem" data-itemid="14" title="Delete" data-id="${item.id}"><i
                class="fa fa-trash-o fa-lg"></i></a>
          </td>
        </tr>`;
  }
  return itemRow;
}
// get itens list
function getitens() {
  var pageno = $("#currentpage").val();
  $.ajax({
    url: "/phpcrudajax/ajax.php",
    type: "GET",
    dataType: "json",
    data: { page: pageno, action: "getitems" },
    beforeSend: function () {
      $("#overlay").fadeIn();
    },
    success: function (rows) {
      console.log(rows);
      if (rows.itens) {
        var itenslist = "";
        $.each(rows.itens, function (index, item) {
          itenslist += getitemrow(item);
        });
        $("#itemstable tbody").html(itenslist);
        let totalitens = rows.count;
        let totalpages = Math.ceil(parseInt(totalitens) / 4);
        const currentpage = $("#currentpage").val();
        pagination(totalpages, currentpage);
        $("#overlay").fadeOut();
      }
    },
    error: function () {
      console.log("something went wrong");
    },
  });
}

$(document).ready(function () {
  // add/edit item
  $(document).on("submit", "#addform", function (event) {
    event.preventDefault();
    var alertmsg =
      $("#itemid").val().length > 0
        ? "item has been updated Successfully!"
        : "New item has been added Successfully!";
    $.ajax({
      url: "/phpcrudajax/ajax.php",
      type: "POST",
      dataType: "json",
      data: new FormData(this),
      processData: false,
      contentType: false,
      beforeSend: function () {
        $("#overlay").fadeIn();
      },
      success: function (response) {
        console.log(response);
        if (response) {
          $("#itemModal").modal("hide");
          $("#addform")[0].reset();
          $(".message").html(alertmsg).fadeIn().delay(3000).fadeOut();
          getitens();
          $("#overlay").fadeOut();
        }
      },
      error: function () {
        console.log("Oops! Something went wrong!");
      },
    });
  });
  // pagination
  $(document).on("click", "ul.pagination li a", function (e) {
    e.preventDefault();
    var $this = $(this);
    const pagenum = $this.data("page");
    $("#currentpage").val(pagenum);
    getitens();
    $this.parent().siblings().removeClass("active");
    $this.parent().addClass("active");
  });
  // form reset on new button
  $("#addnewbtn").on("click", function () {
    $("#addform")[0].reset();
    $("#itemid").val("");
  });
  //  get item

  $(document).on("click", "a.edititem", function () {
    var pid = $(this).data("id");

    $.ajax({
      url: "/phpcrudajax/ajax.php",
      type: "GET",
      dataType: "json",
      data: { id: pid, action: "getitem" },
      beforeSend: function () {
        $("#overlay").fadeIn();
      },
      success: function (item) {
        if (item) {
          $("#itemname").val(item.pname);
          $("#email").val(item.email);
          $("#phone").val(item.phone);
          $("#itemid").val(item.id);
        }
        $("#overlay").fadeOut();
      },
      error: function () {
        console.log("something went wrong");
      },
    });
  });

  // delete item
  $(document).on("click", "a.deleteitem", function (e) {
    e.preventDefault();
    var pid = $(this).data("id");
    if (confirm("Are you sure want to delete this?")) {
      $.ajax({
        url: "/phpcrudajax/ajax.php",
        type: "GET",
        dataType: "json",
        data: { id: pid, action: "deleteitem" },
        beforeSend: function () {
          $("#overlay").fadeIn();
        },
        success: function (res) {
          if (res.deleted == 1) {
            $(".message")
              .html("item has been deleted successfully!")
              .fadeIn()
              .delay(3000)
              .fadeOut();
            getitens();
            $("#overlay").fadeOut();
          }
        },
        error: function () {
          console.log("something went wrong");
        },
      });
    }
  });
  // get profile

  $(document).on("click", "a.profile", function () {
    var pid = $(this).data("id");
    $.ajax({
      url: "/phpcrudajax/ajax.php",
      type: "GET",
      dataType: "json",
      data: { id: pid, action: "getitem" },
      success: function (item) {
        if (item) {
          const itemphoto = item.photo ? item.photo : "default.png";
          const profile = `<div class="row">
                <div class="col-sm-6 col-md-4">
                  <img src="uploads/${itemphoto}" class="rounded responsive" />
                </div>
                <div class="col-sm-6 col-md-8">
                  <h4 class="text-primary">${item.pname}</h4>
                  <p class="text-secondary">
                    <i class="fa fa-envelope-o" aria-hidden="true"></i> ${item.email}
                    <br />
                    <i class="fa fa-phone" aria-hidden="true"></i> ${item.phone}
                  </p>
                </div>
              </div>`;
          $("#profile").html(profile);
        }
      },
      error: function () {
        console.log("something went wrong");
      },
    });
  });

  // searching
  $("#searchinput").on("keyup", function () {
    const searchText = $(this).val();
    if (searchText.length > 1) {
      $.ajax({
        url: "/phpcrudajax/ajax.php",
        type: "GET",
        dataType: "json",
        data: { searchQuery: searchText, action: "search" },
        success: function (itens) {
          if (itens) {
            var itenslist = "";
            $.each(itens, function (index, item) {
              itenslist += getitemrow(item);
            });
            $("#itemstable tbody").html(itenslist);
            $("#pagination").hide();
          }
        },
        error: function () {
          console.log("something went wrong");
        },
      });
    } else {
      getitens();
      $("#pagination").show();
    }
  });
  // load itens
  getitens();
});
