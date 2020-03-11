// for (const key in document) {
//   console.log('key', key);
//   console.log('value', document[key]);
// }

chrome.runtime.sendMessage({
  location: document.location
}, (response) => {
  if (response) {
    window.onload = function() {
      const QRcode = document.querySelector('.qr_code_pc');
      console.log('QRcode: ', QRcode);
      const Container = document.querySelector('.rich_media_area_primary_inner');
      console.log('Container: ', Container);
      QRcode.style = 'display:none;';
      Container.style  = 'max-width: 1377px;'
    }
  }
});
