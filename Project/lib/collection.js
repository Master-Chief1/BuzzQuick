
Profiles = new Mongo.Collection("profiles");

Profiles.allow({
  insert:function(userId, doc){
    console.log("Testing Security");
    if(Meteor.user())
    {
      if(userId != doc.createdBy){
        return false; //User is  just messing around on the console
      }
      else{
        return true;  //User is logged in
      }
    }
    else{
      return false;   //User not logged in.
    }
  },
  remove:function(userId, doc){
    return true;
  },
  update:function(userId, doc){
    return true;
  }
});
