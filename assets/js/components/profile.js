///////////////////////////////////////////////////
// USER BANNER COMPONENT
///////////////////////////////////////////////////
// Displays user banner
function displayUserBanner(pageID) {
  const mainBody = document.getElementById('main-body'),
    userBanner = document.createElement('section');
  let obj = userDB[pageID],
    styleClass = '';

  if (isLoggedIn())
    (user.following.includes(pageID)) ? styleClass = 'fa-user-minus unfollow' : styleClass = 'fa-user-plus follow';
  userBanner.className = "user-container user-profile-container user-banner";
  userBanner.innerHTML = userBannerHTML(obj, pageID, styleClass);

  mainBody.insertBefore(userBanner, mainBody.firstChild)
  displayFollowsHandler();
}

// HTML for user banner
function userBannerHTML(obj, pageID, styleClass) {
  return ` 
  <div class="user-banner-wrapper">
    <div class="user-avi profile-avi" style="background-image: url(${obj.avatar})"></div>
    <div class="user-content">
        <h2 class="user-username">${obj.username}<p class="user-name" >(${obj.name})</p></h2>
        <p class="user-details"><sup><i>Joined: ${obj.created.date}</i></sup></p>
        ${(isLoggedIn()) ? (pageID !== user.id) ? `<button class="follow-btn submitBtn fa ${styleClass}"> ${styleClass.split(' ')[1]}</button>` : "" : ''}
    </div>
  </div>
  <div class="user-bio">${(obj.bio) ? obj.bio : ''}</div>
  <nav class="user-follow-info ">
    <a href="#" class="user-post user-banner-link"><div class="profileBtn ui fade animated button">
      <div class="visible content">Posts</div>
      <div class="hidden content">${obj.posts.length}</div></div>
    </a>
    <a href="#" class="user-followers user-banner-link"><div class="profileBtn ui fade animated button">
      <div class="visible content">Followers</div>
      <div class="hidden content">${obj.followers.length}</div></div>
    </a>
    <a href="#" class="user-following user-banner-link"><div class="profileBtn ui fade animated button">
      <div class="visible content">Following</div>
      <div class="hidden content">${obj.following.length}</div></div>
    </a> 
    ${renderNotificationsBtn(pageID, obj)}
  </nav>`

}

///////////////////////////////////////////////////
// FOLLOWING/FOLLOWERS COMPONENT
///////////////////////////////////////////////////
//Displays following section
function displayFollows(id, page) {
  const record = userDB[id];
  displayAll(record.followers, 'followers', page);
  displayAll(record.following, 'following', page);
}
// HTML for user container in follows sections
function followsHTML(record) {
  console.log(currentPage)
  
  return `
    <div class='user-banner-wrapper'>
      <div class="user-avi" style="background-image: url(${record.avatar})" data-title="${record.name}" data-content="${(record.bio) ? record.bio : "No bio available"}"></div>
      <div class="user-content">
          <h3><a class="user-link small" href="profile.html#${record.id}">${record.username}</a></h4>
          <p class="user-details"><sup><i>Member since: ${record.created.date}</i></sup></p>
      </div>
    </div>`;
}

///////////////////////////////////////////////////
// NOTIFICATIONs COMPONENT
///////////////////////////////////////////////////
//Displays notification component
function displayNotifications() {
  if (isLoggedIn()) {
    const record = userDB[user.id];
    const allContainer = $('#all-notifications-container')[0];
    const section = $(`#notifications-section`)[0]

    if (record.notifications.length > 0) {
      const limitedData = formatData(record.notifications, 10)
      renderNotificationsLog(limitedData, allContainer);
    } else {
      allContainer.lastElementChild.innerText = `Nothing to show here...`;
    }
  }
}
//Renders notifications
function renderNotificationsLog(data, container, idx = 0) {
  // render subarrays of comment objects
  data[idx].map(obj => {
    const notificationsContainer = document.createElement('div');
    notificationsContainer.className = "notification-container ui feed"
    notificationsContainer.id = obj.event_id;
    notificationsContainer.innerHTML = notificationHTML(obj);
    container.insertBefore(notificationsContainer, container.lastElementChild);
  })

  // aslong as there are subarrays within the main array render and rerun
  if (idx !== data.length - 1) {
    container.lastElementChild.innerHTML = `<a href="#" class="more-notifications user-link">Show more...</a>`
    $('.more-notifications').on('click', (e) => {
      e.preventDefault()
      renderNotificationsLog(data, container, idx + 1)
    })
  } else {
    container.lastElementChild.innerText = ``;
  }
}
//HTML for a notification
function notificationHTML(note) {
  const whoDunIt = userDB[note.author_id];
  let msg = '';
  (note.event === 'liked' || note.event === 'commented') ? msg = 'your post' : msg = 'you';
  if(whoDunIt.id === user.id) return null;
  else
    return `
      <div class='ui section user-banner-wrapper '>
        <div class="user-avi" style="background-image: url(${whoDunIt.avatar})"></div>
        <div class="notification-content">
          <a class="user user-link" href="profile.html#${whoDunIt.id}">${whoDunIt.username}</a> ${note.event} ${msg}
        </div>
        ${renderDelBtn(user.id, "delete-notification")}
      </div>`;
  
}
