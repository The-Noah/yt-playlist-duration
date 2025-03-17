function formatSeconds(input) {
  const hours = Math.floor(input / 3600);
  const minutes = Math.floor((input % 3600) / 60);
  const seconds = input % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function calculatePlaylistLength(totalVideos) {
  const elements = new Set(
    document.querySelectorAll(
      "div#primary div#contents ytd-playlist-video-list-renderer ytd-thumbnail-overlay-time-status-renderer .ytd-thumbnail-overlay-time-status-renderer .badge-shape-wiz--thumbnail-badge > .badge-shape-wiz__text"
    )
  );

  if (elements.length < totalVideos) {
    setTimeout(calculatePlaylistLength, 100);
    return;
  }

  let total = 0;

  for (const element of elements) {
    const duration = element.innerText;

    const parts = duration
      .split(":")
      .reverse()
      .map((duration) => +duration);

    total += parts[0];

    if (!isNaN(parts[1])) {
      total += parts[1] * 60;
    }

    if (!isNaN(parts[2])) {
      total += parts[2] * 3600;
    }
  }

  if (document.getElementById("yt-playlist-duration")) {
    document.getElementById("yt-playlist-duration").innerText = formatSeconds(total);
  } else {
    // const element = document.createElement("yt-formatted-string");
    const element = document.createElement("span");

    element.id = "yt-playlist-duration";
    element.classList.add("byline-item");
    element.classList.add("style-scope");
    element.classList.add("ytd-playlist-byline-renderer");

    element.innerText = formatSeconds(total);

    document.querySelector(".metadata-stats").appendChild(element);
  }

  return `${elements.size} videos: ${formatSeconds(total)}`;
}

function findVideoCount() {
  const element = document.querySelector(".metadata-stats .style-scope.yt-formatted-string:first-child");

  if (!element) {
    setTimeout(findVideoCount, 100);
    return;
  }

  return calculatePlaylistLength(parseInt(element.innerText));
}

function handleMessage(message, sender, sendResponse) {
  if (message.type === "get_playlist_duration") {
    sendResponse({
      duration: findVideoCount(),
    });
  }
}

browser.runtime.onMessage.addListener(handleMessage);

setInterval(() => {
  findVideoCount();
}, 1000);
