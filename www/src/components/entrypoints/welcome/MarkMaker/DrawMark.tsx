import p5Types from "p5";

export type AddOnFunction = (
	p5: p5Types, 
	posx: number,
	posy: number
) => void

export type ElementFunction = (
	p5: p5Types, 
	_index: number, 
	framewidth: number, 
	elements: IElement[], 
	addOnTypes: AddOnFunction[]
) => void

export interface IElement {
	posx:			number
	posy:			number
	rotation:		number

	lineWidth:		number
	lineCurved:		boolean
	curveAmount:	number

	hasCircle: 		boolean
	circleSize:		number
	circleOffset:	number

	scalex: 		number
	scaley:			number
	scale:			number

	hasOpenSide:	boolean
	openSide:		number
	fill:			boolean

	addOn:			AddOnFunction
	hasAddOn:		boolean
	type:			ElementFunction
}

export class ElementClass implements IElement {
	posx:			number	= 0
	posy:			number	= 0
	rotation:		number	= 0
	
	lineWidth:		number	= 0
	lineCurved:		boolean	= false
	curveAmount:	number	= 0
	
	hasCircle:		boolean	= false
	circleSize:		number	= 0
	circleOffset:	number	= 0
	
	scalex:			number	= 0
	scaley:			number	= 0
	scale:			number	= 0
	
	hasOpenSide:	boolean	= false
	openSide:		number	= 0
	fill:			boolean	= true
	
	addOn:			AddOnFunction	= drawStrokes
	hasAddOn:		boolean	= false
	type:			ElementFunction	= drawCross
}


export const drawHexagon = (p5: p5Types) => {

	// Octagon geometry:
	// https://en.wikipedia.org/wiki/Silver_ratio

	var silverRatio : number = 1 + Math.SQRT2

	var number4 : number = p5.width
	var number1 : number = 0
	var number2 : number = p5.width / (1 + silverRatio)
	var number3: number = p5.width - number2

	p5.push();
	p5.line(number2,number1,number3,number1);
	p5.line(number3,number1,number4,number2);
	p5.line(number4,number2,number4,number3);
	p5.line(number4,number3,number3,number4);
	p5.line(number3,number4,number2,number4);
	p5.line(number2,number4,number1,number3);
	p5.line(number1,number3,number1,number2);
	p5.line(number1,number2,number2,number1);
	p5.pop();
}

export const drawCross = (
	p5: p5Types, 
	_index: number, 
	framewidth: number, 
	elements : IElement[], 
	addOnTypes: AddOnFunction[]) =>
{
	var nC : IElement = new ElementClass();
	if (elements.length <= _index) {
		//description of a cross
		nC = {
			...nC,
			posx: framewidth + (Math.random() * (p5.width - framewidth * 2)),
			posy: framewidth + (Math.random() * (p5.height - framewidth * 2)),
			rotation: Math.random() * 360,
			scale: 10 + Math.random() * 40,
			lineWidth: 1 + Math.random() * 6,
			hasCircle: (Math.random() > 0.5) ? true : false,
			circleSize: 10 + Math.random() * 20,
			circleOffset: -1.5 + (Math.random() * 3),
			addOn: addOnTypes[Math.floor(addOnTypes.length * Math.random())],
			hasAddOn: (Math.random() > 0.7) ? true : false,
			type: drawCross
		}
		elements.push(nC);
	}
	else {
		nC = elements[_index]
		elements[_index].posx += -5 + (Math.random() * 10);
		elements[_index].posy += -5 + (Math.random() * 10);
		elements[_index].rotation += -5 + (Math.random() * 10);
		elements[_index].lineWidth += -0.1 + (Math.random() * 0.2);
		elements[_index].hasCircle = (Math.random() > 0.5) ? true : false;
		elements[_index].circleSize += -1 + (Math.random() * 2);
		elements[_index].circleOffset += -1 + (Math.random() * 2);
	}

	p5.push();

	p5.translate(p5.width / 2, p5.height / 2);
	p5.noFill()
	p5.rotate(nC.rotation);
	p5.translate(-1 * p5.width / 2, -1 * p5.height / 2);

	p5.strokeWeight(nC.lineWidth);
	p5.translate(nC.posx, nC.posy);
	
	if (nC.hasCircle)
		p5.ellipse(nC.circleOffset, nC.circleOffset, nC.circleSize);
	
	p5.line(-nC.scale, -nC.scale, nC.scale, nC.scale);
	p5.line(nC.scale, -nC.scale, -nC.scale, nC.scale);
    
	p5.pop();

	if (nC.hasAddOn)
		nC.addOn(p5, nC.posx, nC.posy)
}

