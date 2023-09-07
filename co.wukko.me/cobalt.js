const ua = navigator.userAgent.toLowerCase(),
  isIOS = ua.match("iphone os"),
  isMobile = ua.match("android") || ua.match("iphone os"),
  isSafari = ua.match("safari/"),
  isFirefox = ua.match("firefox/"),
  isOldFirefox =
    ua.match("firefox/") && ua.split("firefox/")[1].split(".")[0] < 103,
  version = 35,
  regex = new RegExp(
    /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
  ),
  notification = '<div class="notification-dot"></div>',
  switchers = {
    theme: ["auto", "light", "dark"],
    vCodec: ["h264", "av1", "vp9"],
    vQuality: ["1080", "max", "2160", "1440", "720", "480", "360"],
    aFormat: ["mp3", "best", "ogg", "wav", "opus"],
    dubLang: ["original", "auto"],
    vimeoDash: ["false", "true"],
    audioMode: ["false", "true"],
  },
  checkboxes = [
    "disableTikTokWatermark",
    "fullTikTokAudio",
    "muteAudio",
    "reduceTransparency",
    "disableAnimations",
    "disableMetadata",
  ],
  exceptions = { vQuality: "720" },
  bottomPopups = ["error", "download"];
let store = {};
function changeAPI(e) {
  return (apiURL = e), !0;
}
function eid(e) {
  return document.getElementById(e);
}
function sGet(e) {
  return localStorage.getItem(e);
}
function sSet(e, a) {
  localStorage.setItem(e, a);
}
function enable(e) {
  eid(e).dataset.enabled = "true";
}
function disable(e) {
  eid(e).dataset.enabled = "false";
}
function vis(e) {
  return e === 1 ? "visible" : "hidden";
}
function opposite(e) {
  return e === "true" ? "false" : "true";
}
function changeDownloadButton(e, a) {
  switch (e) {
    case 0:
      (eid("download-button").disabled = !0),
        sGet("alwaysVisibleButton") === "true"
          ? ((eid("download-button").value = a),
            (eid("download-button").style.padding = "0 1rem"))
          : ((eid("download-button").value = ""),
            (eid("download-button").style.padding = "0"));
      break;
    case 1:
      (eid("download-button").disabled = !1),
        (eid("download-button").value = a),
        (eid("download-button").style.padding = "0 1rem");
      break;
    case 2:
      (eid("download-button").disabled = !0),
        (eid("download-button").value = a),
        (eid("download-button").style.padding = "0 1rem");
      break;
  }
}
document.addEventListener("keydown", (e) => {
  e.key === "Tab" &&
    ((eid("download-button").value = ">>"),
    (eid("download-button").style.padding = "0 1rem"));
});
function button() {
  let e = regex.test(eid("url-input-area").value);
  eid("url-input-area").value.length > 0
    ? (eid("url-clear").style.display = "block")
    : (eid("url-clear").style.display = "none"),
    changeDownloadButton(e ? 1 : 0, ">>");
}
function clearInput() {
  (eid("url-input-area").value = ""), button();
}
function copy(e, a) {
  let t = document.getElementById(e);
  t.classList.add("text-backdrop"),
    setTimeout(() => {
      t.classList.remove("text-backdrop");
    }, 600),
    a
      ? navigator.clipboard.writeText(a)
      : navigator.clipboard.writeText(t.innerText);
}
async function share(e) {
  try {
    await navigator.share({ url: e });
  } catch {}
}
function detectColorScheme() {
  let e = "auto",
    a = sGet("theme");
  a ? (e = a) : window.matchMedia || (e = "dark"),
    document.documentElement.setAttribute("data-theme", e);
}
function changeTab(e, a, t) {
  let o = document.getElementsByClassName(`tab-content-${t}`),
    i = document.getElementsByClassName(`tab-${t}`);
  for (let r = 0; r < o.length; r++) o[r].dataset.enabled = "false";
  for (let r = 0; r < i.length; r++) i[r].dataset.enabled = "false";
  (e.currentTarget.dataset.enabled = "true"),
    (eid(a).dataset.enabled = "true"),
    a === "tab-about-changelog" &&
      sGet("changelogStatus") !== `${version}` &&
      notificationCheck("changelog"),
    a === "tab-about-about" && !sGet("seenAbout") && notificationCheck("about");
}
function expandCollapsible(e) {
  let a = e.currentTarget.parentNode.classList,
    t = "expanded";
  a.contains(t) ? a.remove(t) : a.add(t);
}
function notificationCheck(e) {
  let a = !0;
  switch (e) {
    case "about":
      sSet("seenAbout", "true");
      break;
    case "changelog":
      sSet("changelogStatus", version);
      break;
    default:
      a = !1;
  }
  ((a && sGet("changelogStatus") === `${version}`) || e === "disable") &&
    setTimeout(() => {
      (eid("about-footer").innerHTML = eid("about-footer").innerHTML.replace(
        notification,
        ""
      )),
        (eid("tab-button-about-changelog").innerHTML = eid(
          "tab-button-about-changelog"
        ).innerHTML.replace(notification, ""));
    }, 900),
    sGet("disableChangelog") !== "true" &&
      (!sGet("seenAbout") &&
        !eid("about-footer").innerHTML.includes(notification) &&
        (eid("about-footer").innerHTML = `${notification}${
          eid("about-footer").innerHTML
        }`),
      sGet("changelogStatus") !== `${version}` &&
        (eid("about-footer").innerHTML.includes(notification) ||
          (eid("about-footer").innerHTML = `${notification}${
            eid("about-footer").innerHTML
          }`),
        eid("tab-button-about-changelog").innerHTML.includes(notification) ||
          (eid("tab-button-about-changelog").innerHTML = `${notification}${
            eid("tab-button-about-changelog").innerHTML
          }`)));
}
function hideAllPopups() {
  let e = document.getElementsByClassName("popup");
  for (let a = 0; a < e.length; a++) e[a].classList.remove("visible");
  eid("popup-backdrop").classList.remove("visible"),
    (store.isPopupOpen = !1),
    (eid("picker-holder").innerHTML = ""),
    (eid("picker-download").href = "/"),
    eid("picker-download").classList.remove("visible");
}
function popup(e, a, t) {
  if (a === 1)
    switch ((hideAllPopups(), (store.isPopupOpen = !0), e)) {
      case "about":
        let o = sGet("seenAbout") ? "changelog" : "about";
        t && (o = t), eid(`tab-button-${e}-${o}`).click();
        break;
      case "settings":
        eid(`tab-button-${e}-video`).click();
        break;
      case "error":
        eid("desc-error").innerHTML = t;
        break;
      case "download":
        (eid("pd-download").href = t),
          eid("pd-copy").setAttribute("onClick", `copy('pd-copy', '${t}')`),
          eid("pd-share").setAttribute("onClick", `share('${t}')`),
          navigator.canShare && (eid("pd-share").style.display = "flex");
        break;
      case "picker":
        switch (t.type) {
          case "images":
            (eid("picker-title").innerHTML = loc.pickerImages),
              (eid("picker-subtitle").innerHTML = loc.pickerImagesExpl),
              eid("picker-holder").classList.remove("various"),
              (eid("picker-download").href = t.audio),
              eid("picker-download").classList.add("visible");
            for (let i in t.arr)
              eid(
                "picker-holder"
              ).innerHTML += `<a class="picker-image-container" ${
                isIOS
                  ? `onClick="share('${t.arr[i].url}')"`
                  : `href="${t.arr[i].url}" target="_blank"`
              }><img class="picker-image" src="${
                t.arr[i].url
              }" onerror="this.parentNode.style.display='none'"></img></a>`;
            break;
          default:
            (eid("picker-title").innerHTML = loc.pickerDefault),
              (eid("picker-subtitle").innerHTML = loc.pickerDefaultExpl),
              eid("picker-holder").classList.add("various");
            for (let i in t.arr)
              eid(
                "picker-holder"
              ).innerHTML += `<a class="picker-image-container" ${
                isIOS
                  ? `onClick="share('${t.arr[i].url}')"`
                  : `href="${t.arr[i].url}" target="_blank"`
              }><div class="picker-element-name">${
                t.arr[i].type
              }</div><div class="imageBlock"></div><img class="picker-image" src="${
                t.arr[i].thumb
              }" onerror="this.style.display='none'"></img></a>`;
            eid("picker-download").classList.remove("visible");
            break;
        }
        break;
      default:
        break;
    }
  else
    (store.isPopupOpen = !1),
      e === "picker" &&
        ((eid("picker-download").href = "/"),
        eid("picker-download").classList.remove("visible"),
        (eid("picker-holder").innerHTML = ""));
  bottomPopups.includes(e) &&
    eid(`popup-${e}-container`).classList.toggle("visible"),
    eid("popup-backdrop").classList.toggle("visible"),
    eid(`popup-${e}`).classList.toggle("visible"),
    eid(`popup-${e}`).focus();
}
function changeSwitcher(e, a) {
  if (a) {
    switchers[e].includes(a) || (a = switchers[e][0]), sSet(e, a);
    for (let t in switchers[e])
      switchers[e][t] === a
        ? enable(`${e}-${a}`)
        : disable(`${e}-${switchers[e][t]}`);
    e === "theme" && detectColorScheme();
  } else {
    let t = switchers[e][0];
    isMobile && exceptions[e] && (t = exceptions[e]), sSet(e, t);
    for (let o in switchers[e])
      switchers[e][o] === t
        ? enable(`${e}-${t}`)
        : disable(`${e}-${switchers[e][o]}`);
  }
}
function checkbox(e) {
  switch ((sSet(e, !!eid(e).checked), e)) {
    case "alwaysVisibleButton":
      button();
      break;
    case "reduceTransparency":
      eid("cobalt-body").classList.toggle("no-transparency");
      break;
    case "disableAnimations":
      eid("cobalt-body").classList.toggle("no-animation");
      break;
  }
  e === "disableChangelog" && sGet(e) === "true"
    ? notificationCheck("disable")
    : notificationCheck();
}
function loadSettings() {
  sGet("alwaysVisibleButton") === "true" &&
    ((eid("alwaysVisibleButton").checked = !0),
    (eid("download-button").value = ">>"),
    (eid("download-button").style.padding = "0 1rem")),
    sGet("downloadPopup") === "true" &&
      !isIOS &&
      (eid("downloadPopup").checked = !0),
    (sGet("reduceTransparency") === "true" || isOldFirefox) &&
      eid("cobalt-body").classList.toggle("no-transparency"),
    sGet("disableAnimations") === "true" &&
      eid("cobalt-body").classList.toggle("no-animation");
  for (let e = 0; e < checkboxes.length; e++)
    sGet(checkboxes[e]) === "true" && (eid(checkboxes[e]).checked = !0);
  for (let e in switchers) changeSwitcher(e, sGet(e));
}
function changeButton(e, a) {
  switch (e) {
    case 0:
      (eid("url-input-area").disabled = !1),
        (eid("url-clear").style.display = "block"),
        changeDownloadButton(2, "!!"),
        popup("error", 1, a),
        setTimeout(() => {
          changeButton(1);
        }, 2500);
      break;
    case 1:
      changeDownloadButton(1, ">>"),
        (eid("url-clear").style.display = "block"),
        (eid("url-input-area").disabled = !1);
      break;
    case 2:
      popup("error", 1, a),
        changeDownloadButton(1, ">>"),
        (eid("url-clear").style.display = "block"),
        (eid("url-input-area").disabled = !1);
      break;
  }
}
function internetError() {
  (eid("url-input-area").disabled = !1),
    changeDownloadButton(2, "!!"),
    setTimeout(() => {
      changeButton(1);
    }, 2500),
    popup("error", 1, loc.noInternet);
}
function resetSettings() {
  localStorage.clear(), window.location.reload();
}
async function pasteClipboard() {
  try {
    let e = await navigator.clipboard.readText();
    regex.test(e) &&
      ((eid("url-input-area").value = e),
      download(eid("url-input-area").value));
  } catch (e) {
    let a = loc.featureErrorGeneric,
      t = !0,
      o = String(e).toLowerCase();
    o.includes("denied") && (a = loc.clipboardErrorNoPermission),
      (o.includes("dismissed") || isIOS) && (t = !1),
      o.includes("function") && isFirefox && (a = loc.clipboardErrorFirefox),
      t && popup("error", 1, a);
  }
}
async function download(e) {
  changeDownloadButton(2, "..."),
    (eid("url-clear").style.display = "none"),
    (eid("url-input-area").disabled = !0);
  let a = {
    url: encodeURIComponent(e.split("&")[0].split("%")[0]),
    aFormat: sGet("aFormat").slice(0, 4),
    dubLang: !1,
  };
  (sGet("dubLang") === "auto" || sGet("dubLang") === "custom") &&
    (a.dubLang = !0),
    sGet("vimeoDash") === "true" && (a.vimeoDash = !0),
    sGet("audioMode") === "true"
      ? ((a.isAudioOnly = !0),
        (a.isNoTTWatermark = !0),
        sGet("fullTikTokAudio") === "true" && (a.isTTFullAudio = !0))
      : ((a.vQuality = sGet("vQuality").slice(0, 4)),
        sGet("muteAudio") === "true" && (a.isAudioMuted = !0),
        (e.includes("youtube.com/") || e.includes("/youtu.be/")) &&
          (a.vCodec = sGet("vCodec").slice(0, 4)),
        (e.includes("tiktok.com/") || e.includes("douyin.com/")) &&
          sGet("disableTikTokWatermark") === "true" &&
          (a.isNoTTWatermark = !0)),
    sGet("disableMetadata") === "true" && (a.disableMetadata = !0);
  let t = await fetch(`${apiURL}/api/json`, {
    method: "POST",
    body: JSON.stringify(a),
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  })
    .then((o) => o.json())
    .catch((o) => !1);
  if (!t) {
    internetError();
    return;
  }
  if (t && t.status !== "error" && t.status !== "rate-limit")
    switch (
      (t.text &&
        (!t.url || !t.picker) &&
        (t.status === "success"
          ? changeButton(2, t.text)
          : changeButton(0, loc.noURLReturned)),
      t.status)
    ) {
      case "redirect":
        changeDownloadButton(2, ">>>"),
          setTimeout(() => {
            changeButton(1);
          }, 1500),
          sGet("downloadPopup") === "true"
            ? popup("download", 1, t.url)
            : window.open(t.url, "_blank");
        break;
      case "picker":
        t.audio && t.picker
          ? (changeDownloadButton(2, ">>>"),
            popup("picker", 1, {
              audio: t.audio,
              arr: t.picker,
              type: t.pickerType,
            }),
            setTimeout(() => {
              changeButton(1);
            }, 2500))
          : t.picker
          ? (changeDownloadButton(2, ">>>"),
            popup("picker", 1, { arr: t.picker, type: t.pickerType }),
            setTimeout(() => {
              changeButton(1);
            }, 2500))
          : changeButton(0, loc.noURLReturned);
        break;
      case "stream":
        changeDownloadButton(2, "?.."),
          fetch(`${t.url}&p=1`)
            .then(async (o) => {
              let i = await o.json();
              i.status === "continue"
                ? (changeDownloadButton(2, ">>>"),
                  isMobile || isSafari
                    ? (window.location.href = t.url)
                    : window.open(t.url, "_blank"),
                  setTimeout(() => {
                    changeButton(1);
                  }, 2500))
                : changeButton(0, i.text);
            })
            .catch((o) => internetError());
        break;
      case "success":
        changeButton(2, t.text);
        break;
      default:
        changeButton(0, loc.unknownStatus);
        break;
    }
  else t && t.text && changeButton(0, t.text);
}
async function loadCelebrationsEmoji() {
  let e = eid("about-footer").innerHTML;
  try {
    let a = await fetch("/onDemand?blockId=1")
      .then((t) => (t.status === 200 ? t.json() : !1))
      .catch(() => !1);
    a &&
      a.status === "success" &&
      a.text &&
      (eid("about-footer").innerHTML = eid("about-footer").innerHTML.replace(
        '<img class="emoji" draggable="false" height="22" width="22" alt="🐲" src="emoji/dragon_face.svg" loading="lazy">',
        a.text
      ));
  } catch {
    eid("about-footer").innerHTML = e;
  }
}
async function loadOnDemand(e, a) {
  let t = {};
  (store.historyButton = eid(e).innerHTML),
    (eid(e).innerHTML = '<div class="loader">...</div>');
  try {
    if (
      (store.historyContent
        ? (t = store.historyContent)
        : await fetch(`/onDemand?blockId=${a}`)
            .then(async (o) => {
              if (((t = await o.json()), t && t.status === "success"))
                store.historyContent = t;
              else throw new Error();
            })
            .catch(() => {
              throw new Error();
            }),
      t.text)
    )
      eid(
        e
      ).innerHTML = `<button class="switch bottom-margin" onclick="restoreUpdateHistory()">${loc.collapseHistory}</button>${t.text}`;
    else throw new Error();
  } catch {
    (eid(e).innerHTML = store.historyButton), internetError();
  }
}
function restoreUpdateHistory() {
  eid("changelog-history").innerHTML = store.historyButton;
}
(window.onload = () => {
  loadSettings(),
    detectColorScheme(),
    changeDownloadButton(0, ">>"),
    notificationCheck(),
    loadCelebrationsEmoji(),
    isIOS &&
      (sSet("downloadPopup", "true"),
      (eid("downloadPopup-chkbx").style.display = "none")),
    (eid("url-input-area").value = ""),
    (eid("home").style.visibility = "visible"),
    eid("home").classList.toggle("visible");
  let e = new URLSearchParams(window.location.search).get("u");
  e !== null && regex.test(e) && ((eid("url-input-area").value = e), button());
}),
  eid("url-input-area").addEventListener("keydown", (e) => {
    button();
  }),
  eid("url-input-area").addEventListener("keyup", (e) => {
    e.key === "Enter" && eid("download-button").click();
  }),
  (document.onkeydown = (e) => {
    store.isPopupOpen
      ? e.key === "Escape" && hideAllPopups()
      : ((e.ctrlKey || e.key === "/") && eid("url-input-area").focus(),
        (e.key === "Escape" || e.key === "Clear") && clearInput(),
        e.key === "D" && pasteClipboard(),
        e.key === "K" && changeSwitcher("audioMode", "false"),
        e.key === "L" && changeSwitcher("audioMode", "true"),
        e.key === "B" && popup("about", 1, "about"),
        e.key === "N" && popup("about", 1, "changelog"),
        e.key === "M" && popup("settings", 1));
  });
