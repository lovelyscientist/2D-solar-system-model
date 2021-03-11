'use strict';

class SolarSystemModel {

	constructor () {
		this.registerConstants();
		this.registerPlanets();
		this.renderPlanets();
		this.renderOrbits();
		this.renderShadows();
		this.renderAsteroids();
		this.renderSunRotation();
		this.initResizeListener();
		this.initSound();
	}

	initResizeListener () {
	    window.addEventListener("resize", () => {
	        const canvas = document.getElementById('orbits'),
                  context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);

            console.log(document.documentElement.clientWidth);

            this.registerConstants();
            this.renderOrbits();
		    this.renderShadows();
        });
	}

	initSound () {
	    let audioElement = document.querySelector('audio'),
	        speakerButton = document.getElementById('sound');

        speakerButton.addEventListener('click', ()=> {
            if (!this.soundOn) {
                audioElement.play();
                this.soundOn = true;
                speakerButton.style.opacity = 1;
                speakerButton.style.backgroundImage = 'url("img/speaker_on.png")'
            } else {
                audioElement.pause();
                this.soundOn = false;
                speakerButton.style.opacity = 0.6;
                speakerButton.style.backgroundImage = 'url("img/speaker_off.png")'
            }
        })
	}

	ellipseLength (a, b) {
        return this.CONSTANTS.PI * (3*(a + b) - Math.sqrt((3*a + b)*(a + 3*b)))
	}

	pxToNumber(value) {
	    return Number.parseInt(value.replace('px', ''))
	}

	animate(id, semiMajorAxis, semiMinorAxis, centerToFocus, speed, planet, rotationPeriod, angle) {
		let s = (1/45)/semiMajorAxis,
		    rotationAngle = 0, rotation_s,
		    counter = 0, startLeft, startBottom, angleObj = {'angle': angle},
		    targetProxy = new Proxy(angleObj, {
              set: function (target, key, value) {
                  target[key] = value;
                  let fullAngle = 0;
                  return true;
              },
              get: function(target, name) {
                    return target[name]
               }
            });

        setInterval(() => {
            targetProxy.angle -= s; // move counterclockwise
            if (targetProxy.angle < -6.26626) {
                targetProxy.angle = 0
            }
            planet.style.left =  this.CONSTANTS.astronomicalUnitsToPx * (centerToFocus + semiMajorAxis * Math.sin(targetProxy.angle))
                               + this.CONSTANTS.sunSizeInPx/2 + 'px';
            planet.style.bottom =  this.CONSTANTS.astronomicalUnitsToPx * (semiMinorAxis * Math.cos(targetProxy.angle))
                                + this.CONSTANTS.sunSizeInPx/2 + 'px';

        }, speed/semiMajorAxis);

        if (id != 'asteroid' && id != 'saturn-container') { // planet's rotation
             let planetToRotate = document.getElementById(id.replace('-container', ''))
             rotation_s = 3
             setInterval(() => {
                if (id != 'venus-container' && id != 'uranus-container') { // counter-clock wise
                    rotationAngle -= rotation_s
                    if (rotationAngle < -360) {
                        rotationAngle = rotationAngle/360
                    }
                } else { // retrograde for venus and uranus
                    rotationAngle += rotation_s
                    if (rotationAngle > 360) {
                        rotationAngle = rotationAngle/360
                    }
                }

                planetToRotate.style.transform = 'rotate(' + rotationAngle.toString()  + 'deg)'

            }, rotationPeriod);

        }

	}

	renderSunRotation () {
	    let objectToRotate = document.getElementById('sun-container'),
             rotation_s = 3,
             rotationAngle = 0;

             setInterval(() => {
                rotationAngle -= rotation_s
                if (rotationAngle < -360) {
                    rotationAngle = rotationAngle/360
                }
                objectToRotate.style.transform = 'rotate(' + rotationAngle.toString()  + 'deg)'

            }, 60);
	}

	renderOrbits () {
	    this.planets.forEach((planet) => {
	        planet['size'] = document.getElementById(planet.id.replace('-container', '')).offsetWidth
	    })

		const canvas = document.getElementById('orbits'),
		      ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.strokeStyle = "grey";
        ctx.lineWidth = 1;
        ctx.setLineDash([2]);

        this.planets.forEach((planet) => {
            ctx.beginPath();
            ctx.ellipse(this.CONSTANTS.sunLeftPosition + this.CONSTANTS.sunRadius
                        + planet.centerToFocus*this.CONSTANTS.astronomicalUnitsToPx  + planet.orbitDelta,
                        this.CONSTANTS.sunTopPosition + this.CONSTANTS.sunRadius - planet.orbitDelta,
                        planet.semiMajorAxis * this.CONSTANTS.astronomicalUnitsToPx,
                        planet.semiMinorAxis * this.CONSTANTS.astronomicalUnitsToPx,
                        0,
                        0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        });
	}

	renderShadows () {
		const canvas = document.getElementById('orbits'),
		      ctx = canvas.getContext('2d');

        ctx.strokeStyle = "#020614";
        ctx.globalCompositeOperation='destination-over';
        ctx.globalAlpha = 0.6;
        ctx.setLineDash([0]);

        this.planets.forEach((planet) => {
            if (planet.id != 'mercury-container' && planet.id != 'neptune-container' && planet.id != 'uranus-container') {
                ctx.lineWidth = planet.shadowWidth;
                ctx.beginPath();
                ctx.ellipse(this.CONSTANTS.sunLeftPosition + this.CONSTANTS.sunRadius
                                + planet.centerToFocus*this.CONSTANTS.astronomicalUnitsToPx  + planet.orbitDelta,
                                this.CONSTANTS.sunTopPosition + this.CONSTANTS.sunRadius - planet.orbitDelta,
                                planet.semiMajorAxis * this.CONSTANTS.astronomicalUnitsToPx + planet.size/2,
                                planet.semiMinorAxis * this.CONSTANTS.astronomicalUnitsToPx + planet.size/2,
                                0,
                                0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
            }
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
			this.animate(planet.id, planet.semiMajorAxis, planet.semiMinorAxis, planet.centerToFocus,  planet.speed, document.getElementById(planet.id), planet.rotationPeriod, 90);
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
            aster.style.width = this.sample_from_normal_distribution(1, 0.75) + 'px';
            aster.style.height =  this.sample_from_normal_distribution(1, 0.75) + 'px';
            aster.id = 'asteroid' + i;
            aster.bottom =  this.CONSTANTS.sunBottomPosition + 2*this.CONSTANTS.PI/(i * semiMinorAxis) +  "px";
			aster.left = this.CONSTANTS.sunLeftPosition + 2*this.CONSTANTS.PI/(i * semiMajorAxis)  + "px";

			this.CONSTANTS.asteroidsContainer.appendChild(aster);
            this.animate(asteroidClassInfo.id, semiMajorAxis, semiMinorAxis, eccentricity*semiMajorAxis, asteroidClassInfo.speed, aster, 0, i);
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
            uranusCoef: 1.5,
            neptuneCoef: 2,
            asteroidsContainer: document.getElementById('asteroids'),
		};
	}

	registerPlanets () {
		this.planets = [
			{distanceToSun: 0.4, semiMajorAxis: 0.387, semiMinorAxis: 0.3788, centerToFocus: 0.0796, speed: 8.7, id: 'mercury-container', orbitDelta: -0.25, shadowWidth: 0, rotationPeriod: 140.7},
			{distanceToSun: 0.7, semiMajorAxis: 0.7219, semiMinorAxis: 0.7219, centerToFocus: 0.0049, speed: 22.4, id: 'venus-container', orbitDelta: 5, shadowWidth: 10, rotationPeriod: 583.25},
			{distanceToSun: 1, semiMajorAxis: 1.1527, semiMinorAxis: 1.1525, centerToFocus: 0.0167, speed: 36.5, id: 'earth-container', orbitDelta: 7, shadowWidth: 15, rotationPeriod: 2.39},
			{distanceToSun: 1.5, semiMajorAxis: 1.6741, semiMinorAxis: 1.6773, centerToFocus: 0.1424, speed: 68.6, id: 'mars-container', orbitDelta: 5, shadowWidth: 8, rotationPeriod: 2.46},
        	{distanceToSun: 5.2, semiMajorAxis: 5.2073, semiMinorAxis:5.2010, centerToFocus: 0.2520, speed: 432.8, id: 'jupyter-container', orbitDelta: 9, shadowWidth: 20, rotationPeriod: 0.99},
			{distanceToSun: 9.6, semiMajorAxis: 9.5590, semiMinorAxis: 9.5231, centerToFocus: 0.5181, speed: 1073.8, id: 'saturn-container', orbitDelta: 12, shadowWidth: 20, rotationPeriod: 1.07},
			{distanceToSun: 19.2, semiMajorAxis: 19.1848/this.CONSTANTS.uranusCoef, semiMinorAxis: 19.1645/this.CONSTANTS.uranusCoef, centerToFocus: 0.9055/this.CONSTANTS.uranusCoef, speed: 305.68, id: 'uranus-container', orbitDelta: 6, shadowWidth: 0, rotationPeriod: 17.2},
            {distanceToSun: 30, semiMajorAxis: 30.0806/this.CONSTANTS.neptuneCoef, semiMinorAxis: 30.0788/this.CONSTANTS.neptuneCoef, centerToFocus: 0.2587/this.CONSTANTS.neptuneCoef, speed: 597.57, id: 'neptune-container', orbitDelta: 4, shadowWidth: 0, rotationPeriod: 16.1}
		];

		this.mainAsteroidBelt = [
		    {maxSemiMajorAxis: 2.2, standardDeviationCoef: 6,  number: 50, minSemiMajorAxis: 2, rayleighSigma: 0.0559, speed: 133.2, id: 'asteroid'},
		    {maxSemiMajorAxis: 3.2, standardDeviationCoef: 2, number: 500, minSemiMajorAxis: 2.2,  rayleighSigma: 0.0772, speed: 168.2, id: 'asteroid'},
		    {maxSemiMajorAxis: 4.6, standardDeviationCoef: 6, number: 50, minSemiMajorAxis: 3.2,  rayleighSigma: 0.0974, speed: 203.3, id: 'asteroid'}
		]
	}
}

