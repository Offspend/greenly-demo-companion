const pageURLs = [
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Company%20Information/Greenly%20-%20Data%20-%20Company%20Information?_embed=true&_environment=prod-auth0',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Dashboard/Greenly%20-%20Dashboard?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Building/Buildings?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Employees/Employees?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20File%20Uploader/Greenly%20-%20Data%20-%20File%20Uploader?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Connectors/Connectors?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Expense%20Data/%5BB2B%5D%20Expenses%20data?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Data%20-%20Activity%20Data/Greenly%20-%20Data%20-%20Activity%20Data?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Analytics/My%20Emissions%20Analytics%20-%20With%20Calculation%20Method?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Analytics/%5BB2B%5D%20Advanced%20Analytics?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Analytics/Create%20My%20Dashboards?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Action%20Plans/Action%20Plan?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Offset/Offset%20Projects%20List?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Supplier%20engagement/Greenly%20-%20Suppliers%20-%20Supplier%20Engagement?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Supplier%20engagement/Greenly%20-%20Suppliers%20-%20My%20Suppliers?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Supplier%20engagement/Greenly%20-%20Suppliers%20-%20Scoring%20Analytics?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Export/Greenly%20-%20Export?_embed=true',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20App%20Store/Climate%20App%20Store?_embed=true#language=',
  'https://carbon.greenly.earth/apps/Client%20App%20-%20Settings/Greenly%20-%20Settings?_embed=true#currentView=0',
];

const openTabs = async () => {
  pageURLs.forEach(url => chrome.tabs.create({url}))
}

const setupBtn = document.getElementById('btn-setup');

if (!setupBtn) {
  throw new Error('Unable to find the "Setup Demo" button, there is something wrong in the popup.');
}

setupBtn.addEventListener('click', openTabs)