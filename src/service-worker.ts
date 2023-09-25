// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// This is a chrome extension service worker, it has some similarities to a web service worker.
// It cannot access the DOM, it can access the chrome.tabs API.
// The purpose of this worker is to give content-script.js access to the chrome.tabs API.

const GREENLY_SAAS_URL = 'carbon.greenly.earth'

async function getOpenGreenlyTabs():Promise<chrome.tabs.Tab[]> {
  const allTabs = await chrome.tabs.query({ url: "<all_urls>" });
  return allTabs.filter((tab) => tab.url?.includes(GREENLY_SAAS_URL));
}

function findTabByURL(openTabs: chrome.tabs.Tab[], url: URL) {
  return openTabs.find((tab) => {
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

  console.log('RetoolQuickOpen: tab exists, navigate to it.')
  chrome.tabs.update(tab.id, {
    active: true,
  });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (!changeInfo.url.includes(GREENLY_SAAS_URL)) {
      return
    }
    
    if (tab.pendingUrl === tab.url) {
      return
    }
    const openTabs = await getOpenGreenlyTabs()
    console.log(`RetoolQuickOpen: looking for tab with URL ${changeInfo.url}...`)

    const targetTab = findTabByURL(openTabs, new URL(changeInfo.url))

    if (targetTab) {
      if (targetTab.id === tabId) {
        return
      }
      console.log(`RetoolQuickOpen: tab found! ${targetTab.id}`)
      await navigateToTab(targetTab)
    }
  }
})
