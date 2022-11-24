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
	setMark: React.Dispatch<Blob>
}

function MarkMaker({setMark} : MarkMakerProps) {

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

	const handleConfirmation = () => {
		let el = document.getElementById("defaultCanvas0") as HTMLCanvasElement
		let f : File
		 el.toBlob(blob => {
			if(blob)
				f = new File([blob], "mark.png")
			else
				console.warn("mark blob is empty!", blob)
			
			setMark(f)

			//-- todo handle UX change (confirm should do the same job as next)
		 })
	}
	
	return (
		<>
			<Sketch setup={setup} draw={draw} />
			<button onClick={() => setIsCreated(false)}>Create</button>
			<button onClick={() => setIsUpdated(false)}>Update</button>
			<button onClick={handleConfirmation}>Confirm</button>
		</>
	);
}

export default MarkMaker;