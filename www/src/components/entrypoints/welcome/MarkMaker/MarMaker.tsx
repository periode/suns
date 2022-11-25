import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useRef, useState } from "react";
import {
	drawHexagon,
	drawArrow,
	drawCross,
	drawOpenBox,
	drawStrokes,
	IElement,
	ElementFunction,
	AddOnFunction
} from "./DrawMark";

interface MarkMakerProps {
}

function MarkMaker() {

	const [isCreated, setIsCreated] = useState(false)
	const [isUpdated, setIsUpdated] = useState(true)
	

	var elements = useRef<IElement[]>([]);

	let elementFuncs : ElementFunction[]= [drawCross, drawArrow, drawOpenBox];
	let addOnTypes: AddOnFunction[] = [drawStrokes];
	
	let framewidth = 100

	useEffect(() => {
		elements.current = new Array<IElement>()
	},[])

	var canvasRef = useRef<null | HTMLCanvasElement>(null)
	
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(400, 400).parent(canvasRef);
		p5.angleMode("degrees")
	}


	const createMark = (p5: p5Types) => {

		drawHexagon(p5);
		var countElements = 2 + Math.floor(Math.random() * 3.0)
		for (let i = 0; i < countElements; i++)
		{
			var t = Math.floor(Math.random() * elementFuncs.length);
			elementFuncs[t](
				p5,
				i,
				framewidth,
				elements.current,
				addOnTypes
			)
		}
	}
	const alterMark = (p5: p5Types) => {
		
		drawHexagon(p5)

		for (let i = 0; i < elements.current.length; i++)	
		{
			elements.current[i].type(
				p5,
				i,
				framewidth,
				elements.current,
				addOnTypes
			)
		}
	}

	const writeCanvas = (p5: p5Types) => {

		const img = p5.get()
		if (canvasRef)
			console.log(canvasRef.current?.toDataURL())
		
		// p5.storeItem("markItem", img)
		// console.log(p5.getItem("mark"))
	}

	const draw = (p5: p5Types) => {

		p5.createWriter('user')
		if (!isCreated)	
		{ 
			p5.clear();
			createMark(p5)
			writeCanvas(p5)
			setIsCreated(true)
		}
		if (!isUpdated)	
		{
			p5.clear();
			alterMark(p5)
			writeCanvas(p5)
			setIsUpdated(true)
		}
	}



	// On component creation : create mark.
	
	return (
		<>
			<canvas ref={canvasRef} ></canvas>
			<Sketch setup={setup} draw={draw} />
			<button onClick={() => setIsCreated(false)}>Create</button>
			<button onClick={() => setIsUpdated(false)}>Update</button>
		</>
	);
}

export default MarkMaker;