///////////////////////////////////////////////////
// NAVIGATION Handlers
///////////////////////////////////////////////////
/////// Styling for tabs in main navigation
function tabHandler() {
  const navLinks = $('.nav-link')
  navLinks.on('click', function(e){
    // if($(e.target).has('.fa')) return
    const target = $(e.target),
      siblings = target.siblings(),
      id = target[0].id.split('-')[1],
      section = $(`#${id}-section`),
      isActive = (target.hasClass('selected'));  

    if(!isActive){
      target.addClass('selected')
      siblings.removeClass('selected')
      section[0].style.display = 'grid';
      section.siblings().hide()
    }
  })
}

/////// Handles the links found in the .user-banner
function displayFollowsHandler(){
  const links = $('.user-banner-link')
  links.on('click', linkHandler)
}

/////// Changes display of sections according to link clicked
function linkHandler(e){
  e.preventDefault();
  const el = $(e.target).parents('a')[0],
    name = el.className.split(' ')[0].split('-')[1],
    display = $(`#${name}-section`),
    isDisplaying = (!display[0].style.display || display[0].style.display === "none" )? false : true;
  
  if(!isDisplaying){
    display.css('display', 'grid')
    display.siblings().not('.user-container').hide()
  }
}

////// Change home link href depending on current page 
function returnInfo(el, e){
  if(isLoggedIn()) (currentPage === 'index.html')? el.href = 'index.html': el.href = '../index.html';
  else (currentPage !== 'index.html')? el.href = 'info.html': el.href = 'pages/info.html';
}

///////////////////////////////////////////////////
// AVATAR COMPONENT
///////////////////////////////////////////////////
function displayAvatar(id) {
  const avatar = document.getElementById('user-avatar');
  avatar.innerHTML = `
      <div class="user-avi profile-avi" style="background-image: url(${user.avatar})"></div>
      ${avatar.innerHTML}`

  const signInBtn = document.getElementById('signin-form');
  (signInBtn) ? signInBtn.style.display = "none" : null;

  const myProfileBtn = document.getElementById('my-profile');
  (myProfileBtn)? myProfileBtn.href =`pages/profile.html#${user.id}` : null;

  avatar.style.display = "flex";
  avatar.children[1].firstElementChild.innerText = `${avatar.children[1].firstElementChild.innerText} ${user.username}`
}

///////////////////////////////////////////////////
// USERS COMPONENT
///////////////////////////////////////////////////
//Displays user section
function displayUsers(page) {
  displayAll(records, 'users', page)
}

/////// Modifies users data according to type
function displayAll(arr, arrType, page) {
  const section = $(`#${arrType}-section`)[0];
  const allContainer = $(`#all-${arrType}-container`)[0];
  if (arr.length > 0) {
    const limitedData = formatData(arr, 10)
    renderAll(limitedData, allContainer, 0, page)
  }else{
    allContainer.lastElementChild.innerText = `Nothing to show here...`;
  }
}

/////// Render lists of users
function renderAll(data, container, idx = 0, page) {
  // render subarrays of comment objects
    data[idx].map(record => {
      const userContainer = document.createElement('a');
      const link = (page === 'index.html')? 'pages/profile.html' : 'profile.html';
      (typeof(record) === 'string') ? record = userDB[record] : null;
      userContainer.href = `${link}#${record.id}`;
      userContainer.id = record.id;
      (page === "profile.html")? userContainer.className = "ui card user-card-small" : userContainer.className = "user-card user-container ui card";
      (page === "profile.html")? userContainer.innerHTML = followsHTML(record) : userContainer.innerHTML = usersHTML(record);
      container.insertBefore(userContainer, container.lastElementChild);
    });
    $('.user-container .card-avi').dimmer({on: 'hover'});

  // aslong as there are subarrays within the main array render and rerun
  if (idx !== data.length-1) {
    container.lastElementChild.innerHTML = `<a href="#" class="more-users user-link">Show more...</a>`
    $('.more-users').on('click', (e) => {
      e.preventDefault()
      renderAll(data, container, idx + 1, page)
    })
  } else {
    container.lastElementChild.innerText = ``;
  }
}

