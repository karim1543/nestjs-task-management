export interface Task{
    id:string;
    title:string;
    description:string;
    status:taskStatus;
}
export enum taskStatus {
    OPEN='OPEN',
    IN_PROGRESS='in-progress',
    DONE='DONE'
}