$(document).ready(function(){
  //initialize the firebase app
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

  //create firebase references
  var Auth = firebase.auth(); 
  var dbRef = firebase.database();
  var contactsRef = dbRef.ref('contacts')
  var usersRef = dbRef.ref('users')
  var auth = null;

  //Register
  $('#registerForm').on('submit', function (e) {
    e.preventDefault();
    $('#registerModal').modal('hide');
    $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
    $('#messageModal').modal('show');
    var data = {
      email: $('#registerEmail').val(), //get the email from Form
      firstName: $('#registerFirstName').val(), // get firstName
      lastName: $('#registerLastName').val(), // get lastName
    };
    var passwords = {
      password : $('#registerPassword').val(), //get the pass from Form
      cPassword : $('#registerConfirmPassword').val(), //get the confirmPass from Form
    }
    if( data.email != '' && passwords.password != ''  && passwords.cPassword != '' ){
      if( passwords.password == passwords.cPassword ){
        //create the user
        
        firebase.auth()
          .createUserWithEmailAndPassword(data.email, passwords.password)
          .then(function(user) {
            return user.updateProfile({
              displayName: data.firstName + ' ' + data.lastName
            })
          })
          .then(function(user){
            //now user is needed to be logged in to save data
            //now user is needed to be logged in to save data
            auth = user;
            //now saving the profile data
            usersRef.child(user.uid).set(data)
              .then(function(){
                console.log("User Information Saved:", user.uid);
              })
            $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
            
            $('#messageModal').modal('hide');
          })
          .catch(function(error){
            console.log("Error creating user:", error);
            $('#messageModalLabel').html(spanText('ERROR: '+error.message, ['danger']))
          });
      } else {
        //password and confirm password didn't match
        $('#messageModalLabel').html(spanText("ERROR: Passwords didn't match", ['danger']))
      }
    }  
  });

  //Login
  $('#doLogin').on('click', function (e) {
 
    $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
   
		 $('#loginEmail').prop('disabled', false);
		 $('#loginPassword').prop('disabled', false);
		 $('#doLogin').prop('disabled', false);

    if( $('#loginEmail').val() != '' && $('#loginPassword').val() != '' ){
      //login the user
      var data = {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
      };
      firebase.auth().signInWithEmailAndPassword(data.email, data.password)
        .then(function(authData) {
          auth = authData;
          $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
		  window.location.href = '/account';
       
        })
        .catch(function(error) {
          console.log("Login Failed!", error);
          $('#messageModalLabel').html(spanText('ERROR: '+error.message, ['danger']));
		  		 $('#loginEmail').prop('disabled', true);
		 $('#loginPassword').prop('disabled', true);
		 $('#doLogin').prop('disabled', true);
        });
    } else {
		 $('#messageModalLabel').html(spanText('ERROR: Please fill out the fields!.', ['danger']))
	}
  });

  $('#logout').on('click', function(e) {
    e.preventDefault();
    firebase.auth().signOut()
  });

  //save contact
  $('#contactForm').on('submit', function( event ) {  
    event.preventDefault();
    if( auth != null ){
      if( $('#name').val() != '' || $('#email').val() != '' ){
        contactsRef.child(auth.uid)
          .push({
            name: $('#name').val(),
            email: $('#email').val(),
            location: {
              city: $('#city').val(),
              state: $('#state').val(),
              zip: $('#zip').val()
            }
          })
          document.contactForm.reset();
      } else {
        alert('Please fill at-lease name or email!');
      }
    } else {
      //inform user to login
    }
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      auth = user;
      $('body').removeClass('auth-false').addClass('auth-true');
      usersRef.child(user.uid).once('value').then(function (data) {
        var info = data.val();
        if(user.displayName) {
          
          $('.user-info').html('<span class="user-name">Hello, '+user.displayName+'</span>');
        }  
      });
      contactsRef.child(user.uid).on('child_added', onChildAdd);
    } else {
      // No user is signed in.
      $('body').removeClass('auth-true').addClass('auth-false');
      auth && contactsRef.child(auth.uid).off('child_added', onChildAdd);
      $('#contacts').html('');
      auth = null;
    }
  });
});

function onChildAdd (snap) {
  $('#contacts').append(contactHtmlFromObject(snap.key, snap.val()));
}
 
//prepare contact object's HTML
function contactHtmlFromObject(key, contact){
  return '<div class="card contact" style="width: 18rem;" id="'+key+'">'
    + '<div class="card-body">'
      + '<h5 class="card-title">'+contact.name+'</h5>'
      + '<h6 class="card-subtitle mb-2 text-muted">'+contact.email+'</h6>'
      + '<p class="card-text" title="' + contact.location.zip+'">'
        + contact.location.city + ', '
        + contact.location.state
      + '</p>'
      // + '<a href="#" class="card-link">Card link</a>'
      // + '<a href="#" class="card-link">Another link</a>'
    + '</div>'
  + '</div>';
}

function spanText(textStr, textClasses) {
  var classNames = textClasses.map(c => 'text-'+c).join(' ');
  return '<span class="'+classNames+'">'+ textStr + '</span>';
}

