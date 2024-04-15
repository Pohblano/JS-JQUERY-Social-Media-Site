///////////////////////////////////////////////////
// Redirect to sign up form
///////////////////////////////////////////////////
$('#redirect-signup').on('click', function(e){
  e.preventDefault();
  (currentPage !== 'index.html')? window.location = 'signUp.html' : window.location = 'pages/signUp.html';
})

///////////////////////////////////////////////////
// Sign out user
///////////////////////////////////////////////////
$('#submit-signout').on('click', function(e){
    e.preventDefault();
    sessionStorage.clear();
    const page = location.pathname.split('/')[location.pathname.split('/').length - 1]; 
    console.log(location.pathname.split('/')[location.pathname.split('/').length - 1]);
    (page === 'index.html')? location = 'index.html' : location = '../index.html';

})

///////////////////////////////////////////////////
// Sign up user
///////////////////////////////////////////////////
$('#submit-signup').on('click', function(e){
  e.preventDefault();
    const data = getFormData('signup-form');
    if (Object.keys(data).length < 3) return false
    else saveUser(data);
})

// Save user data
function saveUser(obj) {
  if (User.validUsername(obj) === false || User.validPassword(obj) === false) {
    return false;
  } else if (obj.password !== obj.confirm) {
    displayError("! PASSWORDS DO NOT MATCH !")
  } else {
    const newUser = new User(obj);
    User.save(newUser, {type: 'joined'});
    window.location.replace('../index.html');
  }
}

///////////////////////////////////////////////////
// Sign in user
///////////////////////////////////////////////////
$('#submit-signin').on('click', (e)=>{
  e.preventDefault();
  const data = getFormData('signin-form');
  if (Object.keys(data).length < 2) return false;
  else authenticate(data);
})

// Authenticate user data
function authenticate(obj) {
  let signedIn;

  records.map(record => {
    if (record.username === obj.username && record.password === obj.password) {
      sessionStorage.setItem('logged-in', JSON.stringify(userDB[record.id]));
      signedIn = userDB[record.id];
    }
  });
  (!signedIn) ? displayError("Invalid login") : location.reload();
}

///////////////////////////////////////////////////
// Edit user
///////////////////////////////////////////////////
$('#submit-edit').on('click', (e)=>{
  e.preventDefault();
  const data = getFormData('edit-profile-form');
  if (Object.keys(data).length < 1) return false
  else editUser(data);
})
// Update user data
function editUser(obj){
  const edit = User.edit(obj)
  User.save(edit, { type: 'updated'})
  location.reload()
}

///////////////////////////////////////////////////
// Follow/Unfollow user
///////////////////////////////////////////////////
$('#main-body').on('click', '.follow-btn', function(e){
  const id = window.location.href.split('#')[window.location.href.split('#').length - 1];
  const followBtn = this;
  const following = User.follow(id);
  followBtn.className = followBtn.className.split(' ').splice(0,3).join(' ')
  
  if (!isLoggedIn()) return false
  if (following && isLoggedIn()) {
    followBtn.className = `${followBtn.className} fa-user-minus unfollow`
    followBtn.innerText = ` unfollow`
  } else {
    followBtn.className = `${followBtn.className} fa-user-plus follow`
    followBtn.innerText = ` follow`
  }
})

