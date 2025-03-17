function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
  for (const tab of tabs) {
    browser.tabs
      // .sendMessage(tab.id, {greeting: "Hi from background script"})
      // .then((response) => {
      //   console.log("Message from the content script:");
      //   console.log(response.response);
      // })
      .sendMessage(tab.id, {
        type: "get_playlist_duration",
      })
      .then((data) => {
        document.querySelector("#duration").innerText = data.duration;
      })
      .catch(onError);
  }
}

browser.tabs
  .query({
    currentWindow: true,
    active: true,
  })
  .then(sendMessageToTabs)
  .catch(onError);
