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
			stars[i].style.top = Math.floor(Math.random() * this.CONSTANTS.clientScreenHeight)+"px";

			this.CONSTANTS.starsContainer.appendChild(stars[i]);  
		}
	}

	animatePlanet (radius, speed, planet) {
		let s = 2 * this.CONSTANTS.PI/180,
			dotCount = 0,
    		angle = 0;

    	setInterval(() => {
    		angle += s;
    		dotCount++;
    		planet.style.left = this.CONSTANTS.planetStartPosition + 2 * radius * Math.sin(angle)  + 'px';
    		planet.style.top =  this.CONSTANTS.planetStartPosition + radius * Math.cos(angle) + 'px';

    		this.createPlanetOrbit(dotCount, planet);
    	}, speed);
	}

	createPlanetOrbit (dotCount, planet) {
		if (dotCount % 2 === 0 && dotCount < this.CONSTANTS.fullCircleDegrees) {
    		let d = document.createElement('div');

			d.className = "dots";
			d.style.left = planet.style.left;
			d.style.top = planet.style.top;

			this.CONSTANTS.orbitsContainer.appendChild(d);  
	    }
	}

	renderPlanets () {
		this.planets = this.planets.sort((a, b) => {return a.speed < b.speed});
		
		this.planets.forEach((planet) => {
			this.animatePlanet(planet.radius, planet.speed, document.getElementById(planet.id));
		});
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
			PI: Math.PI
		};
	}

	registerPlanets () {
		this.planets = [
			{radius: this.CONSTANTS.screenHeight-75, speed: 400, id: 'uran'},
			{radius: this.CONSTANTS.screenHeight-55, speed: 800, id: 'neptun'},
			{radius: 50, speed: 10, id: 'mercury'},
			{radius: 95, speed: 18, id: 'venus'},
			{radius: 150, speed: 40, id: 'mars'},
			{radius: 170, speed: 50, id: 'jupiter'},
			{radius: 210, speed: 100, id: 'earth'},
			{radius: 130, speed: 30, id: 'saturn'}
		];
	}
}