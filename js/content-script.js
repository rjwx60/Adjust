// for (const key in document) {
//   console.log('key', key);
//   console.log('value', document[key]);
// }

chrome.runtime.sendMessage({
  location: document.location
}, (response) => {
  if (response) {
    window.onload = function() {
      switch(response) {
        case 'wx':
          const QRcode = document.querySelector('.qr_code_pc');
          // console.log('QRcode: ', QRcode);
          const Container = document.querySelector('.rich_media_area_primary_inner');
          // console.log('Container: ', Container);
          QRcode.style = 'display:none;';
          Container.style  = 'max-width: 1377px;'
          break;
        case 'juejin':
          const MainContainer = document.querySelector('main.container');
          MainContainer.style.maxWidth = '1260px';
          const MainArea = document.querySelector('.main-area');
          MainArea.style.width = '1200px';
          const InfoBar = document.querySelector('.article-suspended-panel'); 
          InfoBar.style.right = '30px';
          const SideBar = document.querySelector('.sidebar');
          SideBar.style.left = '10px';
          SideBar.style.position = 'fixed';
          const SideBarList = document.querySelectorAll('.sidebar-block');
          SideBarList.forEach((cv, index, nodeList) => {
            if(!(/catalog-block.pure/.test(cv.className))) {
              cv.style.display = 'none';
            }
          });
          document.querySelectorAll('p').forEach(cv => {cv.style.margin = '0px'})
          document.querySelectorAll('h3').forEach(cv => {cv.style.margin = '0px'})
          document.querySelectorAll('h4').forEach(cv => {cv.style.margin = '0px'})
          break;
        default:
          break;
      }
    }
  }
});
