// Physico Edvance — public site JS
document.addEventListener('DOMContentLoaded', function () {
  // Auto-dismiss alerts after 5s
  document.querySelectorAll('.alert').forEach(function (alert) {
    setTimeout(function () {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) bsAlert.close();
    }, 5000);
  });
});