export const drawArrow = (
	p5: p5Types, 
	_index: number, 
	framewidth: number, 
	elements: IElement[],
	addOnTypes: AddOnFunction[]
) => {
	var nC: IElement = new ElementClass()
	if(elements.length <= _index){
        //description of a arrow
		nC = {
			...nC,
            posx: framewidth + (Math.random() * (p5.width - framewidth * 2)),
            posy: framewidth + (Math.random() * (p5.height - framewidth * 2)),
            rotation: Math.random() * 360,
            scale: 10 + Math.random() * 20,
            lineWidth: 1 + Math.random() * 3,
            lineCurved: (Math.random() > 0.5) ? true : false,
            curveAmount: -45 + Math.random() * 90,
            type: drawArrow
        }
        elements.push(nC);
    }
    else{
        nC = elements[_index];
        nC.posx += -5 + (Math.random()*10);
        nC.posy += -5 + (Math.random()*10);
        nC.rotation += -5 + (Math.random()*10);
        nC.lineWidth += -0.1 + (Math.random()*0.2);
        nC.scale += -1 + (Math.random()*2);
        nC.lineCurved = (Math.random() > 0.5) ? true : false;
        nC.curveAmount = -45 + Math.random() * 90;
    }
    p5.push();

    p5.translate(p5.width / 2, p5.height / 2);
    p5.rotate(nC.rotation);
    p5.translate(-1 * p5.width / 2, -1 * p5.height / 2);

    p5.strokeWeight(nC.lineWidth);
    p5.translate(nC.posx,nC.posy);
    p5.line(0,0,nC.scale,0);
    p5.line( 0,0,0,nC.scale);
    if(nC.lineCurved === false) p5.line(0,0,100,100);
    else{
        p5.bezier(0, 0, 100, 100, 100, nC.curveAmount,  100, 200);
    }
    p5.pop(); 
}
export const drawOpenBox = (
	p5: p5Types, 
	_index: number, 
	framewidth: number, 
	elements : IElement[], 
	addOnTypes: AddOnFunction[]) => {
    var nC = new ElementClass();
    if(elements.length <= _index){
        //description of a box
		nC = {
			...nC,
            posx: framewidth + (Math.random() * (p5.width - framewidth * 2)),
            posy: framewidth + (Math.random() * (p5.height - framewidth * 2)),
            rotation: Math.random() * 360,
            scalex: 10 + Math.random() * 60,
            scaley: 10 + Math.random() * 60,
            lineWidth: 1 + Math.random() * 12,
            hasOpenSide: (Math.random() > 0.5) ? true : false,
            openSide: Math.floor(Math.random() * 4),
            fill: (Math.random() > 0.5) ? true : false,
            addOn: addOnTypes[Math.floor(addOnTypes.length * Math.random())],
            hasAddOn: (Math.random() > 0.7) ? true : false,
            type: drawOpenBox
        }
        elements.push(nC);
    }
	else {
        nC = elements[_index];
        nC.posx += -5 + (Math.random()*10);
        nC.posy += -5 + (Math.random()*10);
        nC.rotation += -5 + (Math.random()*10);
        nC.lineWidth += -0.1 + (Math.random()*0.2);
        nC.hasOpenSide = (Math.random() > 0.5) ? true : false;
        nC.openSide = Math.floor(Math.random() * 4);
		nC.fill = (Math.random() > 0.5) ? true : false;
        nC.scalex += -10 + (Math.random()*20);
        nC.scaley += -10 + (Math.random()*20);
    }
    p5.push();

    p5.translate(p5.width / 2, p5.height / 2);
    p5.rotate(nC.rotation);
    p5.translate(-1 * p5.width / 2, -1 * p5.height / 2);

    p5.strokeWeight(nC.lineWidth);
    p5.translate(nC.posx,nC.posy);
    if(nC.openSide !== 0 || nC.hasOpenSide === false){
        p5.line(-nC.scalex,-nC.scaley,nC.scalex,-nC.scaley);
    }
    if(nC.openSide !== 1 || nC.hasOpenSide === false){
        p5.line(nC.scalex,-nC.scaley,nC.scalex,nC.scaley);
    }
    if(nC.openSide !== 2 || nC.hasOpenSide === false){
        p5.line(nC.scalex,nC.scaley,-nC.scalex,nC.scaley);
    }
    if(nC.openSide !== 3 || nC.hasOpenSide === false){
        p5.line(-nC.scalex,nC.scaley,-nC.scalex,-nC.scaley);
    }
    if(nC.fill === true){
        p5.noStroke();
        p5.fill(255);
        p5.rect(nC.scalex * -1,nC.scaley * -1,nC.scalex*2,nC.scaley*2);
    }
	p5.pop(); 

	
	if (nC.hasAddOn)
		nC.addOn(p5, nC.posx, nC.posy)

}

export const drawStrokes = (
	p5: p5Types, 
	posx: number,
	posy: number
) => {
		var count = 1 + Math.floor(Math.random() * 5);
		var start = Math.floor(count / 2) * -1;
		var end = count + start;
		var angle = Math.random() * 20;
		var length = Math.random() * 20;
		var delta = 10 + Math.random() * 30;
		p5.strokeWeight(1 + Math.random() * 6);
		
		for (let i = start; i < end; i++){
			p5.push();

			p5.translate(p5.width / 2, p5.height / 2);
			p5.noFill()
			p5.rotate(angle);
			p5.translate(-1 * p5.width / 2, -1 * p5.height / 2);
			
			p5.translate(posx + delta * i, posy );
			p5.line(0,-length,0,length);

			p5.pop();
		}
		
}