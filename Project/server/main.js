Meteor.startup(function(){
if (Profiles.find().count() == 0){
	for (var i=1;i<23;i++){
		Profiles.insert(
			{
				img_src:"/images/img_"+i+".jpg",
				img_alt:"image number "+i
			}
		);
	}// end of for insert images
	// count the images!
	console.log("startup.js says: "+Profiles.find().count());
}// end of if have no images
});
