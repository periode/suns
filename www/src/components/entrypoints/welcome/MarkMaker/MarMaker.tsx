import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useState } from "react";
import {
	drawHexagon,
	drawArrow,
	drawCross,
	drawOpenBox,
	drawStrokes,
	IElement,
	ElementFunction
} from "./DrawMark";

interface MarkMakerProps {
	alterMark : () => {}
}

function MarkMaker() {

	const [isCreated, setIsCreated] = useState(false)
	const [isUpdated, setIsUpdated] = useState(true)


	let elements: IElement[] = [];
	let elementFuncs : ElementFunction[]= [drawCross, drawArrow, drawOpenBox];
	let addOnTypes: string[] = ['drawStrokes'];
	
	let framewidth = 100
	
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(400, 400).parent(canvasParentRef);
		p5.angleMode("degrees")
	}


	const createMark = (p5: p5Types) => {
		p5.background(255); // Trans insteads?
		drawHexagon(p5);
		var countElements = 2 + Math.floor(Math.random() * 3.0)
		for (let i = 0; i < countElements; i++)
		{
			var t = Math.floor(Math.random() * elementFuncs.length);
			elementFuncs[t](
				p5,
				i,
				framewidth,
				elements,
				addOnTypes
			)
		}
	}
	const alterMark = (p5: p5Types) => {
		p5.background(255); // Trans insteads?
		drawHexagon(p5)
		for (let i = 0; i < elements.length; i++)	
		{
			elements[i].type(
				p5,
				i,
				framewidth,
				elements,
				addOnTypes
			)
		}
	}

	const draw = (p5: p5Types) => {
		if (!isCreated)	
		{ 
			createMark(p5)
			setIsCreated(true)
		}
		if (!isUpdated)	
		{ 
			alterMark(p5)
			setIsUpdated(true)
		}
	}



	// On component creation : create mark.
	
	return (
		<>
			<Sketch setup={setup} draw={draw} />
			<button onClick={() => setIsCreated(false)}>Create</button>
			<button onClick={() => setIsUpdated(false)}>Update</button>
		</>
	);
}

export default MarkMaker;