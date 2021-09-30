"use strict";

document.getElementById("rzpButton").onclick = function (e) {
  var emailTest = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  var name = document.getElementById("customerName").value;
  var email = document.getElementById("customerEmail").value;
  var amount = document.getElementById("donationAmount").value * 100;
  var formEmpty = name == "" || email == "" || amount == "";
  var emailValid = emailTest.test(email);

  if (formEmpty || !emailValid) {
    alert("Please fill out all the fields correctly.");
  } else {
    var choice = confirm("About to redirect to Razorpay payment page. Please acknowledge.");

    if (choice == true) {
      fetch("/newDonation", {
        method: "post",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "name": name,
          "email": email,
          "amount": amount
        })
      }).then(function (res) {
        return res.json();
      }).then(function (payUrl) {
        return {
          url: payUrl
        };
      }).then(function (donationResponse) {
        window.open(donationResponse.url, "_parent");
      })["catch"](function (error) {
        console.log("Failed");
        console.error(error);
      });
      e.preventDefault();
    }
  }
};