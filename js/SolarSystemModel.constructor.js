'use strict';

class SolarSystemModel {
	
	constructor () {
		this.registerConstants();
		this.registerPlanets();
		this.starsRender();
		this.renderPlanets();
		this.renderAsteroids();
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

	animate(id, semiMajorAxis, semiMinorAxis, centerToFocus, speed, planet, angle) {
		let s = 2 * this.CONSTANTS.PI/(180*semiMajorAxis),
			dotCount = 0

        setInterval(() => {
            angle -= s; // move counterclockwise
            dotCount++;
            planet.style.left =  this.CONSTANTS.astronomicalUnitsToPx * (centerToFocus + semiMajorAxis * Math.sin(angle)) + this.CONSTANTS.sunSizeInPx/2 + 'px';
            planet.style.bottom =  this.CONSTANTS.astronomicalUnitsToPx * (semiMinorAxis * Math.cos(angle)) + this.CONSTANTS.sunSizeInPx/2  + 'px';

            //if (!id.includes('asteroid')) {
                //this.createPlanetOrbit(dotCount, planet, id);
            //}
        }, speed/semiMajorAxis);

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
        while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return  z * std + mean;
    }

    sample_from_rayleigh_distribution (sigma) {
        return sigma * Math.sqrt(-2 * Math.log(Math.random()))
    }

	renderPlanets () {
		this.planets = this.planets.sort((a, b) => {return a.speed < b.speed});
		
		this.planets.forEach((planet) => {
			this.animate(planet.id, planet.semiMajorAxis, planet.semiMinorAxis, planet.centerToFocus,  planet.speed, document.getElementById(planet.id), 90);
		});
	}

	renderAsteroids () {
	    this.mainAsteroidBelt.forEach(asteroidClass => this.renderMainAsteroidBelt(asteroidClass));
	}

    renderMainAsteroidBelt (asteroidClassInfo) {
        for (let i = 0; i < asteroidClassInfo.number; i++) {
            let eccentricity = this.sample_from_rayleigh_distribution(asteroidClassInfo.rayleighSigma),
                semiMajorAxis = this.sample_from_normal_distribution((asteroidClassInfo.maxSemiMajorAxis - asteroidClassInfo.minSemiMajorAxis)/2,
                (asteroidClassInfo.maxSemiMajorAxis - asteroidClassInfo.minSemiMajorAxis)/2)
                 + asteroidClassInfo.minSemiMajorAxis,
                semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity),
                aster = document.createElement('div');

            aster.className = "asteroids";
            aster.id = 'asteroid' + i;
            aster.bottom =  this.CONSTANTS.sunBottomPosition + 2*this.CONSTANTS.PI/(i * semiMajorAxis) +  "px";
			aster.left = this.CONSTANTS.sunLeftPosition + 2*this.CONSTANTS.PI/(i * semiMajorAxis)  + "px";

			this.CONSTANTS.asteroidsContainer.appendChild(aster);

            this.animate(asteroidClassInfo.id, semiMajorAxis, semiMinorAxis, eccentricity*semiMajorAxis, asteroidClassInfo.speed, aster, i);
        }
	}

	registerConstants () {
		this.CONSTANTS = {
		    astronomicalUnitsToPx: 50,
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
            asteroidsPerClass: 300,
            asteroidsContainer: document.getElementById('asteroids'),
		};
		console.log(this.CONSTANTS)
	}

	registerPlanets () {
		this.planets = [
			{distanceToSun: 0.4, semiMajorAxis: 0.387, semiMinorAxis: 0.3788, centerToFocus: 0.0796, speed: 10, id: 'mercury'},
			{distanceToSun: 0.7, semiMajorAxis: 0.7219, semiMinorAxis: 0.7219, centerToFocus: 0.0049, speed: 18, id: 'venus'},
			{distanceToSun: 1, semiMajorAxis: 1.0027, semiMinorAxis: 1.0025, centerToFocus: 0.0167, speed: 40, id: 'earth'},
			{distanceToSun: 1.5, semiMajorAxis: 1.5241, semiMinorAxis: 1.5173, centerToFocus: 0.1424, speed: 40, id: 'mars'},
        	{distanceToSun: 5.2, semiMajorAxis: 5.2073, semiMinorAxis: 5.2010, centerToFocus: 0.2520, speed: 50, id: 'jupiter'},
			{distanceToSun: 9.6, semiMajorAxis: 9.5590, semiMinorAxis: 9.5231, centerToFocus: 0.5181, speed: 60, id: 'saturn'},
			{distanceToSun: 19.2, semiMajorAxis: 19.1848/this.CONSTANTS.uranCoef, semiMinorAxis: 19.1645/this.CONSTANTS.uranCoef, centerToFocus: 0.9055/this.CONSTANTS.uranCoef, speed: 400, id: 'uran'},
            {distanceToSun: 30, semiMajorAxis: 30.0806/this.CONSTANTS.neptunCoef, semiMinorAxis: 30.0788/this.CONSTANTS.neptunCoef, centerToFocus: 0.2587/this.CONSTANTS.neptunCoef, speed: 800, id: 'neptun'}
		];
		this.mainAsteroidBelt = [
		    {maxSemiMajorAxis: 2, number: 10, minSemiMajorAxis: 1.8, rayleighSigma: 0.0559, speed: 70, id: 'inner'},
		    {maxSemiMajorAxis: 3.2, number: 500, minSemiMajorAxis: 2,  rayleighSigma: 0.0772, speed: 70, id: 'middle'},
		    {maxSemiMajorAxis: 4.6, number: 10, minSemiMajorAxis: 3.2,  rayleighSigma: 0.0974, speed: 70, id: 'outer'},
		]
	}
}