
//--------
//-- enums
//--------
export enum ENTRYPOINT_STATUS {
    EntrypointOpen = "open",
    EntrypointPending = "pending",
    EntrypointCompleted = "completed",
    EntrypointSacrificed = "sacrificed"
}

// OWNED_ENTRYPOINT_STATUS is the status of an entrypoint that the user owns
export enum OWNED_ENTRYPOINT_STATUS {
    OwnedEntrypointActionable = "actionable",
    OwnedEntrypointWaiting = "waiting",
    OwnedEntrypointCompleted = "completed",
}

export enum PARTNER_STATUS {
    PartnerNone = "none",
    PartnerPartial = "partial",
    PartnerFull = "full",
}

export enum FINAL_TYPE {
    Tangled = "Tangled",
    TangledInverted = "Tangled Inverted",
    Separate = "Separate",
    // Custom:
    Crack = "Crack"
}

export enum UPLOAD_TYPE {
    Text = "txt",
    Image = "img",
    Video = "vid",
    Audio = "wav"
}

//--------
//-- types
//--------
export interface ICluster {
    uuid: string,
    name: string,
    entrypoints: Array<IEntrypoint>
}

export interface IEntrypoint {
    uuid: string,
    created_at: string,
    name: string,
    airtable_key: string,
    key: string,
    status: ENTRYPOINT_STATUS,
    cluster: ICluster,
    visibility: string,
    generation: number,
    sacrifice_wave: number,
    content: string,
    current_module: number,
    modules: Array<IModule>,
    users: Array<IUser>
    max_users: number,
    user_completed: Array<number>,
    partner_status: PARTNER_STATUS,
    final_module_type: FINAL_TYPE,
    lat: number,
    lng: number,
    icon: string,
}

export interface IUpload {
    ID: string,
    user_uuid: string,
    user_name: string,
    url: string,
    name: string,
    text: string,
    type: string,
    uuid: string,
}

export interface IFile {
    uuid: string,
    file?: File,
    text: string,
    type: UPLOAD_TYPE
}

export interface IContent {
    type: string,
    key: string,
    value?: string,
}

export interface ITask {
    uuid: string,
    type: string,
    key: string,
    placeholder?: string,
    min_limit?: number,
    max_limit?: number,
    text_type?: string,
    value?: string
}

export interface IModule {
    ID: string,
    uuid: string,
    name: string,
    content: string,
    type: string,
    showPreviousUploads: boolean,
    uploads: Array<IUpload>,
    status: string,
    contents: Array<IContent>,
    tasks: Array<ITask>
}

export interface IUser {
    name: string,
    uuid: string,
    mark_url: string,
    debug_account: boolean
}

export interface ISession {
    token: string,
    user: IUser
}

export type TaskDoneType = {
    key: string,
    value: boolean
};

export interface ISacrifice {
    uuid: string,
    generation: number,
    sacrifice_wave: number,
    users: Array<IUser>,
    name: string,
}