'use strict';

class SolarSystemModel {

	constructor () {
		this.registerConstants();
		this.registerPlanets();
		this.renderPlanets();
		this.renderOrbits();
		this.renderAsteroids();
	}

	animate(id, semiMajorAxis, semiMinorAxis, centerToFocus, speed, planet, angle) {
		let s = 2 * this.CONSTANTS.PI/(180*semiMajorAxis);

        setInterval(() => {
            angle -= s; // move counterclockwise
            planet.style.left =  this.CONSTANTS.astronomicalUnitsToPx * (centerToFocus + semiMajorAxis * Math.sin(angle))
                                + this.CONSTANTS.sunSizeInPx/2 + 'px';
            planet.style.bottom =  this.CONSTANTS.astronomicalUnitsToPx * (semiMinorAxis * Math.cos(angle))
                                + this.CONSTANTS.sunSizeInPx/2 + 'px';

        }, speed/semiMajorAxis);

	}

	renderOrbits () {
	    this.planets.forEach((planet) => {
	        planet['size'] = document.getElementById(planet.id).style.width
	    })

		const canvas = document.getElementById('orbits');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.strokeStyle = "grey";
        ctx.setLineDash([2]);

        this.planets.forEach((planet) => {
            const canvas = document.getElementById('orbits');
            ctx.beginPath();
            ctx.ellipse(this.CONSTANTS.sunLeftPosition + this.CONSTANTS.sunRadius
                        + planet.centerToFocus*this.CONSTANTS.astronomicalUnitsToPx + planet.orbitDelta,
                        this.CONSTANTS.sunTopPosition + this.CONSTANTS.sunRadius - planet.orbitDelta,
                        planet.semiMajorAxis * this.CONSTANTS.astronomicalUnitsToPx,
                        planet.semiMinorAxis * this.CONSTANTS.astronomicalUnitsToPx,
                        0,
                        0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
		});
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
                expectation = (asteroidClassInfo.maxSemiMajorAxis + asteroidClassInfo.minSemiMajorAxis)/2,
                standardDeviation = (asteroidClassInfo.maxSemiMajorAxis - asteroidClassInfo.minSemiMajorAxis)/asteroidClassInfo.standardDeviationCoef,
                semiMajorAxis = this.sample_from_normal_distribution(expectation, standardDeviation),
                semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity),
                aster = document.createElement('div');

            aster.className = "asteroids";
            aster.id = 'asteroid' + i;
            aster.bottom =  this.CONSTANTS.sunBottomPosition + 2*this.CONSTANTS.PI/(i * semiMinorAxis) +  "px";
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
			sunTopPosition: document.documentElement.clientHeight * 0.44,
            sunLeftPosition:  document.documentElement.clientWidth * 0.48,
            sunSizeInPx: 30,
            sunRadius: 15,
            uranCoef: 1.5,
            neptunCoef: 2,
            asteroidsContainer: document.getElementById('asteroids'),
		};
		console.log(this.CONSTANTS)
	}

	registerPlanets () {
		this.planets = [
			{distanceToSun: 0.4, semiMajorAxis: 0.387, semiMinorAxis: 0.3788, centerToFocus: 0.0796, speed: 10, id: 'mercury', orbitDelta: 1},
			{distanceToSun: 0.7, semiMajorAxis: 0.7219, semiMinorAxis: 0.7219, centerToFocus: 0.0049, speed: 18, id: 'venus', orbitDelta: 3},
			{distanceToSun: 1, semiMajorAxis: 1.0027, semiMinorAxis: 1.0025, centerToFocus: 0.0167, speed: 40, id: 'earth', orbitDelta: 7},
			{distanceToSun: 1.5, semiMajorAxis: 1.5241, semiMinorAxis: 1.5173, centerToFocus: 0.1424, speed: 40, id: 'mars', orbitDelta: 7},
        	{distanceToSun: 5.2, semiMajorAxis: 5.2073, semiMinorAxis:5.2010, centerToFocus: 0.2520, speed: 50, id: 'jupiter', orbitDelta: 7},
			{distanceToSun: 9.6, semiMajorAxis: 9.5590, semiMinorAxis: 9.5231, centerToFocus: 0.5181, speed: 60, id: 'saturn', orbitDelta: 8},
			{distanceToSun: 19.2, semiMajorAxis: 19.1848/this.CONSTANTS.uranCoef, semiMinorAxis: 19.1645/this.CONSTANTS.uranCoef, centerToFocus: 0.9055/this.CONSTANTS.uranCoef, speed: 400, id: 'uranus', orbitDelta: 7},
            {distanceToSun: 30, semiMajorAxis: 30.0806/this.CONSTANTS.neptunCoef, semiMinorAxis: 30.0788/this.CONSTANTS.neptunCoef, centerToFocus: 0.2587/this.CONSTANTS.neptunCoef, speed: 800, id: 'neptune', orbitDelta: 4}
		];
		this.mainAsteroidBelt = [
		    {maxSemiMajorAxis: 2.2, standardDeviationCoef: 6,  number: 50, minSemiMajorAxis: 2, rayleighSigma: 0.0559, speed: 70, id: 'asteroid'},
		    {maxSemiMajorAxis: 3.2, standardDeviationCoef: 2, number: 500, minSemiMajorAxis: 2.2,  rayleighSigma: 0.0772, speed: 70, id: 'asteroid'},
		    {maxSemiMajorAxis: 4.6, standardDeviationCoef: 6, number: 50, minSemiMajorAxis: 3.2,  rayleighSigma: 0.0974, speed: 70, id: 'asteroid'}
		]
	}

	1.9
}