// HTML for user container in usersr sections
function usersHTML(record){
  return `
    <div class="card-avi image dimmable" style="background-image: url(${record.avatar})" data-title="${record.name}" data-content="${(record.bio)? record.bio : "No bio available"}">
        <div class="ui inverted dimmer hidden">
          <div class="content">
            <div class="center"></div>
          </div>
        </div>
    </div>
    <div class="extra content user-content">
      <h3><p class="user-link small">${record.username}</p>
      <p class="user-details"><sup><i>Member since: ${record.created.date}</i></sup></p>
    </div>`
}

///////////////////////////////////////////////////
// POSTS COMPONENT
///////////////////////////////////////////////////
// Displays post component
function displayPosts(currentPage, pageID) {
  const allContainer = document.getElementById('all-posts-container'),
    allPosts = getPosts(currentPage, pageID),
    postsArr = toArray(allPosts).reverse(),
    limitedData = formatData(postsArr, 5);

  displayPostInput(currentPage, pageID);
  (limitedData.length > 0) ? renderPosts(limitedData, allContainer) : allContainer.lastElementChild.innerHTML = 'No posts available...'
}

/////////////////Get specified list of posts
function getPosts(currentPage, pageID) {
  let posts = {}

  if (currentPage === "index.html") {
    posts = postDB;
  } else if (!isLoggedIn() || user.id !== pageID) {
    userDB[pageID].posts.map(id => {
      posts[id] = postDB[id];
    });
  } else if (user.id === pageID || user.id !== null) {
    user.posts.map(postId => {
      posts[postId] = postDB[postId];
    });
  }
  return posts;
}

/////////////////Toggles posting ability
function displayPostInput(page, pageID) {
  if (!isLoggedIn() || (page !== 'index.html' && pageID !== user.id)) {
    const postForm = document.getElementById('post-form')
    postForm.style.display = "none";
  }
}

/////////////////Renders posts
function renderPosts(data, container, idx = 0) {
  data[idx].forEach(post => {
    const postContainer = document.createElement('div');
    let styleClass = '';

    (isLoggedIn()) ? (post.likes.includes(user.id)) ? styleClass = 'liked' : styleClass = 'unliked' : null
    postContainer.className = "post-container ui card";
    postContainer.id = post.id;
    postContainer.innerHTML = postHTML(post, styleClass);
    container.insertBefore(postContainer, container.lastElementChild);
  });
  if (idx !== data.length - 1) {
    container.lastElementChild.innerHTML = `<a href="#" class="more-posts user-link">Show more...</a>`
    $('.more-posts').on('click', (e) => {
      e.preventDefault()
      renderPosts(data, container, idx + 1)
    })
  } else {
    container.lastElementChild.innerHTML = ''
  }
}

// HTML for individual post
function postHTML(post, styleClass){
 return `
  <div class = "post-header header">
      <div class="user-avi" style="background-image: url(${userDB[post.author_id].avatar})"></div>
      <h3 class="post-author"><a class="user-link" href="pages/profile.html#${post.author_id}">${post.author}</a></h3>
  </div>
  <div class="post-content content">
      <p class="post-text">${post.content}</p>
      <p class="post-details">${post.created.date} @ ${post.created.time}</p>
  </div>
  <div class="post-comments extra content">
    <div class="post-links">
        <a class="like-btn fa fa-thumbs-up ${styleClass}"> ${post.likes.length}</a>
        <a class="comment-btn fa fa-comment" onclick="displayCommentsSection(this, event);"> ${post.comments.length}</a>
        ${renderDelBtn(post.author_id, "delete-post")}
    </div>
    <section class="ui segment comments-section ">
            ${renderCommentInput()}
            <section class="all-comments-container">
              <nav class="show-more">
              </nav>
            </section>
    </section>
  </div>`;
}

