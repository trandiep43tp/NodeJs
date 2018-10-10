// const puppeteer = require('puppeteer');

// (async () => {

//     // Mở trình duyệt mới và tới trang của kenh14
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//  // page.setViewport({ width: 1280, height:720 });
//   await page.goto('http://kenh14.vn', { waitUntil: 'networkidle2' });
//   //await page.screenshot({path: 'kenh14.png'});

//    // Chạy đoạn JavaScript trong hàm này, đưa kết quả vào biến article
// //    const articles = await page.evaluate(() => {
// //         let titleLinks = document.querySelectorAll('h3.knswli-title > a');
// //         titleLinks = [...titleLinks];
// //         let articles = titleLinks.map(link => ({
// //             title: link.getAttribute('title'),
// //             url: link.getAttribute('href')
// //         }));
// //         return articles;
// //     });

// // In ra kết quả và đóng trình duyệt
// console.log(articles);

//   await browser.close();
// })();


const puppeteer = require('puppeteer');
const download = require('image-downloader');

(async() => {
    const browser = await puppeteer.launch();
    console.log('Browser openned');
    const page = await browser.newPage();
    const url = 'http://kenh14.vn/ai-roi-cung-khac-cac-hot-girl-nay-cung-khong-ngoai-le-khi-vong-1-cu-ngay-cang-phong-phao-20171207193958533.chn';
    await page.goto(url);
    console.log('Page loaded');

    const imgLinks = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('.sp-img-zoom > img, .sp-img-lightbox > img, .detail-img-lightbox > img');
        imgElements = [...imgElements];
        let imgLinks = imgElements.map(i => i.getAttribute('src'));
        return imgLinks;
    });
    console.log(imgLinks);

    // Tải các ảnh này về thư mục hiện tại
    await Promise.all(imgLinks.map(imgUrl => download.image({
        url: imgUrl,
        dest: __dirname
    })));

    await browser.close();
})();