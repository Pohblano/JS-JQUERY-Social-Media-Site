///////////////////////////////////////////////////
// MODAL component
///////////////////////////////////////////////////
const modal = (function () {
  const $window = $(window)
  const $wrapper = $('.wrapper')
  const $modal = $('<div class = "modal" />')
  const $content = $('<div class="modal-content" />')
  const $close = $('<a id="exit-window" class="fa fa-times-circle"></a>')

  $modal.append($close, $content)
  $close.on('click', e => {
    e.preventDefault()
    modal.close()
  });

  return {
    center: () => {
      const top = Math.max($window.height() - $modal.outerHeight(), 0) / 2
      const left = Math.max($window.width() - $modal.outerWidth(), 0) / 2
      $modal.css({
        top: top + $window.scrollTop(),
        left: left + $window.scrollLeft()
      })
    },
    open: (settings) => {
      $content.empty().append(settings.content)
      $wrapper[0].style.filter = "brightness(0.7)"
      $modal.css({
        width: settings.width || 'auto',
        height: settings.height || 'auto',
        border: "1px solid #E1F5FE",
        boxShadow: "0px 0 4px 0px #01579B",
        borderRadius: "7px",
      }).appendTo('body')

      modal.center()
      $(window).on('resize', modal.center)
    },
    close: () => {
      $wrapper[0].style.filter = "unset"
      $content.empty();
      $modal.detach();
      $(window).off('resize', modal.center)
    }
  }
})();


///////////////////////////////////////////////////
// INIT MODAL
///////////////////////////////////////////////////
(function () {
  const $content = $("#edit-section").detach()
  $('#submit-edit-profile').on('click', () => {
    modal.open({ content: $content, width: 340, height: 300 })
  })
})()

