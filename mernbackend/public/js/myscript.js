document.getElementById("rzpButton").onclick = function(e) {
    const emailTest = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const name = document.getElementById("customerName").value;
    const email = document.getElementById("customerEmail").value;
   
    const amount = (document.getElementById("donationAmount").value)*100;
    const formEmpty = (name == "") || (email == "") || (amount == "");
    
    const emailValid = emailTest.test(email);
    if(formEmpty  || !emailValid) {
        alert("Please fill out all the fields correctly.");
    } else {
        const choice = confirm("About to redirect to Razorpay payment page. Please acknowledge.");
        if(choice == true) {
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
             })
            .then(res => res.json())
            .then(payUrl => ({ url: payUrl }))
            .then(donationResponse => { window.open(donationResponse.url, "_parent"); })
            .catch(error => {
                console.log("Failed");
                console.error(error);
            });
            e.preventDefault();
        }
    }
};