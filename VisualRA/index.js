const canvas = document.getElementById( "canvas" );
const ctx = canvas.getContext( "2d" );

function addAngleLine( a1, d1, a2, d2 ) {
	let x1 = Math.cos( a1 ) * d1;
	let y1 = Math.sin( a1 ) * d1;

	let x2 = Math.cos( a2 ) * d2;
	let y2 = Math.sin( a2 ) * d2;

	x1 += x2;
	y1 += y2;

	angle = Math.atan2( y1, x1 );
	dist = Math.sqrt( x1 * x1 + y1 * y1 );
	return [ angle, dist ];
}

class Bird {
	constructor() {
		this.x = Math.random() * 500;
		this.y = Math.random() * 500;
		this.vangle = 0;//Math.random() * Math.PI * 2;
		this.v = 25;
		this.aangle = 0;
		this.a = 10;

		this.packVal = Math.random();
	}

	update() {
		this.x += Math.cos( this.vangle ) * this.v / 10;
		this.y += Math.sin( this.vangle ) * this.v / 10;

		//if ( this.x < 0 ) {
		//	this.x = canvas.width;
		//} else if ( this.x > canvas.width ) {
		//	this.x = 0;
		//}
		//if ( this.y < 0 ) {
		//	this.y = canvas.height;
		//} else if ( this.y > canvas.height ) {
		//	this.y = 0;
		//}

		this.render();

		[ this.vangle, this.v ]  = addAngleLine( this.vangle, this.v, this.aangle, this.a / 50 );
		//this.v = Math.sign( this.v ) * Math.min( Math.abs( this.v ), 25 );
		this.v = 25;

		//let vx = Math.cos( this.vangle ) * this.v;
		//let vy = Math.sin( this.vangle ) * this.v;

		//let ax = Math.cos( this.aangle ) * this.a / 100;
		//let ay = Math.sin( this.aangle ) * this.a / 100;	

		//vx += ax;
		//vy += ay;

		//this.vangle = Math.atan2( vy, vx );
		//this.v = Math.sqrt( vx * vx + vy * vy );
	}

	render() {
		ctx.beginPath();
		ctx.lineWidth = 10;
		let x = 0;
		let y = 0;
		if ( this.x < 0 ) {
			x = canvas.width + this.x % canvas.width;
		} else {
			x = this.x % canvas.width;
		} if ( this.y < 0 ) {
			y = canvas.height + this.y % canvas.height;
		} else {
			y = this.y % canvas.height;
		}

		let xc = Math.abs( ( 100 * this.x / canvas.width ) % 255 );
		let yc = Math.abs( ( 100 * this.y / canvas.height ) % 255 );
		ctx.strokeStyle = `rgba( ${ Math.floor( xc ) }, 0, ${ Math.floor( yc ) }, 255 )`;

		ctx.moveTo( x, y );
		ctx.lineTo( x + Math.cos( this.vangle ) * this.v * length, y + Math.sin( this.vangle ) * this.v * length ); 
		ctx.stroke();
	}
}

let minForward = 50;
let maxForward = 200;
let minSideways = 50;
let minBackward = 0;

let length = 2;

let driveFactor = 10;

let ang = 0;

const b = new Bird();
const birds = []
for ( let i = 0; i < 1000; i++ ) {
	birds.push( new Bird() );
}

function loop() {
	ctx.clearRect( 0, 0, canvas.width, canvas.height );

	ang += 0.0011;

	let x = Math.cos( ang ) * canvas.width / 2 + canvas.width / 2;
	let y = Math.sin( 2 * ang ) * canvas.height / 4 + canvas.height / 2;
	let vx = x;
	let vy = y;
	if ( x < 0 ) {
		vx = canvas.width + x % canvas.width;
	} else {
		vx = x % canvas.width;
	} if ( y < 0 ) {
		vy = canvas.height + y % canvas.height;
	} else {
		vy = y % canvas.height;
	}
	ctx.fillStyle = "blue";
	ctx.fillRect( vx, vy, 10, 10 );
	
	ctx.strokeStyle = "red";
	for ( const o of birds ) {
		o.update();

		let ta = 0;
		let t = 0;
		ta += driveFactor * Math.atan2( y - o.y, x - o.x ) / ( 1 + Math.sqrt( ( y - o.y ) ** 2 + ( x - o.x ) ** 2 ) );
		t += driveFactor / ( 1 + Math.sqrt( ( y - o.y ) ** 2 + ( x - o.x ) ** 2 ) );
		for ( const i of birds ) {
			
			let rd = Math.sqrt( ( i.y - o.y ) ** 2 + ( i.x - o.x ) ** 2 );
			let d = Math.cos( Math.atan2( i.y - o.y, i.x - o.x ) - o.vangle ) * rd;
			let od = Math.sin( Math.atan2( i.y - o.y, i.x - o.x ) - o.vangle ) * rd;
			if ( d > minForward ) {
				if ( rd < maxForward ) {
					let f = 1 + ( maxForward - rd ) / ( maxForward / 5 );
					ta += f * Math.atan2( i.y - o.y, i.x - o.x );
					t += f
				}
			} else if ( d > minBackward && rd < minSideways ) {
				//console.log( Math.atan2( i.y - o.y, i.x - o.x ) );
				let f = 1 + ( minSideways - rd ) / ( minSideways / 5 );
				ta += f * ( ( Math.atan2( i.y - o.y, i.x - o.x ) - ( Math.sign( od ) *  Math.PI / 2 ) ) % Math.PI * 2 );
				t += f;
			}
		}
		
		if ( t > 0 ) {
			//console.log( ta, t );
			o.aangle = ta / t;
		}
		o.a = 150;
	}

	window.requestAnimationFrame( loop );
}

window.requestAnimationFrame( loop );