///////////////////////////////////////////////////
// COMMENTS COMPONENT
///////////////////////////////////////////////////
//////////Displays comment section.
function displayCommentsSection(el, event) {
  const commentBtn = $(el),
    commentSection = el.parentNode.parentNode.lastElementChild,
    isActive = commentBtn[0].className.split(' ').includes('active'),
    container = $('~ .comments-section > .all-comments-container', el.parentNode)[0]
   
  if (isActive) {
    commentBtn.removeClass('active')
    $(commentSection).slideUp(200)
    $(container).children('.comment-container').remove()
  } else {
    handleRenderComments(container)
    commentBtn.addClass('active')
    $(commentSection).slideDown(200)
    commentSection.style.display = "grid";
  }
}

///////// Prepares data for rendering//////////
function handleRenderComments(parent) {
  const post = $(parent).parents(".post-container")[0],
    comments = postDB[post.id].comments;

  if (comments.length > 0) {
    const limitedComments = formatData(comments, 5)
    renderComments(limitedComments, parent)
  } else {
    parent.firstElementChild.innerText = 'No comments available'
  }
}

///////// Renders comments //////////
function renderComments(data, container, idx = 0) {
  ///////render subarrays of comment objects
  data[idx].map(comment => {
    const commentContainer = document.createElement('div');
    const commentAuthor = userDB[comment.author_id];
    commentContainer.className = "comment-container"
    commentContainer.id = comment.id
    commentContainer.innerHTML = `
      <div class="comment-avi user-avi" style="background-image: url(${commentAuthor.avatar})" data-title="${commentAuthor.name}" data-content="${(commentAuthor.bio)? commentAuthor.bio : "No bio available"}" data-position="left center"></div>
      <div class="comment-content">
        <h4 class="comment-author"><a class="user-link" href="profile.html#${comment.author_id}">${commentAuthor.username}</a></h4>
        <p class= "comment-content">${comment.content}</p>
        <p class= "comment-details">${comment.created.date}</p>
        ${renderDelBtn(comment.author_id, "delete-comment")}
      </div>`
    container.insertBefore(commentContainer, container.lastElementChild);
  })
  $('.comment-container .user-avi').popup()

  /////// aslong as there are subarrays within the main array render and rerun
  if (idx !== data.length - 1) {
    container.lastElementChild.innerHTML = `<a href="#" class="more-comments user-link">Show more...</a>`
    $('.more-comments').on('click', (e) => {
      e.preventDefault()
      renderComments(data, container, idx + 1)
    })
  } else {
    container.lastElementChild.innerHTML = ''
  }
}

///////////////////////////////////////////////////
// FEED COMPONENT
///////////////////////////////////////////////////
// Displays feed component
function displayFeed(){
  if(isLoggedIn()){
    const feed = getFeed();
    const allContainer = $('#all-feed-container')[0];
    const section = $(`#feed-section`)[0]

    if (feed.length > 0) {
      const limitedData = formatData(feed, 10);
      renderFeedLog(limitedData, allContainer);
    }else{
      allContainer.lastElementChild.innerText = `Nothing to show here...`;
    }
  }
}

function renderFeedLog(data, container, idx = 0) {
  // render subarrays of comment objects
    data[idx].map(obj => {
      (obj.author === user.username)? obj.author = 'you' : null;
      const feedContainer = document.createElement('div');
      feedContainer.className = "event ui segment";
      feedContainer.id = obj.event_id;
      feedContainer.innerHTML = htmlSwitcher(obj)
      container.insertBefore(feedContainer, container.lastElementChild);
    })
    $('.user-link').popup()

  // aslong as there are subarrays within the main array render and rerun
  if (idx !== data.length-1) {
    container.lastElementChild.innerHTML = `<a href="#" class="more-feed user-link">Show more...</a>`
    $('.more-feed').on('click', (e) => {
      e.preventDefault()
      renderFeedLog(data, container, idx + 1,)
    })
  } else {
    container.lastElementChild.innerText = ``;
  }
}
// Controls which html to render based on event
function htmlSwitcher(obj){
  switch(obj.event){
    case 'joined':
      return joinEvent(obj)
      break;
    case 'followed':
      return followEvent(obj);
      break;
    case 'posted':
      return postedEvent(obj);
      break;
    case 'commented':
      return commentedEvent(obj);
      break;
    case 'liked':
      return likeEvent(obj);
      break;
    case 'updated':
      return updatedEvent(obj);
  }
}

