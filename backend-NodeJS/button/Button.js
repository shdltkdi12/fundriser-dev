var donation = {
  amount: 0.0,
  fee: 0.0,
  total : 0.0,
  card: {},
  tribute: {},
  tributeEmail: null,
  comment: "",
  email: null,
  isFeeCovered: false,
  isRecurring: false,
  campaignID: "",
  payment_method: "credit card", //by default
};
var donor = {
  firstName: '', 
  lastName: '',
  fullname: '',
  email : ''
}
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
donation.campaignID = getParameterByName('campaignID');

var reach;
//For testing change this to the desired page name and
//click the other tab
//Default is #money
//var str = "#custom";
var str = "#money";
var x = $(window).width() - 400;


function changePage(oldPage, newPage, back) {
  if (back) {
    $(oldPage).hide(
      "slide",
      { easing: "easeInQuart", direction: "right" },
      700,
      function () {
        $(newPage).show(
          "slide",
          { easing: "easeOutQuart", direction: "left" },
          700
        );
      }
    );
  } else {
    $(oldPage).hide(
      "slide",
      { easing: "easeInQuart", direction: "left" },
      700,
      function () {
        $(newPage).show(
          "slide",
          { easing: "easeOutQuart", direction: "right" },
          700
        );
      }
    );
  }
}

/*
  Button Page
*/

if ($("#monthly").prop('checked')) {
  $('.heart').addClass("is-active");
}
$('#myModal').css("display", "block")

/* Modal */
$(".close").on("click", function(){
  var close = confirm("Are you sure you wish to leave?")
  if(close){
    $('#myModal').css("display", "none")
  }
});


/*
  Donation Page
*/
$('#money #customDonation').on('click', function () {
  $("input[name=amount]").prop('checked', false)
});

$('#money #donAmount').on('change', function () {
  $("input[name=custom-amount]", "#customDonation").val("")
});

$('#money #customDonation').on('click', function () {
  $("input[name=amount]").prop('checked', false)
});

$('#money #frequency').on('change', function () {
  $('.heart').toggleClass("is-active");
  if ($("#monthly").prop('checked')) {
    $('#money .next').text('Donate Monthly')
  } else {
    $('#money .next').text('Donate')
  }
});

$('#money .heart').on('click', function () {
  $(this).addClass("is-active");
  $('#money .next').text('Donate Monthly')
  $("#monthly").prop('checked', true)
});



$('#money #memory').on("click", function () {
  if (!$.trim($("#message").val())) {
    $("#message").val('')
  }
  changePage('#money', '#tribute', false);
});

$('#money #comments').on("click", function () {
  changePage('#money', '#comment', false);
});

$('#money .next').on("click", function () {
  donation.amount = $("input[name=amount]:checked").val()
  if (donation.amount == undefined) {
    donation.amount = $("input[name=custom-amount]", "#customDonation").val();
  }
  if (donation.amount != "" || donation.amount > 0) {
    if($("input[name=freq]:checked").val() == "monthly") {
      donation.isRecurring = true;
    }
    donation.amount = parseFloat(donation.amount).toFixed(2)
    donation.fee = donation.amount * .06
    donation.total = (parseFloat(donation.amount) + donation.fee).toFixed(2)
    $("#paymentoptions .amount").text("$" + donation.amount + " USD")
    $("#paymentoptions .fee").text("$" + donation.fee.toFixed(2))
    $("#paymentoptions .total").text("$" + donation.total)
    changePage('#money', '#paymentoptions', false);
    
  } else {
    alert("Invalid Donation Amount")
  }
});

$("#money .back").on("click", function () {
  $('#money').hide(
    "slide",
    { easing: "easeInQuart", direction: "down" },
    700,
    function () {
      $('.donate').show(
        "slide",
        { easing: "easeOutQuart", direction: "up" },
        700
      );
    }
  );
});

/*
  Payment Options Page
*/
$("#paymentoptions .back").on("click", function () {
  changePage("#paymentoptions", "#money", true);
});

$("#paymentoptions .credit").on("click", function () {
  donation.isFeeCovered = $("#paymentoptions input[type=checkbox]").is(":checked");
  if(donation.isFeeCovered){
    $("#confirm .amount").text("$" + donation.total);
    $("#check .amount").text("$" + donation.total);
  }else{
    $("#confirm .amount").text("$" + donation.amount);
    $("#check .amount").text("$" + donation.amount);
  }

  if(donation.isRecurring){
    $("#confirm .amount").append("/month");
    $("#check .amount").append("/month");
  }
  changePage("#paymentoptions", "#card", false);
});

$("#paymentoptions input[type=checkbox]").on("click", function () {
  if ($("#paymentoptions input[type=checkbox]").is(":checked")) {
    $("#paymentoptions #processingfee").css("visibility", "")
  } else {
    $("#paymentoptions #processingfee").css("visibility", "hidden")
  }
});


