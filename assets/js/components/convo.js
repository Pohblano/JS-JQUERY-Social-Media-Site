///////////////////////////////////////////////////
// SELECT FOLLOWERS COMPONENT (in modal form)
///////////////////////////////////////////////////
// Displays followers selection
function displaySelection(id) {
  const record = userDB[id];
  handleSelection(record.following)
}

// Handles selection render
function handleSelection(arr) {
  let select = ($('.select-followers')[0])? $('.select-followers')[0] : $('#select-followers')[0];
  if (arr.length > 0) {
    const limitedData = formatData(arr, 10)
    renderSelection(limitedData, select);
  } else {
    select.lastElementChild.innerText = `Nothing to show here...`;
  }
}

// Renders selection
function renderSelection(data, container, idx = 0) {
  data[idx].map(id => {
    const itemContainer = document.createElement('a');
    itemContainer.className = "list-item"
    itemContainer.innerHTML = selectionItemHTML(id);

    container.insertBefore(itemContainer, container.lastElementChild);
  });
  // aslong as there are subarrays within the main array render and rerun
  if (idx !== data.length - 1) {
    container.lastElementChild.innerHTML = `<a href="#" class="more-select user-link">Show more...</a>`
    $('.more-select').on('click', (e) => {
      e.preventDefault()
      renderSelection(data, container, idx + 1)
    })
  } else {
    container.lastElementChild.innerText = ``;
  }
}

// HTML for selection of followers
function selectionItemHTML(id) {
  
  const item = userDB[id];
  return `
  <div class="ui checkbox">
    <input type="checkbox" tabindex="0" value= '${item.id}'>
    <label>${item.username}</label>
  </div>`
}


///////////////////////////////////////////////////
// CONVERSATION LINKS COMPONENT
///////////////////////////////////////////////////
// Displays conversation links
function displayConvos(id) {
  const record = userDB[id];
  handleConvoLinks(record.conversations);
}

// Handles conversation links render
function handleConvoLinks(arr) {
  // const section = $(`#list-section`)[0]
  const allContainer = $(`#all-convos-container`)[0]
  if (arr.length > 0)
    renderConvoLinks(arr, allContainer)
}

// Renders conversation links
function renderConvoLinks(data, container) {
 $(container).children('a').remove()
  data.map(id => {
    const convo = convoDB[id];
    const link = document.createElement('a');
    link.id = convo.id;
    link.className = 'ui item list-link user-card-small';
    link.textContent = convo.title;
    link.onclick = displayConvoContent;
    container.append(link);
  })

  // Handles link decoration on active
  $('.list-link').on('click', function () {
    if (!$(this).hasClass('dropdown'))
      $(this)
        .addClass('active')
        .closest('.ui.menu')
        .find('.item')
        .not($(this)).not('.list-dropdown')
        .removeClass('active');
  })
}

///////////////////////////////////////////////////
// CONVO CONTENT COMPONENT
///////////////////////////////////////////////////
// Displays conversation content according to convo link clicked
function displayConvoContent(e) {
  const convo = (typeof(e) === 'string')? convoDB[e]: convoDB[this.id];
  renderConvoHeader(convo);
  handleConvoMessages(convo.messages);
}


///////////////////////////////////////////////////
// CONVO HEADER COMPONENT
///////////////////////////////////////////////////
//Renders conversation header
function renderConvoHeader(obj) {
  const section = $('#convo-section');
  const header = document.createElement('div');

  section.children('#convo-header, .convo-input').remove()
  header.id = 'convo-header'
  header.className = "ui segment d-flex flex-column align-items-center";
  header.innerHTML = convoHeaderHTML(obj);
 
  section.prepend(header)
  section.append(convoInputHTML(obj))


  // Remove commas from list of avis
  $(".convo-avis")[0].childNodes.forEach(x => {
    if(x.nodeName === "#text")
      $(x).remove()
  })
}