//HTML for updated events
function updatedEvent(obj){
  const whoDunIt = userDB[obj.author_id];
  return `<div class='event-wrapper' >
            <i class="refresh icon"></i>
            <a class="user user-link" href="pages/profile.html#${whoDunIt.id}" data-position="left center" data-title="${whoDunIt.name}" data-content="${(whoDunIt.bio)? whoDunIt.bio : "No bio available"}">${obj.author}</a> ${obj.event} profile.
          </div>`
}
//HTML for joines events
function joinEvent(obj){
  const whoDunIt = userDB[obj.author_id]
  return `<div class='event-wrapper '>
            <i class="users icon"></i>
            <a class="user user-link" href="pages/profile.html#${whoDunIt.id}" data-position="left center" data-title="${whoDunIt.name}" data-content="${(whoDunIt.bio)? whoDunIt.bio : "No bio available"}">${obj.author}</a> ${obj.event} the fam.
          </div>`
}

//HTML for follow events
function followEvent(obj){
  const whoDunIt = userDB[obj.author_id];
  const toWhom = userDB[obj.target.id];
  return `<div class='event-wrapper '>
            <i class="fa fa-user-plus"></i>
            <a class="user user-link" href="pages/profile.html#${whoDunIt.id}" data-position="left center" data-title="${whoDunIt.name}" data-content="${(whoDunIt.bio)? whoDunIt.bio : "No bio available"}" >${obj.author}</a> ${obj.event}
            <a class="user user-link" href="pages/profile.html#${toWhom.id}" data-position="right center" data-title="${toWhom.name}" data-content="${(toWhom.bio)? toWhom.bio : "No bio available"}">${toWhom.username}</a>
          </div>`
}

//HTML for like events
function likeEvent(obj){
  const whoDunIt = userDB[obj.author_id]
  const toWhom = userDB[obj.target.id];
  return `<div class='event-wrapper '>
            <i class="thumbs outline up icon"></i>
            <a class="user user-link" href="pages/profile.html#${whoDunIt.id}" data-position="left center" data-title="${whoDunIt.name}" data-content="${(whoDunIt.bio)? whoDunIt.bio : "No bio available"}">${obj.author}</a> ${obj.event} 
            <a class="user user-link" href="pages/profile.html#${toWhom.id}" data-position="right center" data-title="${toWhom.name}" data-content="${(toWhom.bio)? toWhom.bio : "No bio available"}">${toWhom.username}'s</a> post
          </div>`
}  

//HTML for post events
function postedEvent(obj){
  const whoDunIt = userDB[obj.author_id];
  return `<div class='event-wrapper '>
            <i class="comment outline icon"></i>
            <a class="user user-link" href="pages/profile.html#${whoDunIt.id}" data-position="left center" data-title="${whoDunIt.name}" data-content="${(whoDunIt.bio)? whoDunIt.bio : "No bio available"}">${obj.author}</a> ${obj.event}
            <div class="event-content"><i>"${obj.content}"</i></div>
          </div>`
}
// moment(obj.date).fromNow()

//HTML for comment events
function commentedEvent(obj){
  const whoDunIt = userDB[obj.author_id];
  const toWhom = userDB[obj.target.id];
  return `<div class='event-wrapper '>
            <i class="comments outline icon"></i>
            <a class="user user-link" href="pages/profile.html#${whoDunIt.id}" data-position="left center" data-title="${whoDunIt.name}" data-content="${(whoDunIt.bio)? whoDunIt.bio : "No bio available"}">${obj.author}</a> ${obj.event} on 
            <a class="user user-link" href="pages/profile.html#${toWhom.id}" data-position="right center" data-title="${toWhom.name}" data-content="${(toWhom.bio)? toWhom.bio : "No bio available"}">${toWhom.username}'s</a> post
            <div class="event-content"> <i>"${obj.content}"</i></div>
          </div>`
}

//Gathers user feed comprised of those they follow.
function getFeed(){
  const data = [...user.activity]
  for(const id of user.following)
    data.push(...userDB[id].activity)

  data.sort((a, b) => Date.parse(b.created) - Date.parse(a.created));
  return data.filter(obj => obj.target.id !== user.id);
}