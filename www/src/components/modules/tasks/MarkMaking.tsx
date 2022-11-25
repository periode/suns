import MarkMaker from "../../entrypoints/welcome/MarkMaker/MarkMaker"

interface MarkMakingProps {
	setMark: React.Dispatch<Blob>
}

const MarkMaking = ({setMark} : MarkMakingProps) => {
    return (
        <>
            <MarkMaker setMark={setMark} />
        </>
    )
}

export default MarkMaking