// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// This is a chrome extension service worker, it has some similarities to a web service worker.
// It cannot access the DOM, it can access the chrome.tabs API.
// The purpose of this worker is to give content-script.js access to the chrome.tabs API.

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