// HTML for header on conversations
function convoHeaderHTML(obj) {
  return `
  <div class='d-flex mb-3'>
    <h1 class="mr-2">${obj.title}</h1>
    ${(obj.author_id === user.id)? `<button class="add-recipient user-avi ui button mini" title="add new recipient" >+</button>` : ''}
  </div>
  <div class="convo-avis mb-3">
    ${(obj.author_id !== user.id) ?`<div class="user-avi anim-avi " style="background-image: url(${userDB[obj.author_id].avatar})"></div>`:''}
    ${obj.recipients.map(id => (id !== user.id) ? `<div class="user-avi anim-avi" style="background-image: url(${userDB[id].avatar})"></div>`:'')}
  </div>
  ${searchHTML()}
  `
}


// HTML for search input to add followers to conversation
function searchHTML(){
  return `
  <div class="search-recipient ui local search  align-self-center">
    <div class="ui left icon input">
      <i class="world icon"></i>
      <input class="prompt" type="text" placeholder="Local search..." autocomplete="off">
    </div>
    <div class="results"></div>
  </div> `
 
}

// HTML for input on conversations
function convoInputHTML({ id }) {
  return `
    <div id="${id}" class="convo-input ui right icon input segment">
      <input class="input-msg" type="text" name="message" placeholder="Press enter to send...">
      <a class="ui button submit-msg"><i class="send icon"></i></a>
    </div>`
}

///////////////////////////////////////////////////
// MESSAGES COMPONENT
///////////////////////////////////////////////////
// Formats messages data to prep for rendering
function handleConvoMessages(arr) {
  const allContainer = $('#all-messages-container');
  allContainer.children('.msg-wrapper, .msg-default').remove();

  if (arr.length > 0) {
    const limitedData = formatData(arr, 18)
    renderConvoMessages(limitedData, allContainer[0]);
  } else 
    allContainer[0].lastElementChild.innerText = `No messages here...`;
}

// Renders conversation messages
function renderConvoMessages(data, container, idx = 0) {
  data[idx].map(msg => {
    const msgContainer = document.createElement('div');
    msgContainer.id = msg.id;
    msgContainer.className = "msg-wrapper d-flex flex-column";
    if(msg.author_id !== user.id){
      msgContainer.classList.add('align-self-end', 'd-flex')
    }
    msgContainer.innerHTML = msgHTML(msg);

    container.insertBefore(msgContainer, container.lastElementChild);
  });
  if (idx !== data.length - 1) {
    container.lastElementChild.innerHTML = `<a href="#" class="more-msg user-link">Show more...</a>`
    $('.more-msg').on('click', (e) => {
      e.preventDefault()
      renderConvoMessages(data, container, idx + 1);
    })
  } else
    container.lastElementChild.innerText = ``;
}

// HTML for rendered msg
function msgHTML(obj) {
  const author = userDB[obj.author_id];
  return `
    ${(user.id !== obj.author_id) ? `<p class= "msg-author align-self-end"><strong>${author.username} </strong></p>` : ''}
    <p class="msg-content px-4 py-1  ${(user.id !== obj.author_id) ? `msg-receiver` : ''}">${obj.content}</p>
    <p class="msg-details"><small>${obj.created.time}</small></p>`
}

///////////////////////////////////////////////////
// COLLAPSING MENU
///////////////////////////////////////////////////
// Collapses list of convos to a dropdown button
function rearrangeMenu(e){
  const main = $('#list-section');
  const children = main.children().not('.add-convo');
  const dropdown = $('<div class="ui dropdown item list-dropdown" tabindex="0" />');
  const menu = $('#all-convos-container');
  const active = $('.list-dropdown');
  if(window.innerWidth < 550 && active.length === 0){
    menu.addClass('menu hidden transition list-menu');
    menu.attr('tabindex', -1);
    dropdown.append('Conversations', '<i class="sidebar icon"></i>', menu);
    main.append(dropdown)
    $(".dropdown").dropdown();
  }
}
