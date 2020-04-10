$(document).ready(function(){
  var config = {
	   apiKey: "AIzaSyABIlNPZG8RsIt99EaQWxyQD8b7z8ujADI",
      authDomain: "zcinima-3c046.firebaseapp.com",
      databaseURL: "https://zcinima-3c046.firebaseio.com",
      storageBucket: "zcinima-3c046.appspot.com",
	  projectId: "zcinima-3c046",
    storageBucket: "zcinima-3c046.appspot.com",
    messagingSenderId: "313696641744"
  };
  firebase.initializeApp(config);
  

 
 
 
 
 

	$('#doLogin').on('click', function (e) {

		if( $('#loginEmail').val() != '' && $('#loginPassword').val() != '' ){
			$('#doLogin').html('<i class="fa fa-cog fa-spin"></i> Sign In');
			
			 
			setInputDisable({"loginEmail": true, "loginPassword": true, "doLogin": true});

			var data = {
			email: $('#loginEmail').val(),
			password: $('#loginPassword').val()
			};

			 

			firebase.auth().signInWithEmailAndPassword(data.email, data.password)
			.then(function() {
				// $('#navDisplayName').html();
				// $('#navEmail').html();
				// $('#navPhotoURL').html();
				
				console.log('User signed in Successfully');
				$('#messageModalLabel').html('<div class="w3-panel w3-round w3-green"><p>Success!</p></div>');
				setInputDisable({"loginEmail": false, "loginPassword": false, "doLogin": false});
					if( $('#isRedirect').val() == 'true' ){
						window.location.href = '/account';
					}
				
				$('#doLogin').html('Sign In');
			})
			.catch(function(error) {
				console.log("Login Failed!", error);
  
				$('#messageModalLabel').html('<div class="w3-panel w3-round w3-red"><p>'+ error.message + '</p></div>');
				 
				setInputDisable({"loginEmail": false, "loginPassword": false, "doLogin": false});
				$('#doLogin').html('Sign In');
			});

		} else {
			$('#messageModalLabel').html('<div class="w3-panel w3-round w3-red"><p>' + 'Please fill out the fields!.' + '</p></div>')
		}
	});
	
	 
	  
	$('#doRegister').on('click', function (e) {

		console.log("doRegister clicked");

		var data = {
		email: $('#registerEmail').val(), //get the email from Form
		firstName: $('#registerFirstName').val(), // get firstName
		lastName: $('#registerLastName').val(), // get lastName
		};
		var passwords = {
		password : $('#registerPassword').val(), //get the pass from Form
		cPassword : $('#registerConfirmPassword').val(), //get the confirmPass from Form
		}

			if( data.firstName != '' && data.lastName != '' && data.email != '' && passwords.password != '' && passwords.cPassword != '' ){
				 
				if(IsEmail(data.email) == true){
					if( passwords.password == passwords.cPassword ){

						$('#doRegister').html('<i class="fa fa-cog fa-spin"></i> Sign Up');
						var photoURL ="https://via.placeholder.com/150";

						firebase.auth().createUserWithEmailAndPassword(data.email, passwords.password)
						.then(function(user) {
							// var user = firebase.auth().currentUser;
							user.updateProfile({
								displayName: data.firstName + " " + data.lastName,
								photoURL: photoURL
							}).then(function() {
								// Update successful.
								console.log('User Profile Updated Successfully');
							}).catch(function(error) {
								console.log(' Profile not Updated ');
								// An error happened.
							});
							console.log("user created", user);
							$('#messageModalLabel').html('Success');
							 window.location.href = '?/account';
						}).catch(function(error) {
							console.log(error.code);
							console.log(error.message);
							$('#messageModalLabel').html('ERROR: '+error.message);
						});

					} else {
						//password and confirm password didn't match
						$('#messageModalLabel').html("<div class='alert-danger'>ERROR: Passwords didn't match</div>");
					}
				} else {
					//password and confirm password didn't match
					$('#messageModalLabel').html("<div class='alert-danger'>Enter a valid Email ID</div>");
				}
			} else {
				$('#messageModalLabel').html('<div class="alert-danger">ERROR: Please fill out the fields!.</div>');
			}

	});
		
	 
	
	$('#verifyEmail').on('click', function (e) { 
		var user = firebase.auth().currentUser;
		user.sendEmailVerification().then(function() {
			// Email sent.
			console.log("mail sent");
		}).catch(function(error) {
			// An error happened.
			console.log(error);
		});
	});	
	
	
	
	$('#logout').on('click', function (e) { 
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			console.log('User Logged Out!');
		}).catch(function(error) {
			// An error happened.
			console.log(error);
		}); 
	});

	
	
	
	
	
	
	
	
	
	
	

firebase.auth().onAuthStateChanged(function(user) {
console.log("onAuthStateChanged..");
var user = firebase.auth().currentUser;
  if (user) {
	
	$('body').removeClass('auth-false').addClass('auth-true');

    console.log("user avilable",user);
	 
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
	
	 console.log(displayName + " " + photoURL);
	
	if(photoURL == null){
		photoURL = "https://1.bp.blogspot.com/-EjMnEzEVEL4/XpBGZ2vKM6I/AAAAAAAAAE8/FFUznYG0OKYWSd_YEQORUPlR3eBvs_NvQCLcBGAsYHQ/s1600/avatar-png-1.png";
	}
	
	
	$('#navDisplayName').html(displayName);
	$('#navEmail').html(email);
	$('#navPhotoURL1').attr("src", photoURL);
	$('#navPhotoURL').attr("src", photoURL);
	
	if(emailVerified){
	 $('body').removeClass('unverifed').addClass('verifed');
	} else {
	 $('body').removeClass('verifed').addClass('unverifed');
	}
	 
     
  } else {
  $('body').removeClass('auth-true').addClass('auth-false');
 
  
  console.log("no user ");
    // User is signed out.
    // ...
  }
});








});

	function IsEmail(email) {
	  var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  if(!regex.test(email)) {
		return false;
	  }else{
		return true;
	  }
	}

function setInputDisable(item){
 
$.each(item, function( obj, bool ) {
  $('#'+obj).prop('disabled', bool);
}); 
}

				
		