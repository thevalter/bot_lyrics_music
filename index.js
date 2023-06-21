const pup = require('puppeteer');
const readLineSync = require('readline-sync');
const fs = require('fs');
console.log('Bem vindo ao seu botzinho para encontrar letras de musicas!');
const url = 'https://genius.com/';

async function bot() {
    const searchFor = readLineSync.question('digite o nome do artista seguido da musica que deseja pesquisar (evite usar caracteres especiais): ');
    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    console.log('buscando...')
    await page.goto(url);
    await page.waitForSelector('input[name="q"]');
    await page.type('input[name="q"]', searchFor);
    await page.click('.PageHeaderSearchdesktop__Icon-eom9vk-1');
    await page.waitForNavigation();
    await page.click('search-result-item mini-song-card a');
    await page.waitForNavigation();
    console.log('prontinho!');
    const result = await page.$$eval('[data-lyrics-container="true"]', el => el.map(lt => lt.innerText));
    const resultFormated = result.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    console.log(resultFormated);
    console.log('');
    console.log('');
    const saved = readLineSync.question('Deseja salvar o arquivo (yes/no)? ');
    if (saved == 'yes') {
        fs.writeFile(`./lyrics_sources/${searchFor}.txt`, resultFormated, err => {
            if (err) throw new Error('error! cannot be saved or found.');
            return console.log('Arquivo(s) salvo!');
        });
    };
    const newSearch = readLineSync.question('Deseja fazer uma nova pesquisa (yes/no)? ');
    if (newSearch == 'yes') {
        bot();
    };
    await browser.close();
};

bot();
