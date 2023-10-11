// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// This is a chrome extension service worker, it has some similarities to a web service worker.
// It cannot access the DOM, it can access the chrome.tabs API.
// The purpose of this worker is to give content-script.js access to the chrome.tabs API.

const segmentUrl = 'https://api.segment.io/v1/track'
const segmentAuthToken = 'V3QwTmJadUI2bEczaXB1UmRpRFRXVDNveG5NeVZnR1E6'
const segmentUserId = 'Greenly Demo Companion'
const GREENLY_SAAS_URL = 'carbon.greenly.earth'

async function getOpenGreenlyTabs():Promise<chrome.tabs.Tab[]> {
  const allTabs = await chrome.tabs.query({ url: `https://${GREENLY_SAAS_URL}/*` });
  return allTabs.filter((tab) => tab.url?.includes(GREENLY_SAAS_URL));
}

function findTabByURL(openTabs: chrome.tabs.Tab[], url: URL, excludeId: number) {
  return openTabs
    .filter(t => t.id !== excludeId)
    .find((tab) => {
      const tabUrl = new URL(tab.url ? tab.url : '');
      return tabUrl.hostname === url.hostname && tabUrl.pathname === url.pathname;
    });
}

async function navigateToTab(tab: chrome.tabs.Tab): Promise<void> {
  if (!tab.id) {
    console.error(`Unable to open tab with no id`)
    return
  }
  try {
    await chrome.tabs.get(tab.id);
  } catch (e) {
    console.error(e);
    return
  }

  console.log('GreenlyDemoCompanion: tab exists, navigate to it.')
  chrome.tabs.update(tab.id, {
    active: true,
  });
  await chrome.windows.update(tab.windowId, { focused: true });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const openTabs = await getOpenGreenlyTabs()
    console.log(`GreenlyDemoCompanion: looking for tab with URL ${changeInfo.url}...`)

    const targetTab = findTabByURL(openTabs, new URL(changeInfo.url), tabId)

    if (targetTab) {
      console.log(`GreenlyDemoCompanion: tab found! ${targetTab.id}`)
      await navigateToTab(targetTab)
      await chrome.scripting.executeScript({target: {tabId}, func: () => { window.stop(); history.back() }, injectImmediately: true})
    }
  }
})

chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.event) {
      const res = await sendEventToSegment(request.event)
      if (!res) {
        sendResponse({result: 'request aborted'})
        return
      }
      const jsonRes = await res.json();
      console.log(jsonRes)
      sendResponse({result: jsonRes});
    }
    sendResponse({result: 'unknown request'})
  }
);

async function sendEventToSegment (event: string) {
  console.log(`Sending event to Segment.io: ${event}`)
  const headers = new Headers()
  headers.append('Authorization', `Basic ${segmentAuthToken}`);
  headers.append('Content-Type', 'application/json');
  try {
    return await fetch(segmentUrl, {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: "include",
      body: JSON.stringify({
        userId: segmentUserId,
        event,
        properties: {
          name: event,
          from: 'Chrome Extension'
        }
      })
    })
  } catch (error) {
    console.error(error)
  } 
}