//--------
//-- enums
//--------
export enum ENTRYPOINT_STATUS {
    EntrypointPending = "pending",
    EntrypointCompleted = "completed",
    EntrypointOpen = "open",
}

export enum PARTNER_STATUS {
    PartnerNone = "none",
    PartnerPartial = "partial",
    PartnerFull = "full",
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
    name: string,
    status: ENTRYPOINT_STATUS,
    content: string,
    current_module: number,
    modules: Array<IModule>,
    users: Array<IUser>
    max_users: number,
    user_completed: Array<number>,
    partner_status: PARTNER_STATUS,
    lat: number,
    lng: number,
    icon: string,
}

export interface IUpload {
    user_uuid: string,
    url: string,
    name: string,
    text: string,
    type: string,
}

export interface IFile {
    file?: File,
    text: string
}

export interface IContent {
    type: string,
    key: string
}

export interface ITask {
    type: string,
    key: string,
    placeholder?: string,
    max_uploads?: number
}

export interface IModule {
    ID: string,
    uuid: string,
    name: string,
    content: string,
    type: string,
    uploads: Array<IUpload>,
    status: string,
    contents: Array<IContent>,
    tasks: Array<ITask>
}

export interface IUser {
    name: string,
    uuid: string,
}

export interface ISession {
    token: string,
    user: IUser
}