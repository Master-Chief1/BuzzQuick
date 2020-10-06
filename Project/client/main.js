

Session.set("profilesLimit",8);

$(".button1").click(function() {
    var fired_button = $(this).val();
    alert(fired_button);
});


lastScrollTop = 0;
  $(window).scroll(function(event){
    // test if we are near the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      // where are we in the page?
      var scrollTop = $(this).scrollTop();
      // test if we are going down
      if (scrollTop > lastScrollTop){
        // yes we are heading down...
       Session.set("profilesLimit", Session.get("profilesLimit") + 4);
      }

      lastScrollTop = scrollTop;
    }

  })

  /*$("#search_profile").keyup(function(event) {
   if(event.keyCode === 13) {
       $("#search_profile").click();
   }
  });

   $("#search_button_profile").click(function() {
       alert("Button code executed.");
       console.log("Pressed");
     });*/


  Template.profile_search.events({
  'keypress #search_profile': function (evt, template) {
    if (evt.which === 13) {
      Session.set("catFilter", undefined);
      var info = document.getElementById("search_profile").value;
      Session.set("userFilter", info);
      console.log(Session.get("userFilter"));
    }
  },
  'click #search_button_profile': function(){
    Session.set("catFilter", undefined);
    var info = document.getElementById("search_profile").value;
    Session.set("userFilter", info);
    console.log(Session.get("userFilter"));
  }
});


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });

  Template.body.helpers({
    username:function(){
      if (Meteor.user()){
        return Meteor.user().username;
          //return Meteor.user().emails[0].address;
      }
      else {
        return "Anonymous internet user";
      }
  }
  });

  Template.profiles.helpers({
    profiles:function(){
      if(Session.get("userFilter")){
        console.log("In");
        return Profiles.find({name: Session.get("userFilter")}, {sort: {createdOn: -1, rating: -1}});
      }
      if (Session.get("catFilter")) {
        return Profiles.find({category: Session.get("catFilter")}, {sort: {createdOn: -1, rating: -1}});
      }
      else{
      return Profiles.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("profilesLimit")});
      }
    },

    checkUser:function(createdBy){
      console.log(createdBy);
      console.log(Meteor.userId());
      if(createdBy == Meteor.userId())
      {
        return true;
      }
      else{
        return false;
      }
    },

    getUser:function(user_id){
      var user = Meteor.users.findOne({_id:user_id});
      if (user){
        return user.username;
      }
      else {
        return "Anonymous";
      }
    }
  });


   Template.profiles.events({
    'click .js-profiles':function(event){
        $(event.target).css("width", "50px");
    },
    'click .js-del-profiles':function(event){
      //var image_id = $(this).data('id');
       var pro_id = this._id;
       console.log(pro_id);
       // use jquery to hide the image component
       // then remove it at the end of the animation
       $("#"+pro_id).hide('slow', function(){
        Profiles.remove({"_id":pro_id});
       })
    },
    'click .js-rate-profiles':function(event){
      var rating = $(event.currentTarget).data("userrating");
      //console.log(rating);
      var pro_id = this.data_id;
      console.log("Image: "+pro_id+" rating now: "+rating);

      Profiles.update({_id:pro_id},
                    {$set: {rating:rating}});
    },
    'click .js-show-profiles-form':function(event){
      $("#profiles_add_form").modal('show');
    },
    'click .js-set-image-filter':function(event){
        Session.set("userFilter", this.createdBy);
    },
    'click .js-unset-image-filter':function(event){
        Session.set("userFilter", undefined);
    },

    'click .unset-filter':function () {
      if(Session.get("userFilter") || Session.get("catFilter"))
      {
        Session.set("userFilter", undefined);
        Session.set("catFilter", undefined);
      }
    }
   });

   Template.profiles_add_form.events({
    'submit .js-add-profiles':function(event){
      var img_src, img_alt, pro_des, category, contact, name;

        name = event.target.name.value;
        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;
        pro_des = event.target.pro_des.value;
        contact = event.target.contact.value;

        var e = document.getElementById("category");
        category = e.options[e.selectedIndex].text;

        console.log("src: "+img_src+" alt:"+img_alt);
        if (Meteor.user()){
          Profiles.insert({
            img_src:img_src,
            img_alt:img_alt,
            pro_des:pro_des,
            category:category,
            contact:contact,
            createdOn:new Date(),
            createdBy:Meteor.user()._id,
            name:name
          });
      }
        $("#profiles_add_form").modal('hide');
     return false;
    }
  });
