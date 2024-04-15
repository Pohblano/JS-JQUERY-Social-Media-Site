///////////////////////////////////////////////////
// Get form data
///////////////////////////////////////////////////
function getFormData(id) {
  const obj = {};
  const form = document.getElementById(id);

  for (let input of form) {
    (isEmpty(input)) ? null : (input.type !== "submit") ? obj[input.name] = input.value : null;
    if (input.name === "avatar") {
      const pic = $('#img-preview');
      if(pic.css('backgroundImage') !== 'none')
        obj[input.name] = pic.css('backgroundImage').split('"')[1];
    }
  }
  return obj
}

///////////////////////////////////////////////////
// Check for empty form data
/////////////////////////////////////////////////////
function isEmpty({ name, value }) {
  if (value === "" || value === null || value === undefined) {
    displayError(`! Please put a ${name.toUpperCase()} !`);
    return true;
  } else {
    return false;
  }
}

///////////////////////////////////////////////////
// Error messages
///////////////////////////////////////////////////
function displayError(string) {
  const note = document.getElementById('note');
  if (note) {
    (note.textContent !== "") ? note.textContent = "" : null;
    note.textContent = `${string}`;
  }
}

///////////////////////////////////////////////////
// Preview IMG upload
///////////////////////////////////////////////////
function previewFile() {
  const preview = document.getElementById('img-preview');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();

  reader.onloadend = function (event) {
    preview.style.backgroundImage = `url(${reader.result})`
  }
  if (file) reader.readAsDataURL(file);
  else preview.src = "";
}

///////////////////////////////////////////////////
// Display Login Form
///////////////////////////////////////////////////
$('#redirect-signin').on('click', function(){
  $('#signin-form').removeClass('d-none').addClass('d-flex');
  $(this.parentNode).hide()

})