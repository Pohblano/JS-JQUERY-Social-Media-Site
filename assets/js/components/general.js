///////////////////////////////////////////////////
// GENERAL RENDERS
///////////////////////////////////////////////////
/////// Renders conditional delete button 
function renderDelBtn(_id, className) {
  if (isLoggedIn() && (_id === user.id)) return `<button class="${className} fa fa-trash-alt" ></button>`
  else return ' '
}
/////// Renders textarea for commenting
function renderCommentInput() {
  if (isLoggedIn()) return `<textarea class="submit-comment share-textarea" name="text" cols="30" rows="2" minlength="1" maxlength="120" size="50" placeholder="Press enter to submit..." spellcheck="true" ></textarea>`
  else return ''
}
/////// Renders user notifications button
function renderNotificationsBtn(id, obj){
  if(isLoggedIn() && (id === user.id)) 
    return `<a href="#" class="user-notifications user-banner-link"><div class="profileBtn ui fade animated button">
              <div class="visible content fa fa-envelope-open-text"></div>
              <div class="hidden content">${obj.notifications.length}</div></div>
            </a>`;
  else return '';
}

///////////////////////////////////////////////////
// HANDLERS
///////////////////////////////////////////////////
/////// Check for URL changes
function hashchange() {
  let location = window.location,
    oldURL = location.href,
    oldHash = location.hash;

  // check the location hash on a 100ms interval
  setInterval(function () {
    let newURL = location.href,
      newHash = location.hash;
    (newHash != oldHash) ? location.reload() : null;
  }, 100);
};

/////// Formats array of data into sections (PAGINATION-Like)
function formatData(arr, limit) {
  let count = 0;
  const data = []
  const sections = Math.ceil(arr.length / limit)

  // slice data into sections back into new array
  for (let i = 1; i <= sections; i++) {
    data.push(arr.slice(count, i * limit))
    count += limit
  }
  return data
}

////////////////////////////////////////////////////
// Generate random ID
////////////////////////////////////////////////////
function genId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
}

///////////////////////////////////////////////////
// WINDOW EVENTS
///////////////////////////////////////////////////
/////// Rearrange follow components to display for desktop 
function rearrangeProfile(e, id){
  const followSections = $('main').children().not('.user-container, #post-section, #notifications-section' );
  // const noteSection = $('#notification-section');
  const bannerNav = $('.user-follow-info');
  let allSections;

  if(window.innerWidth > 900 && isLoggedIn()){
    allSections = $('main').children().not(`.user-container, .main-wrapper ${(user.id !== id)? ',#notifications-section' : ''}` );
    allSections.show();
    bannerNav.hide();
    followSections.show();
    allSections.wrapAll( "<div class='main-wrapper' />");
    allSections.not('#post-section, #notifications-section').wrapAll("<div class='follow-wrapper' />");
    $(window).unbind();
  }else if(window.innerWidth < 900){
    allSections = $('main')
      .children().children()
      .not('.user-banner-wrapper, .user-follow-info ');
    bannerNav.show();
    $('#notifications-section').hide()
    followSections.hide();
    allSections.unwrap('.main-wrapper').unwrap('.follow-wrapper');
    $(window).unbind();
  } 
}

