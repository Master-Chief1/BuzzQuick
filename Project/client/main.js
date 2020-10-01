import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
Session.set("profilesLimit",8);

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

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });

  Template.body.helpers({username:function(){
    if (Meteor.user()){
      return Meteor.user().username;
        //return Meteor.user().emails[0].address;
    }
    else {
      return "anonymous internet user";
    }
  }
  });

  Template.profiles.helpers({
    profiles:function(){
      return Profiles.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("profilesLimit")});
    },

    getUser:function(user_id){
      var user = Meteor.users.findOne({_id:user_id});
      if (user){
        return user.username;
      }
      else {
        return "anon";
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
   });

   Template.profiles_add_form.events({
    'submit .js-add-profiles':function(event){
      var img_src, img_alt;

        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;
        console.log("src: "+img_src+" alt:"+img_alt);
        if (Meteor.user()){
          Images.insert({
            img_src:img_src,
            img_alt:img_alt,
            createdOn:new Date(),
            createdBy:Meteor.user()._id
          });
      }
        $("#profiles_add_form").modal('hide');
     return false;
    }
  });
