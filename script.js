(function () {
  'use strict';

  // Click-to-copy email
  var emailLink = document.querySelector('a[href^="mailto:"]');
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 1800);
  }

  if (emailLink && navigator.clipboard) {
    emailLink.addEventListener('click', function (e) {
      e.preventDefault();
      var email = emailLink.href.replace('mailto:', '');
      navigator.clipboard.writeText(email).then(function () {
        showToast('Email copied to clipboard');
      }).catch(function () {
        window.location.href = emailLink.href;
      });
    });
  }
})();
