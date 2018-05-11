var email_service = "http://localhost:8001/api/email";
var email_receiver = "bill.wu@autodesk.com";


/* Listen for messages */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  /* If the received message has the expected format... */
  if (msg.text && (msg.text == "report_back")) {
    sendResponse("Inject content_scripts success!");
  }
});

function check_table() {
  var e_table = $("table").last();
  var e_trs = e_table.find("tr");

  // Check the Saturday and Sunday.
  return check_td($(e_trs[6])) ||
         check_td($(e_trs[7]));
}

function check_td(e_tr) {
  var e_td = e_tr.find("td").last();
  var e_input = e_td.find("input");

  if (e_input.length > 0) { // "立即预约"
    // e_td.css({ "background-color": "red", "border": "2px solid red" });
    // e_input = e_input.first();
    // e_input.removeAttr("onclick");
    // e_input.click(); // TODO: disable the prompt dialog.
    send_email();
    return true;
  }
  else { // "名额已满"
    return false;
  }
}

function send_email() {
  var data = {
    to: [email_receiver],
    subject: document.title,
    html: $("table")[0].innerHTML + $("table")[1].innerHTML
  };

  $.ajaxSetup({
    contentType: "application/json; charset=utf-8"
  });

  $.post(email_service, JSON.stringify(data), function (response, status, xhr) {
    console.log(status);
    if (xhr.status == 200) {
      console.log("Email send success. Stop the interval");
      clearInterval(chkReadyState); // Stop the interval.
    }
  });
}

//
var chkReadyState = setInterval(function () {
  if (document.readyState == "complete") {
    if (check_table()) {
      // clearInterval(chkReadyState);
    }
    else {
      window.location.reload();
    }
  }
}, 60000); // 1 mins interval
