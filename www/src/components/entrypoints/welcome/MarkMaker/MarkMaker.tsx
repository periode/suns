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
import BorderLessButton from "../../../commons/buttons/BorderLessButton";
import { FiLoader, FiRotateCcw } from "react-icons/fi";

interface MarkMakerProps {
	setMark: React.Dispatch<Blob>
}

function MarkMaker({
	setMark
} : MarkMakerProps) {

	const [isCreated, setIsCreated] = useState(false)
	const [isUpdated, setIsUpdated] = useState(true)

	var elementRef = useRef<IElement[]>([])

	useEffect(() => {
		elementRef.current = new Array<IElement>()
	}, [])

	let elementFuncs : ElementFunction[]= [drawCross, drawArrow, drawOpenBox];
	let addOnTypes: AddOnFunction[] = [drawStrokes];
	
	let framewidth = 100

	
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(320, 320).parent(canvasParentRef);
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
				elementRef.current,
				addOnTypes
			)
		}
	}
	const alterMark = (p5: p5Types) => {
		
		drawHexagon(p5)

		for (let i = 0; i < elementRef.current.length; i++)	
		{
			elementRef.current[i].type(
				p5,
				i,
				framewidth,
				elementRef.current,
				addOnTypes
			)
		}
	}

	const draw = (p5: p5Types) => {

		p5.createWriter('user')
		if (!isCreated)	
		{ 
			p5.clear();
			createMark(p5)
			handleConfirmation()
			setIsCreated(true)
		}
		if (!isUpdated)	
		{
			p5.clear();
			alterMark(p5)
			handleConfirmation()
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
		<div className="w-full p-4">
			<div className="w-full flex flex-col gap-4 items-center">
				<div className="w-80 h-80 flex items-center justify-center ">
					<Sketch setup={ setup } draw={ draw } />
				</div>
				<div className="w-full flex gap-4 ">
					<BorderLessButton text="Create" action={() => { setIsCreated(false) }} icon={FiLoader} />
					<BorderLessButton text="Update" action={() => { setIsUpdated(false) }} icon={FiRotateCcw} />
				</div>
			</div>
		</div>
	);
}

export default MarkMaker;