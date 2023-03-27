let deferredPrompt;
function handleBeforeInstallPrompt(event, showInstallPrompt, setShowInstallPrompt) {
    // Prevent the default behavior of the event
    event.preventDefault();

    // Stash the event so it can be triggered later.
    deferredPrompt = event;

    // Set showInstallPrompt to true
    setShowInstallPrompt(true);
  }  

function installApp(setShowInstallPrompt) {
  // Hide the custom install prompt
  const installPrompt = document.querySelector('.install-prompt');
  installPrompt.style.display = 'none';

  // Trigger the deferredPrompt event
  deferredPrompt.prompt();

  // Wait for the user to respond to the install prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }

    // Reset the deferredPrompt variable
    deferredPrompt = null;
  });
  setShowInstallPrompt(false);
}

function cancelInstall(setShowInstallPrompt) {
  // Hide the custom install prompt
  const installPrompt = document.querySelector('.install-prompt');
  installPrompt.style.display = 'none';

  // Reset the deferredPrompt variable
  deferredPrompt = null;
  setShowInstallPrompt(false);
}
export { handleBeforeInstallPrompt, installApp, cancelInstall };