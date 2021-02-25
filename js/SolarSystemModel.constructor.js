'use strict';

class SolarSystemModel {
	
	constructor () {
		this.registerConstants();
		this.registerPlanets();
		this.starsRender();
		this.renderPlanets();
	}

	starsRender () {
  		let colorsRange = ['#a3fd75', '#ff7fd9', '#ccc0f5', '#ccc0f5'],
  			stars = [];

		for (let i=0; i < this.CONSTANTS.starsNumber; i++) {
			let rcolor = Math.floor(Math.random() * 4);

			stars[i] = document.createElement('div');
			stars[i].className = 'stars';
			stars[i].style.borderBottomColor = colorsRange[rcolor];
			stars[i].style.left = Math.floor(Math.random() * this.CONSTANTS.clientScreenWidth)+"px";
			stars[i].style.bottom = Math.floor(Math.random() * this.CONSTANTS.clientScreenHeight)+"px";

			this.CONSTANTS.starsContainer.appendChild(stars[i]);  
		}
	}

	animatePlanet (id, distanceToSun, coefX, coefY, c, speed, planet, angle) {
		let s = 2 * this.CONSTANTS.PI/180,
			dotCount = 0

        setInterval(() => {
            angle -= s;
            dotCount++;
            planet.style.left =  50 * (c + coefX * Math.sin(angle)) + this.CONSTANTS.sunSizeInPx/2 + 'px'; //this.CONSTANTS.sunSizeInPx/2  +
            planet.style.bottom =  50 * (coefY * Math.cos(angle)) + this.CONSTANTS.sunSizeInPx/2  + 'px';

            if (!id.includes('asteroid')) {
                this.createPlanetOrbit(dotCount, planet, id);
            }
        }, speed);

	}

	createPlanetOrbit (dotCount, planet, id) {
		if (dotCount % 2 === 0 && dotCount < this.CONSTANTS.fullCircleDegrees) {
    		let d = document.createElement('div');

            d.className = "dots";
            d.style.left = Number.parseInt(planet.style.left.replace('px', ''), 10) - 0 + 'px';
            d.style.bottom = Number.parseInt(planet.style.bottom.replace('px', ''), 10) - 0 + 'px';

			this.CONSTANTS.orbitsContainer.appendChild(d);  
	    }
	}

    sample_from_normal_distribution(mean, std) {
        let u = 0, v = 0, z = 0;
        while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return  z * std + mean;
    }

	renderPlanets () {
		this.planets = this.planets.sort((a, b) => {return a.speed < b.speed});
		
		this.planets.forEach((planet) => {
			this.animatePlanet(planet.id, planet.distanceToSun, planet.coefX, planet.coefY, planet.c,  planet.speed, document.getElementById(planet.id), 0);
		});

        for (let i = 0; i < 720; i++) {
            let delta = this.sample_from_normal_distribution(1.2, 0.5),
                aster = document.createElement('div');
            aster.className = "asteroids";
            aster.id = 'asteroid' + i;
            aster.bottom =  this.CONSTANTS.sunBottomPosition + 2*this.CONSTANTS.PI/i*this.asteroidBelt[0].distanceToSun * 50 +  "px";
			aster.left = this.CONSTANTS.sunLeftPosition + 2*this.CONSTANTS.PI/i*this.asteroidBelt[0].distanceToSun * 50  + "px";
			this.CONSTANTS.asteroidsContainer.appendChild(aster);
            this.animatePlanet(this.asteroidBelt[0].id, this.asteroidBelt[0].distanceToSun, this.asteroidBelt[0].coefX + delta, this.asteroidBelt[0].coefY + delta, this.asteroidBelt[0].c,  this.asteroidBelt[0].speed, aster, i);
        }

	}

	registerConstants () {
		this.CONSTANTS = {
			clientScreenHeight: document.documentElement.clientHeight-25,
			clientScreenWidth: document.documentElement.clientWidth-25,
			screenHeight: document.documentElement.clientHeight/2-55,
			orbitsContainer: document.getElementById('dotsMain'),
			starsContainer: document.getElementById('mainStars'),
			planetStartPosition: 30,
			fullCircleDegrees: 360,
			starsNumber: 250,
			PI: Math.PI,
			sunBottomPosition: document.documentElement.clientHeight * 0.56,
            sunLeftPosition:  document.documentElement.clientWidth * 0.48,
            sunSizeInPx: 30,
            uranCoef: 1.5,
            neptunCoef: 2,
            asteroidsAroundMinOrbit: 100,
            asteroidsAroundMaxOrbit: 100,
            asteroidsContainer: document.getElementById('asteroids'),
		};
		console.log(this.CONSTANTS)
	}

	registerPlanets () {
		this.planets = [
			{distanceToSun: 0.4, coefX: 0.387, coefY: 0.3788, c: 0.0796, speed: 10, id: 'mercury'},
			{distanceToSun: 0.7, coefX: 0.7219, coefY: 0.7219, c: 0.0049, speed: 18, id: 'venus'},
			{distanceToSun: 1, coefX: 1.0027, coefY: 1.0025, c: 0.0167, speed: 40, id: 'earth'},
			{distanceToSun: 1.5, coefX: 1.5241, coefY: 1.5173, c: 0.1424, speed: 40, id: 'mars'},
        	{distanceToSun: 5.2, coefX: 5.2073, coefY: 5.2010, c: 0.2520, speed: 50, id: 'jupiter'},
			{distanceToSun: 9.6, coefX: 9.5590, coefY: 9.5231, c: 0.5181, speed: 60, id: 'saturn'},
			{distanceToSun: 19.2, coefX: 19.1848/this.CONSTANTS.uranCoef, coefY: 19.1645/this.CONSTANTS.uranCoef, c: 0.9055/this.CONSTANTS.uranCoef, speed: 400, id: 'uran'},
            {distanceToSun: 30, coefX: 30.0806/this.CONSTANTS.neptunCoef, coefY: 30.0788/this.CONSTANTS.neptunCoef, c: 0.2587/this.CONSTANTS.neptunCoef, speed: 800, id: 'neptun'}
		];
		this.asteroidBelt = [
		    {distanceToSun: 2.2, coefX: 2.2, coefY: 2.2, c: 0, speed: 70, id: 'asteroidMin'},
		    {distanceToSun: 3.2, coefX: 3.2, coefY: 3.2, c: 0, speed: 70, id: 'asteroidMax'},
		]
	}
}