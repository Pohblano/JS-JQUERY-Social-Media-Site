///////////////////////////////////////////////////
// Add new conversation
///////////////////////////////////////////////////
$('#submit-select').on('click', function(e){
  const data = getData()
  if(!data){
    displayError('PLEASE SELECT A RECIPIENT AND/OR ENTER A TITLE')
    return false;
  } else saveConvo(data)
});

// Saves new conversation to database
function saveConvo(obj){
  const newConvo = new Convo(obj);
  const record = userDB[user.id];
  Convo.save(newConvo);
  handleConvoLinks(record.conversations);
}

// Gets data from new conversation form modal
function getData(){
  const boxes = $("input:checked"),
    data = {},
    list = [];

  for(const box of boxes)
    list.push(box.value);
  data.title = $('#convo-form input')[0].value;
  data.recipients = list;

  if(!data.title || data.recipients.length < 1 )
    return false
  else
    return data;
}

///////////////////////////////////////////////////
// Add new message
///////////////////////////////////////////////////
// Create message and add to conversation
$('#convo-section').on('click', '.submit-msg', msgHandler);

$('#convo-section').on('keydown', '.input-msg', (e) => {
  if(e.keyCode === 13) msgHandler(e);
});

function msgHandler(e){
  e.preventDefault();
  const input = $('.input-msg')[0],
    id = input.parentNode.id ,
    date = new Date(),
    msg = {
    author_id: user.id,
    content: input.value,
    created: {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }
  }

  if(input.value){
    Convo.addMsg(id,msg)
    input.value = '';
  }else return false;

  // Renders messages
  const convo = convoDB[id];
  handleConvoMessages(convo.messages);
}

///////////////////////////////////////////////////
// Add new recipient
///////////////////////////////////////////////////
// Searches through a filters list of followers not in the current conversation
$('#convo-section').on('click','.add-recipient',function(e){
  $('~.search-recipient', this.parentNode).slideDown();
  $('.search-recipient').search({source: recipients().data});
});

// Adds user clicked to conversation
$('#convo-section').on('click','.result',function(e){
  const {id, data} = recipients();
  const result = data.find(obj => obj.title === e.target.textContent);
  (window.confirm(`Add ${e.target.textContent} to the convo ?`))? addRecipient(id, result.id): null;
})

// Adds conversation to userDB and recipient to convoDB
function addRecipient(convoID, userID){
  Convo.addRecipient(convoID, userID);
  
  // Re-renders convo content
  displayConvoContent(convoID);
}

// Create new array of followers not in the conversation
function morphData(data){
  const following = userDB[user.id].following.slice(0);
  const arr = [];

  following.map((x, index)=> {
    data.map((y,idx) => { if(x===y) delete following[index] });
  });
    
  for(const id of following.flat())
    arr.push({title: userDB[id].username, id: id})
  return arr
}

// Encapsulates convo information
function recipients(){
  let id = $('.convo-input')[0].id;
  let list = convoDB[id].recipients;
  let data = morphData(list);
  return { id, list, data}
}
///////////////////////////////////////////////////
// CONVERSATION FORM MODAL
///////////////////////////////////////////////////
// Open modal
$('.standard.demo.modal').modal('attach events', '.add-convo')
