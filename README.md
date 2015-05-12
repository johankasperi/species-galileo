# Species Intel Galileo
Repo for the Intel Galileo code in project 2 in INFO490 at UIUC. This project is called "Species" where you can interact with small "Species"-circuits using an iOS application. [Please click here to get more information.](https://junokas.wordpress.com/intel-galileo-board-exploration-ii-audio-interactions-with-feedback-ecologies/)

## Wiring
The program is sending voltage to digital pin 9, 10 and 11. Preferably you will connect a "Specie"-circuit to at least one of these pins but you could connect anything, for example a LED.

## Run instructions

Change line 3 to the url of your server (if you don't want to use the provided server):
```javascript
var socket = io('http://species-kspri.rhcloud.com');
```

Install node modules:
```bash
npm install
```

Run:
```bash
node app.js
```

If you don't have a Intel Galileo, you can run a virtual version of the program on your local environment with:
```bash
node app_noboard.js
```

## Dependencies
Express, socket.io, mraa and underscore. Check package.json.

## Credits
Created by [Johan Kasperi](http://kasperi.se), [Mike Junokas](https://junokas.wordpress.com) and [Aileen Bai](http://issuu.com/aileenbai/docs/aileen_bai_portfolio_05a83c8985e264).