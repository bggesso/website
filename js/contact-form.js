jQuery(document).ready(function($) {
  "use strict";

  var request;

  $("form.contactForm").submit(function(event) {
    event.preventDefault();

    if (request)
      request.abort();

    var f = $(this).find(".form-group"),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children("input").each(function() {
      var i = $(this);
      var rule = i.attr("data-rule");

      if (rule !== undefined) {
        var ierror = false;
        var pos = rule.indexOf(":", 0);

        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case "required":
            if (i.val() === "") {
              ferror = ierror = true;
            }
            break;
          case "minlen":
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
          case "email":
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
          case "checked":
            if (!i.is(":checked")) {
              ferror = ierror = true;
            }
            break;
          case "regexp":
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }

        i.next(".validation")
          .html(
            ierror
              ? i.attr("data-msg") !== undefined
                ? i.attr("data-msg")
                : "wrong Input"
              : ""
          )
        
        if (ierror) 
          i.next(".validation").show("blind")
      }
    });

    f.children("textarea").each(function() {
      var i = $(this);
      var rule = i.attr("data-rule");
      if (rule !== undefined) {
        var ierror = false;
        var pos = rule.indexOf(":", 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }
        switch (rule) {
          case "required":
            if (i.val() === "") {
              ferror = ierror = true;
            }
            break;
          case "minlen":
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        
        i.next(".validation")
          .html(
            ierror
              ? i.attr("data-msg") != undefined
                ? i.attr("data-msg")
                : "wrong Input"
              : ""
          )
        
        if (ierror) 
          i.next(".validation").show("blind")
          
      }
    });
    
    if (ferror)
      return false;
    else {
      var inputs = $(this).find("input, textarea, button");
      var serializedDate = $(this).serialize();
      inputs.prop("disabled", true);

      request = $.ajax({
        type: "POST",
        url: "https://online-email-sender.herokuapp.com/send/bggesso",
        data: serializedDate
      });

      request.done(function(data) {
        $("#errormessage").hide();
        $("#sendmessage").finish().slideDown(600).delay(4500).slideUp(600);
        $(".contactForm")
          .find("input, textarea")
          .val("");
      });

      request.fail(function (jqXHR, textStatus, errorThrown) {
        $("#sendmessage").hide();
        $("#errormessage").slideDown(600).delay(4500).slideUp(600);
      });

      request.always(function () {
        inputs.prop("disabled", false);
      });
  
      return false;
    }
    
  });

});
