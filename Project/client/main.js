

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('LandingPage', {
    to:"main"
  });
});

Router.route('/main_part', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('main_part', {
    to:"main"
  });
});

Router.route('/about_us', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('about_us', {
    to:"main"
  });
});

Router.route('/Contact', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('Contact', {
    to:"main"
  });
});

Router.route('/image/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('image', {
    to:"main",
    data:function(){
      return Profiles.findOne({_id:this.params._id});
    }
  });
});

Router.route('/Edit_Profiles/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('Edit_Profiles', {
    to:"main",
    data:function(){
      return Profiles.findOne({_id:this.params._id});
    }
  });
});

Router.route('/Profile_view/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('Profile_view', {
    to:"main",
    data:function(){
      return Profiles.findOne({_id:this.params._id});
    }
  });
});

Router.route('/Covid_Measures', function(){
  this.render('navbar', {
    to:"navbar"
  });
  this.render('Covid_Measures', {
    to:"main"
  });
});


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
      Session.set("userFilter", undefined);
      var info = document.getElementById("search_profile").value;
      Session.set("nameFilter", info);
      console.log(Session.get("nameFilter"));
    }
  },
  'click #search_button_profile': function(){
    Session.set("catFilter", undefined);
    Session.set("userFilter", undefined);
    var info = document.getElementById("search_profile").value;
    Session.set("nameFilter", info);
    console.log(Session.get("nameFilter"));
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
        return Profiles.find({createdBy: Session.get("userFilter")}, {sort: {createdOn: -1, rating: -1}});
      }
      if (Session.get("catFilter")) {
        return Profiles.find({category: Session.get("catFilter")}, {sort: {createdOn: -1, rating: -1}});
      }
      if (Session.get("nameFilter")){
        return Profiles.find({name: Session.get("nameFilter")}, {sort: {createdOn: -1, rating: -1}});
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

  Template.Edit_Profiles.helpers({
    user_name:function(_id){
      var user_n = Profiles.findOne({_id:_id}).name;
      return user_n;
    }
  });



  Template.Profile_view.helpers({
    view_img:function(_id){
      console.log(Profiles.findOne({_id:_id}).img_src);
      return Profiles.findOne({_id:_id}).img_src;
    },
    view_name:function(_id){
      console.log(Profiles.findOne({_id:_id}).name);
      return Profiles.findOne({_id:_id}).name;
    },
    view_cat:function(_id){
      console.log(Profiles.findOne({_id:_id}).category);
      return Profiles.findOne({_id:_id}).category;
    },
    view_desc:function(_id){
      console.log(Profiles.findOne({_id:_id}).pro_des);
      return Profiles.findOne({_id:_id}).pro_des;
    },
    view_contact:function(_id){
      console.log(Profiles.findOne({_id:_id}).contact);
      return Profiles.findOne({_id:_id}).contact;
    },
    view_create:function(_id){
      console.log(Profiles.findOne({_id:_id}).createdOn);
      return Profiles.findOne({_id:_id}).createdOn;
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
        Session.set("userFilter", Meteor.user()._id);
        console.log(Session.get("userFilter"));
    },
    'click .js-unset-image-filter':function(event){
        Session.set("userFilter", undefined);
        Session.set("nameFilter", undefined);
        Session.set("catFilter", undefined);
    },

    'click .unset-filter':function () {
      if(Session.get("userFilter") || Session.get("catFilter") || Session.get("nameFilter"))
      {
        Session.set("userFilter", undefined);
        Session.set("catFilter", undefined);
        Session.set("nameFilter", undefined);
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


  Template.Edit_Profiles.events({
   'submit .js-edit-profiles':function(event){
     var img_src, img_alt, pro_des, category, contact, name;

       name = event.target.name.value;
       img_src = event.target.img_src.value;
       img_alt = event.target.img_alt.value;
       pro_des = event.target.pro_des.value;
       contact = event.target.contact.value;
       console.log(Profiles.findOne({_id:this._id}));

       var e = document.getElementById("category");
       category = e.options[e.selectedIndex].text;

       pro_id = this._id;

       Profiles.update({_id:pro_id},
                     {$set: {name:name, img_src:img_src,
                     img_alt:img_alt,
                     pro_des:pro_des,
                     category:category,
                     contact:contact}});
     }
 });
