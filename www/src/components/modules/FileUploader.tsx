// needs setUploads, needsPreview

const FileUploader = () => {
    return (<>
        <p>
            <input type="file" capture="environment" accept="video/*" />
        </p>
    </>)
}

export default FileUploader