/*
  Customer Details Page
*/
$("#details .next").on("click", function () {
  //Gets the donor information
  donor = {
    firstName: $("input[name=first-name], #clearfix").val(), 
    lastName: $("input[name=last-name], #clearfix").val(),
    email : $("input[name=email], #clearfix").val(),
  };
  donor.fullname = donor.firstName + ' ' +donor.lastName;
  if (donor.firstName != '' && donor.lastName != '' && 
    donation.email != "") {
      ///
      
      ///
      $("#details").hide(
        "slide",
        { easing: "easeInQuart", direction: "left" },
        700,
        function () {
          $(".processing").fadeIn(1500, function () {
            $(".progress").animate(
              { width: "14em" },
              3500,
              "easeInOutCirc",
              function () {
                $(".mask").hide(
                  "slide",
                  { easing: "easeInQuart", direction: "right" },
                  400
                );
              }
            );
          });
        }
      );
      // ajax request to pass data
      $.ajax({
        url:"/users/savedonation",
        method: "post",
        data: {
          donation: JSON.stringify(donation),
          donor: JSON.stringify(donor),
        },
        success: function(res) {
        }
      });
      setTimeout(function () {
        $(".processing .message, .outer").fadeOut();
        $("#confirm").addClass("animated fadeInUp");
      }, 6250);
      
  } else {
    alert("Please fill out all fields before continuing!")
  }
});

$("#details .back").on("click", function () {
  changePage("#details", '#paymentoptions', true);
});


/*
  Card Information Page
*/
$("#card .next").on("click", function () {
  donation.card = {
    cardNumber: $("input[name=card-number], #clearfix").val(),
    expirationDate: $("input[name=expiration-date], #clearfix").val(),
    cvv: $("input[name=cvv], #clearfix").val(),
  };
  //Need to later revist this with a credit card validator maybe
  if (donation.card.cardNumber != "" && donation.expirationDate != "" &&
    cvv != "") {
    changePage("#card", "#check", false);
  }
  // else if (donation.card.cardNumber.length < 12) {
  //   alert("Invalid Card Number")
  // }
  // else if (donation.card.cvv.length < 3) {
  //   alert("Invalid Security Code")
  // }
  else {
    alert("Please fill out all fields before continuing!")
  }
});

$("#card .back").on("click", function () {
  changePage("#card", "#paymentoptions", true)
});


/*
  Tribute Page
*/

$("#tribute .next").on("click", function () {
  donation.tribute = {
    typeDon: $("input[name=type]:checked, #clearfix").val(),
    tributee: $("input[name=tributee], #clearfix").val(),
    name: $("input[name=name], #clearfix").val(),
    message: $("textarea[name=message], #clearfix").val(),
    hide: $('#hide').is(':checked')
  };
  if (donation.tribute.tributee != "" &&
    donation.tribute.name != "" &&
    donation.tribute.message != ""
  ) {
    changePage("#tribute", "#shareTribute", false);
    $('#memory').html(donation.tribute.typeDon + ": <u>" + donation.tribute.tributee + "</u>")
  } else {
    alert("Please fill out all fields before continuing!")
  }

});

$("#tribute .back").on("click", function () {
  changePage("#tribute", "#money", true);
});


/*
  Share Tribute Page
*/
$("#shareTribute .email").on("click", function () {
  changePage("#shareTribute", "#emailTribute", false);
});

$("#shareTribute .noEmail").on("click", function () {
  donation.tributeEmail = null;

  changePage("#shareTribute", "#money", false);
});

$("#shareTribute .back").on("click", function () {
  changePage("#shareTribute", "#tribute", true);
});

$("#shareTribute .email").on("click", function () {
  changePage("#shareTribute", "#emailTribute", false);

});


/*
  Email Tribute Page
*/
$("#emailTribute .next").on("click", function () {
  donation.tributeEmail = {
    nameF: $("input[name=tribute-nameF], #clearfix").val(),
    nameL: $("input[name=tribute-nameL], #clearfix").val(),
    email: $("input[name=tribute-email], #clearfix").val(),
  };
  if (donation.tributeEmail.nameF != "" &&
    donation.tributeEmail.nameL != "" &&
    donation.tributeEmail.email != "") {
    changePage("#emailTribute", "#money", false);
  } else {
    alert("Please fill out all fields before continuing!")
  }
});

$("#emailTribute .back").on("click", function () {
  changePage("#emailTribute", "#shareTribute", true);
});


/*
  Comment Page
*/
$("#comment .next").on("click", function () {
  donation.comment = $("textarea[name=comments], #clearfix").val();
  if (donation.comment != "") {
    $('#comments').html("Comment: <u>" + donation.comment + "</u>")
    changePage("#comment", "#money", false);
  } else {
    alert("Please fill out all fields before continuing!")
  }
});

$("#comment .back").on("click", function () {
  changePage("#comment", "#money", true);
});


/*
  Review Page
*/

$("#check .back").on("click", function () {
  changePage("#check", "#money", true);
});

$("#check .next").on("click", function () {
  changePage("#check", "#details", false);
});



  /*
    Confirmation Page
  */
 $("#confirm .next").on("click", function () {
  $(".processing").hide(
    "slide",
    { easing: "easeInQuart", direction: "right" },
    700
  );
  $("#confirm").removeClass("animated fadeInUp");
  changePage("#confirm", "#receipt", false);
  
});


