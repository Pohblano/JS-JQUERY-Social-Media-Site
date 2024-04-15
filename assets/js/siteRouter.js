///////////////////////////////////////////////////
// Page router
///////////////////////////////////////////////////
const currentPage = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
console.log(currentPage)

function siteRouter() {
  switch (currentPage) {
    case "signUp.html":
      (isLoggedIn()) ? window.location = "../index.html" : null;
      break;

    case "index.html":
      ///////// Navigation handlers
      tabHandler();
      ///////// Page renders
      displayPosts(currentPage);
      displayUsers(currentPage);
      displayFeed();
      (isLoggedIn()) ? displayAvatar(user.id) : null;
      break;

    case "info.html":
    (isLoggedIn())? window.location = "../index.html" : null;
    break;

    case "profile.html":
      const id = window.location.href.split('#')[window.location.href.split('#').length - 1];
      ///////// Window events
      hashchange();
      window.onload = e => rearrangeProfile(e, id)
      window.onresize = e => rearrangeProfile(e, id)
      ///////// Page renders
      displayPosts(currentPage, id);
      displayUserBanner(id);
      displayFollows(id, currentPage);
      (isLoggedIn() && id === user.id) ? displayNotifications(): null;
      (isLoggedIn()) ? (user.id === id) ? displayAvatar(user.id) : displayAvatar(id) : null;
      break;
    
    case "conversations.html":
      (!isLoggedIn()) ? window.location = "info.html" : null;
      ///////// Window events
      window.onload = e => rearrangeMenu(e);
      window.onresize = e => rearrangeMenu(e);
      ///////// Page renders
      displayConvos(user.id);
      displaySelection(user.id)
      break;
  }
}

// Runs render or handler functions on page loads
// Functions all work off data in LocalStorage
// Accompanying functions can be found under js/components with the same file name as their page counterpart
siteRouter();
